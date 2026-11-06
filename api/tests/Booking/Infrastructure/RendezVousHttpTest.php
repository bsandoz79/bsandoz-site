<?php

declare(strict_types=1);

namespace App\Tests\Booking\Infrastructure;

use App\Booking\Domain\RendezVousRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Tools\SchemaTool;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

/**
 * Tests fonctionnels du module Booking : HTTP → cas d'usage → Doctrine (MySQL) → mails.
 * Ignorés si aucune base MySQL n'est joignable (la CI en fournit une).
 */
final class RendezVousHttpTest extends WebTestCase
{
    private KernelBrowser $client;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $em = static::getContainer()->get(EntityManagerInterface::class);
        \assert($em instanceof EntityManagerInterface);

        try {
            $em->getConnection()->executeQuery('SELECT 1');
        } catch (\Throwable $e) {
            self::markTestSkipped('Base MySQL de test indisponible : ' . $e->getMessage());
        }

        $schema = new SchemaTool($em);
        $metadonnees = $em->getMetadataFactory()->getAllMetadata();
        $schema->dropSchema($metadonnees);
        $schema->createSchema($metadonnees);
    }

    /** Premier jour ouvré (lundi à vendredi) à au moins 3 jours d'aujourd'hui : toujours réservable. */
    private static function jourReservable(): string
    {
        $jour = new \DateTimeImmutable('today +3 days', new \DateTimeZone('Europe/Paris'));
        while ((int) $jour->format('N') > 5) {
            $jour = $jour->modify('+1 day');
        }

        return $jour->format('Y-m-d');
    }

    /** @return array<string, mixed> */
    private function demande(array $changements = []): array
    {
        return $changements + [
            'lieu' => 'visio',
            'adresse' => null,
            'jour' => self::jourReservable(),
            'creneau' => '14:00',
            'nom' => 'Marie Dupont',
            'email' => 'marie@exemple.fr',
            'telephone' => '06 12 34 56 78',
            'activite' => 'Detailing',
            'message' => 'Un site avec réservation.',
        ];
    }

    private function reserver(array $donnees): void
    {
        $this->client->request('POST', '/rendez-vous', server: ['CONTENT_TYPE' => 'application/json'], content: json_encode($donnees, JSON_THROW_ON_ERROR));
    }

    /** @return array<string, mixed> */
    private function reponseJson(): array
    {
        return json_decode((string) $this->client->getResponse()->getContent(), true, 8, JSON_THROW_ON_ERROR);
    }

    private function jetonDuDernierRendezVous(): string
    {
        $mails = self::getMailerMessages();
        self::assertNotEmpty($mails);
        preg_match('#/rendez-vous/([a-f0-9]{64})#', (string) $mails[0]->getTextBody(), $trouve);
        self::assertNotEmpty($trouve, 'Le mail de confirmation doit contenir le lien de gestion.');

        return $trouve[1];
    }

    public function testReserveEnregistreEtEnvoieLesMails(): void
    {
        $this->reserver($this->demande());

        self::assertResponseStatusCodeSame(201);
        $reponse = $this->reponseJson();
        self::assertSame('confirme', $reponse['statut']);
        self::assertSame(self::jourReservable(), $reponse['jour']);
        self::assertSame('14:00', $reponse['creneau']);
        self::assertArrayNotHasKey('jeton', $reponse, 'Le jeton ne doit partir que par mail.');
        self::assertStringStartsWith('https://calendar.google.com/calendar/render?action=TEMPLATE', $reponse['agenda']['google']);
        self::assertStringStartsWith('https://outlook.live.com/calendar/0/action/compose?', $reponse['agenda']['outlook']);
        self::assertStringEndsWith("/rendez-vous/{$reponse['id']}/agenda.ics", $reponse['agenda']['ics']);
        self::assertStringNotContainsString($this->jetonDuDernierRendezVous(), json_encode($reponse['agenda'], \JSON_THROW_ON_ERROR));

        // 2 mails du rendez-vous, + 1 lien d'activation : sur bsandoz.fr, le premier rendez-vous ouvre un compte (src/Liaisons).
        self::assertEmailCount(3);
        $jeton = $this->jetonDuDernierRendezVous();
        $depot = static::getContainer()->get(RendezVousRepository::class);
        self::assertNotNull($depot->parJeton($jeton));

        // Le fichier d'agenda se télécharge, sans jeton.
        $this->client->request('GET', "/rendez-vous/{$reponse['id']}/agenda.ics");
        self::assertResponseIsSuccessful();
        self::assertStringStartsWith('text/calendar', (string) $this->client->getResponse()->headers->get('Content-Type'));
        self::assertStringContainsString('BEGIN:VEVENT', (string) $this->client->getResponse()->getContent());
        $this->client->request('GET', '/rendez-vous/inconnu/agenda.ics');
        self::assertResponseStatusCodeSame(404);
    }

    public function testRefuseUnCreneauDejaPris(): void
    {
        $this->reserver($this->demande());
        self::assertResponseStatusCodeSame(201);

        $this->reserver($this->demande(['email' => 'autre@exemple.fr']));
        self::assertResponseStatusCodeSame(409);
    }

    public function testRefuseDesDonneesInvalides(): void
    {
        $this->reserver($this->demande(['lieu' => 'lune', 'email' => 'pas-un-mail']));

        self::assertResponseStatusCodeSame(400);
        $erreurs = $this->reponseJson()['erreurs'];
        self::assertArrayHasKey('lieu', $erreurs);
        self::assertArrayHasKey('email', $erreurs);
        self::assertEmailCount(0);
    }

    public function testRefuseUnCorpsQuiNEstPasDuJson(): void
    {
        $this->client->request('POST', '/rendez-vous', server: ['CONTENT_TYPE' => 'application/json'], content: '{pas du json');

        self::assertResponseStatusCodeSame(400);
    }

    public function testLienDuMailPuisAnnulationLibereLeCreneau(): void
    {
        $this->reserver($this->demande());
        $jeton = $this->jetonDuDernierRendezVous();

        // Ouvrir le lien n'a aucun effet : il affiche seulement le bouton d'annulation.
        $this->client->request('GET', "/rendez-vous/{$jeton}");
        self::assertResponseIsSuccessful();
        self::assertSelectorTextContains('h1', 'Votre rendez-vous');
        self::assertSelectorExists("form[action=\"/rendez-vous/{$jeton}/annuler\"] button");

        $this->client->request('POST', "/rendez-vous/{$jeton}/annuler");
        self::assertResponseIsSuccessful();
        self::assertSelectorTextContains('h1', 'Rendez-vous annulé');
        self::assertEmailCount(2); // mails d'annulation (la requête précédente est oubliée)

        $this->client->request('GET', "/rendez-vous/{$jeton}");
        self::assertSelectorTextContains('h1', 'Rendez-vous annulé');

        // Le créneau est de nouveau libre.
        $this->reserver($this->demande(['email' => 'autre@exemple.fr']));
        self::assertResponseStatusCodeSame(201);
    }

    public function testLienInconnu(): void
    {
        $inconnu = str_repeat('0', 64);

        $this->client->request('GET', "/rendez-vous/{$inconnu}");
        self::assertResponseStatusCodeSame(404);

        $this->client->request('POST', "/rendez-vous/{$inconnu}/annuler");
        self::assertResponseStatusCodeSame(404);
    }
}
