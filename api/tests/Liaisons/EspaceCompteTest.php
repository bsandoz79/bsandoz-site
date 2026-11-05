<?php

declare(strict_types=1);

namespace App\Tests\Liaisons;

use App\Auth\Domain\Comptes;
use App\Booking\Domain\RendezVousRepository;
use App\Tests\AvecBaseDeDonnees;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\BrowserKit\Cookie;
use Symfony\Component\Mime\Email;

/** « Mon compte », mes données et zone danger : parcours HTTP complets sur MySQL avec le vrai cookie. */
final class EspaceCompteTest extends WebTestCase
{
    use AvecBaseDeDonnees;

    private KernelBrowser $client;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->preparerLaBase();
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

    /** @return array{string, string} [secret du dernier lien, destinataire] */
    private function dernierLien(): array
    {
        foreach (array_reverse(self::getMailerMessages()) as $mail) {
            if ($mail instanceof Email && preg_match('/jeton=([a-f0-9]{64})/', (string) $mail->getTextBody(), $trouve)) {
                return [$trouve[1], $mail->getTo()[0]->getAddress()];
            }
        }
        self::fail('Aucun lien envoyé.');
    }

    /** Réserve un rendez-vous (ce qui ouvre le compte), puis se connecte avec le lien d'activation. */
    private function reserverEtSeConnecter(): string
    {
        $jour = new \DateTimeImmutable('today +3 days', new \DateTimeZone('Europe/Paris'));
        while ((int) $jour->format('N') > 5) {
            $jour = $jour->modify('+1 day');
        }
        $this->post('/rendez-vous', [
            'lieu' => 'visio', 'adresse' => null, 'jour' => $jour->format('Y-m-d'), 'creneau' => '10:30',
            'nom' => 'Marie Dupont', 'email' => 'marie@exemple.fr', 'telephone' => '06 12 34 56 78', 'activite' => 'Paysagiste', 'message' => 'Bonjour',
        ]);
        self::assertResponseStatusCodeSame(201);
        $id = (string) $this->reponse()['id'];
        $this->post('/auth/lien/utiliser', ['jeton' => $this->dernierLien()[0]]);
        self::assertResponseIsSuccessful();

        return $id;
    }

    public function testModifierMonCompte(): void
    {
        $this->reserverEtSeConnecter();

        $this->post('/auth/compte', ['nom' => 'Marie Dupont', 'entreprise' => 'Dupont Jardins', 'telephone' => '06 12 34 56 78', 'adresse' => 'Abbeville', 'notifications' => false]);
        self::assertResponseIsSuccessful();
        self::assertSame(['Dupont Jardins', 'Abbeville', false], [$this->reponse()['compte']['entreprise'], $this->reponse()['compte']['adresse'], $this->reponse()['compte']['notifications']]);

        $this->client->request('GET', '/auth/moi');
        self::assertSame('Dupont Jardins', $this->reponse()['compte']['entreprise']);

        $this->post('/auth/compte', ['nom' => '', 'telephone' => 'abc']);
        self::assertResponseStatusCodeSame(400);
        self::assertSame(['nom', 'telephone'], array_keys($this->reponse()['erreurs']));
    }

    public function testChangerDEmail(): void
    {
        $this->reserverEtSeConnecter();

        $this->post('/auth/email', ['email' => 'marie@nouvelle.fr']);
        self::assertResponseStatusCodeSame(202);
        [$jeton, $destinataire] = $this->dernierLien();
        self::assertSame('marie@nouvelle.fr', $destinataire, 'Le lien part à la nouvelle adresse.');

        $this->client->getCookieJar()->clear(); // le lien peut s'ouvrir sur un autre appareil
        $this->post('/auth/email/confirmer', ['jeton' => $jeton]);
        self::assertResponseIsSuccessful();
        self::assertSame('marie@nouvelle.fr', $this->reponse()['compte']['email']);
        $avertissement = self::getMailerMessage();
        \assert($avertissement instanceof Email);
        self::assertSame('marie@exemple.fr', $avertissement->getTo()[0]->getAddress(), 'L’ancienne adresse est prévenue.');

        $this->post('/auth/email/confirmer', ['jeton' => $jeton]);
        self::assertResponseStatusCodeSame(410);
    }

    public function testChangementDEmailRefuseOuNonConnecte(): void
    {
        $this->post('/auth/email', ['email' => 'marie@nouvelle.fr']);
        self::assertResponseStatusCodeSame(401);

        $this->reserverEtSeConnecter();
        $this->post('/auth/email', ['email' => 'Marie@Exemple.fr']);
        self::assertResponseStatusCodeSame(400);
        self::assertArrayHasKey('email', $this->reponse()['erreurs']);
    }

    public function testTelechargerMesDonnees(): void
    {
        $this->reserverEtSeConnecter();

        $this->client->request('GET', '/espace/donnees');
        self::assertResponseIsSuccessful();
        self::assertStringContainsString('attachment; filename=mes-donnees-bsandoz.json', (string) $this->client->getResponse()->headers->get('content-disposition'));
        $donnees = json_decode((string) $this->client->getResponse()->getContent(), true, 16, \JSON_THROW_ON_ERROR);
        self::assertSame(['exporteLe', 'compte', 'appareilsConnectes', 'rendezVous', 'demandes'], array_keys($donnees));
        self::assertSame('marie@exemple.fr', $donnees['compte']['email']);
        self::assertCount(1, $donnees['appareilsConnectes']);
        self::assertSame(['Paysagiste', 'Bonjour'], [$donnees['rendezVous'][0]['activite'], $donnees['rendezVous'][0]['message']]);
        $brut = (string) $this->client->getResponse()->getContent();
        self::assertStringNotContainsString('empreinte', $brut);
        self::assertStringNotContainsString('jeton', $brut);
        self::assertStringNotContainsString('hache', $brut);

        $this->client->getCookieJar()->clear();
        $this->client->request('GET', '/espace/donnees');
        self::assertResponseStatusCodeSame(401);
    }

    public function testSupprimerMonCompteEfface(): void
    {
        $idRendezVous = $this->reserverEtSeConnecter();
        $cookie = $this->client->getCookieJar()->get('bsandoz_session');
        \assert($cookie instanceof Cookie);

        $this->post('/auth/suppression');
        self::assertResponseStatusCodeSame(202);
        $comptes = static::getContainer()->get(Comptes::class);
        \assert($comptes instanceof Comptes);
        self::assertNotNull($comptes->parEmail('marie@exemple.fr'), 'Rien n’est supprimé avant la confirmation.');
        [$jeton] = $this->dernierLien();

        $this->post('/auth/suppression/confirmer', ['jeton' => $jeton]);
        self::assertResponseStatusCodeSame(204);
        $sujets = array_map(static fn ($m) => $m instanceof Email ? (string) $m->getSubject() : '', self::getMailerMessages());
        self::assertContains('Votre compte a été supprimé', $sujets);
        self::assertContains('Rendez-vous annulé : Marie Dupont, ' . '', array_map(static fn ($s) => preg_replace('/(Marie Dupont, ).*/', '$1', $s), $sujets), 'Le rendez-vous à venir est annulé (le professionnel est prévenu).');

        $comptes = static::getContainer()->get(Comptes::class);
        $rendezVous = static::getContainer()->get(RendezVousRepository::class);
        \assert($comptes instanceof Comptes && $rendezVous instanceof RendezVousRepository);
        self::assertNull($comptes->parEmail('marie@exemple.fr'));
        self::assertNull($rendezVous->parId($idRendezVous));
        self::assertSame([], $rendezVous->parEmail('marie@exemple.fr'));

        $this->client->getCookieJar()->set($cookie);
        $this->client->request('GET', '/auth/moi');
        self::assertResponseStatusCodeSame(401);
        $this->post('/auth/suppression/confirmer', ['jeton' => $jeton]);
        self::assertResponseStatusCodeSame(410);
    }
}
