<?php

declare(strict_types=1);

namespace App\Tests\Liaisons;

use App\Booking\Domain\Contact;
use App\Booking\Domain\Creneau;
use App\Booking\Domain\Lieu;
use App\Booking\Domain\RendezVous;
use App\Booking\Domain\RendezVousRepository;
use App\Tests\AvecBaseDeDonnees;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\Mime\Email;

/** Espace client, « Mes rendez-vous » : parcours complet sur MySQL avec le vrai cookie de session. */
final class EspaceRendezVousTest extends WebTestCase
{
    use AvecBaseDeDonnees;

    private KernelBrowser $client;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->preparerLaBase();
    }

    private static function jourOuvre(string $decalage): string
    {
        $jour = new \DateTimeImmutable("today {$decalage}", new \DateTimeZone('Europe/Paris'));
        while ((int) $jour->format('N') > 5) {
            $jour = $jour->modify('+1 day');
        }

        return $jour->format('Y-m-d');
    }

    /** @param array<string, mixed> $corps */
    private function post(string $url, array $corps = []): void
    {
        $this->client->request('POST', $url, server: ['CONTENT_TYPE' => 'application/json'], content: json_encode($corps, \JSON_THROW_ON_ERROR));
    }

    /** @return array<string, mixed> */
    private function reponse(): array
    {
        return json_decode((string) $this->client->getResponse()->getContent(), true, 8, \JSON_THROW_ON_ERROR);
    }

    /** Réserve, puis se connecte avec le lien d'activation reçu par mail. Renvoie l'identifiant du rendez-vous. */
    private function reserverEtSeConnecter(string $email = 'marie@exemple.fr'): string
    {
        $this->post('/rendez-vous', [
            'lieu' => 'chezvous', 'adresse' => '12 rue des Lilas, Amiens', 'jour' => self::jourOuvre('+3 days'), 'creneau' => '14:00',
            'nom' => 'Marie Dupont', 'email' => $email, 'telephone' => '06 12 34 56 78', 'activite' => 'Detailing', 'message' => '',
        ]);
        self::assertResponseStatusCodeSame(201);
        $id = (string) $this->reponse()['id'];

        $activation = null;
        foreach (self::getMailerMessages() as $mail) {
            if ($mail instanceof Email && preg_match('/jeton=([a-f0-9]{64})/', (string) $mail->getTextBody(), $trouve)) {
                $activation = $trouve[1];
            }
        }
        self::assertNotNull($activation, 'Le lien d’activation doit partir avec le premier rendez-vous.');
        $this->post('/auth/lien/utiliser', ['jeton' => $activation]);
        self::assertResponseIsSuccessful();

        return $id;
    }

    public function testListeAgendaEtAnnulation(): void
    {
        $id = $this->reserverEtSeConnecter();

        $this->client->request('GET', '/espace/rendez-vous');
        self::assertResponseIsSuccessful();
        $liste = $this->reponse()['rendezVous'];
        self::assertCount(1, $liste);
        self::assertSame([
            'id' => $id, 'jour' => self::jourOuvre('+3 days'), 'debut' => '14:00', 'fin' => '15:00', 'lieu' => 'chezvous',
            'lieuLibelle' => 'Chez vous', 'adresse' => '12 rue des Lilas, Amiens', 'statut' => 'confirme', 'aVenir' => true,
        ], $liste[0]);

        $this->client->request('GET', "/espace/rendez-vous/{$id}/agenda.ics");
        self::assertResponseIsSuccessful();
        self::assertResponseHeaderSame('content-type', 'text/calendar; charset=utf-8');
        self::assertStringContainsString('attachment; filename=rendez-vous.ics', (string) $this->client->getResponse()->headers->get('content-disposition'));
        self::assertStringContainsString('BEGIN:VCALENDAR', (string) $this->client->getResponse()->getContent());

        $this->post("/espace/rendez-vous/{$id}/annuler");
        self::assertResponseIsSuccessful();
        self::assertSame(['statut' => 'annule'], $this->reponse());
        self::assertEmailCount(2); // la personne et le professionnel sont prévenus

        $this->client->request('GET', '/espace/rendez-vous');
        self::assertSame(['annule', false], [$this->reponse()['rendezVous'][0]['statut'], $this->reponse()['rendezVous'][0]['aVenir']]);
    }

    public function testNonConnecte(): void
    {
        $this->client->request('GET', '/espace/rendez-vous');
        self::assertResponseStatusCodeSame(401);
        $this->post('/espace/rendez-vous/inconnu/annuler');
        self::assertResponseStatusCodeSame(401);
    }

    public function testLeRendezVousDUneAutrePersonneEstIntrouvable(): void
    {
        $this->reserverEtSeConnecter('marie@exemple.fr');
        $autre = RendezVous::reserver(
            'rdv-autre', Lieu::Visio, null, Creneau::depuis(self::jourOuvre('+5 days'), '09:00'),
            Contact::depuis('Paul', 'paul@exemple.fr', '06 00 00 00 00'), '', '', str_repeat('e', 64), new \DateTimeImmutable(),
        );
        $depot = static::getContainer()->get(RendezVousRepository::class);
        \assert($depot instanceof RendezVousRepository);
        $depot->enregistrer($autre);

        $this->client->request('GET', '/espace/rendez-vous');
        self::assertCount(1, $this->reponse()['rendezVous'], 'Seuls ses propres rendez-vous apparaissent.');
        $this->client->request('GET', '/espace/rendez-vous/rdv-autre/agenda.ics');
        self::assertResponseStatusCodeSame(404);
        $this->post('/espace/rendez-vous/rdv-autre/annuler');
        self::assertResponseStatusCodeSame(404);
        self::assertTrue($depot->parId('rdv-autre')?->estConfirme());
    }

    public function testUnRendezVousPasseNePeutPlusEtreAnnule(): void
    {
        $this->reserverEtSeConnecter('marie@exemple.fr');
        $passe = RendezVous::reserver(
            'rdv-passe', Lieu::Telephone, null, Creneau::depuis((new \DateTimeImmutable('-10 days'))->format('Y-m-d'), '09:00'),
            Contact::depuis('Marie Dupont', 'Marie@Exemple.fr', '06 12 34 56 78'), '', '', str_repeat('f', 64), new \DateTimeImmutable('-20 days'),
        );
        $depot = static::getContainer()->get(RendezVousRepository::class);
        \assert($depot instanceof RendezVousRepository);
        $depot->enregistrer($passe);

        $this->client->request('GET', '/espace/rendez-vous');
        $liste = $this->reponse()['rendezVous'];
        self::assertSame(['rdv-passe', false], [$liste[0]['id'], $liste[0]['aVenir']], 'Le plus ancien d’abord ; passé, il n’est plus « à venir ».');

        $this->post('/espace/rendez-vous/rdv-passe/annuler');
        self::assertResponseStatusCodeSame(409);
    }

    public function testCorpsJsonExigePourAnnuler(): void
    {
        $id = $this->reserverEtSeConnecter();
        $this->client->request('POST', "/espace/rendez-vous/{$id}/annuler");
        self::assertResponseStatusCodeSame(415);
    }
}
