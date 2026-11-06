<?php

declare(strict_types=1);

namespace App\Tests\BackOffice;

use App\Auth\Application\OuvrirCompte;
use App\Booking\Domain\Disponibilites;
use App\Booking\Domain\DonneesInvalides;
use App\Tests\AvecBaseDeDonnees;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\Mime\Email;

final class DisponibilitesBackOfficeTest extends WebTestCase
{
    use AvecBaseDeDonnees;

    private KernelBrowser $client;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->preparerLaBase();
    }

    private function json(string $chemin, array $corps): void
    {
        $this->client->request('POST', $chemin, server: ['CONTENT_TYPE' => 'application/json'], content: json_encode($corps, \JSON_THROW_ON_ERROR));
    }

    private function seConnecter(string $email): void
    {
        $ouvrir = static::getContainer()->get(OuvrirCompte::class);
        \assert($ouvrir instanceof OuvrirCompte);
        $ouvrir($email, 'Personne');
        $mail = self::getMailerMessage();
        \assert($mail instanceof Email);
        preg_match('/jeton=([a-f0-9]{64})/', (string) $mail->getTextBody(), $trouve);
        $this->json('/auth/lien/utiliser', ['jeton' => $trouve[1]]);
        self::assertResponseIsSuccessful();
    }

    /** @return array<string, mixed> */
    private function publiques(): array
    {
        $this->client->request('GET', '/rendez-vous/disponibilites');
        self::assertResponseIsSuccessful();

        return json_decode((string) $this->client->getResponse()->getContent(), true, 8, \JSON_THROW_ON_ERROR);
    }

    /** Premier lundi réservable, assez loin pour rester dans l'horizon. */
    private static function lundi(): string
    {
        return (new \DateTimeImmutable('next monday +7 days', new \DateTimeZone('Europe/Paris')))->format('Y-m-d');
    }

    private function reserver(string $jour, string $creneau): void
    {
        $this->json('/rendez-vous', ['lieu' => 'visio', 'adresse' => '', 'jour' => $jour, 'creneau' => $creneau, 'nom' => 'Marie Dupont', 'email' => 'marie@exemple.fr', 'telephone' => '0612345678', 'activite' => 'Paysagiste', 'message' => '']);
    }

    public function testSansReglageLesValeursDuFichierSAppliquent(): void
    {
        $d = $this->publiques();

        self::assertSame([0, 1, 2, 3, 4], $d['joursTravailles']);
        self::assertSame(['09:00', '10:30', '14:00', '15:30', '17:00'], $d['creneaux']);
        self::assertSame(60, $d['dureeMinutes']);
        self::assertSame([], $d['joursFermes']);
    }

    public function testPersonneNeModifieSansDroit(): void
    {
        $corps = ['joursTravailles' => [0], 'creneaux' => ['09:00'], 'joursFermes' => []];
        $this->json('/backoffice/disponibilites', $corps);
        self::assertResponseStatusCodeSame(401);

        $this->seConnecter('marie@exemple.fr');
        $this->json('/backoffice/disponibilites', $corps);
        self::assertResponseStatusCodeSame(403);

        self::assertSame([0, 1, 2, 3, 4], $this->publiques()['joursTravailles']);
    }

    public function testLeReglageChangeCeQuiEstReservable(): void
    {
        $this->seConnecter('admin@exemple.fr');
        $lundi = self::lundi();
        $mardi = (new \DateTimeImmutable($lundi))->modify('+1 day')->format('Y-m-d');
        $mercredi = (new \DateTimeImmutable($lundi))->modify('+2 days')->format('Y-m-d');

        $this->json('/backoffice/disponibilites', ['joursTravailles' => [1, 0], 'creneaux' => ['11:00', '08:30'], 'joursFermes' => [$mardi]]);
        self::assertResponseIsSuccessful();

        $d = $this->publiques();
        self::assertSame([0, 1], $d['joursTravailles']);
        self::assertSame(['08:30', '11:00'], $d['creneaux'], 'Triés.');
        self::assertSame([$mardi], $d['joursFermes']);

        $this->reserver($lundi, '09:00');
        self::assertResponseStatusCodeSame(409, 'Ancien créneau, plus proposé.');
        $this->reserver($mardi, '08:30');
        self::assertResponseStatusCodeSame(409, 'Jour fermé.');
        $this->reserver($mercredi, '08:30');
        self::assertResponseStatusCodeSame(409, 'Jour non travaillé.');
        $this->reserver($lundi, '08:30');
        self::assertResponseStatusCodeSame(201);

        // Un second enregistrement remplace le premier : il n'y a qu'une ligne.
        $this->json('/backoffice/disponibilites', ['joursTravailles' => [2], 'creneaux' => ['10:00'], 'joursFermes' => []]);
        self::assertResponseIsSuccessful();
        self::assertSame([2], $this->publiques()['joursTravailles']);
    }

    public function testUnReglageInvalideNeChangeRien(): void
    {
        $this->seConnecter('admin@exemple.fr');

        $bons = ['joursTravailles' => [0], 'creneaux' => ['09:00'], 'joursFermes' => []];
        foreach ([['joursTravailles' => []] + $bons, ['creneaux' => ['9h']] + $bons, ['joursFermes' => ['2026-13-45']] + $bons, []] as $corps) {
            $this->json('/backoffice/disponibilites', $corps);
            self::assertResponseStatusCodeSame(400);
        }

        self::assertSame([0, 1, 2, 3, 4], $this->publiques()['joursTravailles']);
    }

    /** @return iterable<string, array{array<mixed>, array<mixed>, array<mixed>, string}> */
    public static function invalides(): iterable
    {
        yield 'aucun jour' => [[], ['09:00'], [], 'joursTravailles'];
        yield 'jour 7' => [[7], ['09:00'], [], 'joursTravailles'];
        yield 'jour en texte' => [['0'], ['09:00'], [], 'joursTravailles'];
        yield 'aucun créneau' => [[0], [], [], 'creneaux'];
        yield 'heure 24' => [[0], ['24:00'], [], 'creneaux'];
        yield 'date impossible' => [[0], ['09:00'], ['2026-02-30'], 'joursFermes'];
        yield 'date avec du texte' => [[0], ['09:00'], ['<b>'], 'joursFermes'];
    }

    /**
     * @param array<mixed> $jours
     * @param array<mixed> $creneaux
     * @param array<mixed> $fermes
     */
    #[\PHPUnit\Framework\Attributes\DataProvider('invalides')]
    public function testValidationDuDomaine(array $jours, array $creneaux, array $fermes, string $champ): void
    {
        try {
            Disponibilites::depuis($jours, $creneaux, $fermes);
            self::fail('Accepté.');
        } catch (DonneesInvalides $e) {
            self::assertArrayHasKey($champ, $e->erreurs);
        }
    }
}
