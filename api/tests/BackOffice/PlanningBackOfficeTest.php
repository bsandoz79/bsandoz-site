<?php

declare(strict_types=1);

namespace App\Tests\BackOffice;

use App\Auth\Application\OuvrirCompte;
use App\Booking\Domain\Contact;
use App\Booking\Domain\Creneau;
use App\Booking\Domain\Lieu;
use App\Booking\Domain\RendezVous;
use App\Booking\Domain\RendezVousRepository;
use App\Tests\AvecBaseDeDonnees;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\Mime\Email;

final class PlanningBackOfficeTest extends WebTestCase
{
    use AvecBaseDeDonnees;

    private KernelBrowser $client;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->preparerLaBase();
    }

    private function seConnecter(string $email): void
    {
        $ouvrir = static::getContainer()->get(OuvrirCompte::class);
        \assert($ouvrir instanceof OuvrirCompte);
        $ouvrir($email, 'Personne');
        $mail = self::getMailerMessage();
        \assert($mail instanceof Email);
        preg_match('/jeton=([a-f0-9]{64})/', (string) $mail->getTextBody(), $trouve);
        $this->client->request('POST', '/auth/lien/utiliser', server: ['CONTENT_TYPE' => 'application/json'], content: json_encode(['jeton' => $trouve[1]]));
        self::assertResponseIsSuccessful();
    }

    private function rendezVous(string $id, string $jour, string $heure, Lieu $lieu = Lieu::Visio, ?int $km = null, ?int $centimes = null): void
    {
        $depot = static::getContainer()->get(RendezVousRepository::class);
        \assert($depot instanceof RendezVousRepository);
        $depot->enregistrer(RendezVous::reserver(
            $id,
            $lieu,
            $lieu === Lieu::ChezLeClient ? 'Grand-Place, Lille' : null,
            Creneau::depuis($jour, $heure),
            Contact::depuis('Marie Dupont', 'marie@exemple.fr', '06 12 34 56 78'),
            'Detailing',
            'Un message.',
            str_pad($id, 64, 'a'),
            new \DateTimeImmutable('2026-11-01'),
            $km,
            $centimes,
        ));
    }

    /** @return array<mixed> */
    private function json(): array
    {
        return json_decode((string) $this->client->getResponse()->getContent(), true, flags: \JSON_THROW_ON_ERROR);
    }

    public function testPersonneNeVoitLePlanningSansDroit(): void
    {
        $this->client->request('GET', '/backoffice/rendez-vous?du=2026-11-01&au=2026-11-30');
        self::assertResponseStatusCodeSame(401);

        $this->seConnecter('marie@exemple.fr');
        $this->client->request('GET', '/backoffice/rendez-vous?du=2026-11-01&au=2026-11-30');
        self::assertResponseStatusCodeSame(403);
    }

    public function testListeLaPeriodeAvecLesDetailsSansLeJeton(): void
    {
        $this->seConnecter('admin@exemple.fr');
        $this->rendezVous('rdv-b', '2026-11-17', '14:00', Lieu::ChezLeClient, 96, 1800);
        $this->rendezVous('rdv-a', '2026-11-16', '09:00');
        $this->rendezVous('rdv-c', '2026-12-20', '09:00');

        $this->client->request('GET', '/backoffice/rendez-vous?du=2026-11-16&au=2026-11-22');
        self::assertResponseIsSuccessful();
        $liste = $this->json()['rendezVous'];
        self::assertSame(['rdv-a', 'rdv-b'], array_column($liste, 'id'));
        self::assertSame('15:00', $liste[1]['fin']);
        self::assertSame('Grand-Place, Lille', $liste[1]['adresse']);
        self::assertSame('18,00 €', $liste[1]['frais']);
        self::assertSame('06 12 34 56 78', $liste[1]['telephone']);
        self::assertArrayNotHasKey('jeton', $liste[0]);
    }

    public function testRefuseUnePeriodeInvalide(): void
    {
        $this->seConnecter('admin@exemple.fr');
        foreach (['du=hier&au=demain', 'du=2026-11-30&au=2026-11-01', 'du=2026-01-01&au=2028-01-01', 'du=2026-02-30&au=2026-03-01'] as $periode) {
            $this->client->request('GET', "/backoffice/rendez-vous?{$periode}");
            self::assertResponseStatusCodeSame(400, $periode);
        }
    }

    public function testAnnuleUnRendezVousEtGardeLaTrace(): void
    {
        $this->seConnecter('admin@exemple.fr');
        $this->rendezVous('rdv-a', '2026-11-16', '09:00');

        // Sans disponibilités : refusé, rien n'est annulé.
        $this->client->request('POST', '/backoffice/rendez-vous/rdv-a/annuler', server: ['CONTENT_TYPE' => 'application/json'], content: json_encode(['message' => ' ', 'lien' => 'https://exemple.fr/rendez-vous']));
        self::assertResponseStatusCodeSame(400);
        $this->client->request('POST', '/backoffice/rendez-vous/rdv-a/annuler', server: ['CONTENT_TYPE' => 'application/json'], content: json_encode(['message' => 'Mardi', 'lien' => 'javascript:x']));
        self::assertResponseStatusCodeSame(400);

        $corps = json_encode(['message' => 'Mardi 14 h ou jeudi 9 h', 'lien' => 'https://exemple.fr/rendez-vous']);
        $this->client->request('POST', '/backoffice/rendez-vous/rdv-a/annuler', server: ['CONTENT_TYPE' => 'application/json'], content: $corps);
        self::assertResponseIsSuccessful();
        self::assertSame('annule', $this->json()['rendezVous']['statut']);
        self::assertEmailCount(2, message: 'Le client et le professionnel sont prévenus.');
        $client = self::getMailerMessage(0);
        \assert($client instanceof Email);
        self::assertSame('marie@exemple.fr', $client->getTo()[0]->getAddress());
        self::assertStringContainsString('Mardi 14 h ou jeudi 9 h', (string) $client->getTextBody());
        self::assertStringContainsString('https://exemple.fr/rendez-vous', (string) $client->getTextBody());

        // Annuler deux fois ne prévient qu'une fois.
        $this->client->request('POST', '/backoffice/rendez-vous/rdv-a/annuler', server: ['CONTENT_TYPE' => 'application/json'], content: $corps);
        self::assertResponseIsSuccessful();
        self::assertEmailCount(0);

        $this->client->request('POST', '/backoffice/rendez-vous/inconnu/annuler', server: ['CONTENT_TYPE' => 'application/json'], content: $corps);
        self::assertResponseStatusCodeSame(404);
    }
}
