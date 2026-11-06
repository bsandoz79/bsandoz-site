<?php

declare(strict_types=1);

namespace App\Tests\Booking\Domain;

use App\Booking\Domain\Contact;
use App\Booking\Domain\Creneau;
use App\Booking\Domain\DonneesInvalides;
use App\Booking\Domain\Lieu;
use App\Booking\Domain\RendezVous;
use App\Booking\Domain\StatutRendezVous;
use App\Tests\Booking\Regles;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../Doublures.php';

final class DomaineTest extends TestCase
{
    public function testUnCreneauValideSaDateEtSonHeure(): void
    {
        $creneau = Creneau::depuis('2026-11-17', '14:00');
        self::assertSame(1, $creneau->jourDeLaSemaine()); // mardi
        self::assertSame('2026-11-17T15:00:00+01:00', $creneau->fin(new \DateTimeZone('Europe/Paris'), 60)->format('c'));
        self::assertTrue($creneau->egal(Creneau::depuis('2026-11-17', '14:00')));

        foreach ([['2026-02-30', '14:00', 'jour'], ['17/11/2026', '14:00', 'jour'], ['2026-11-17', '25:00', 'creneau']] as [$jour, $heure, $champ]) {
            try {
                Creneau::depuis($jour, $heure);
                self::fail("$jour $heure aurait dû être refusé");
            } catch (DonneesInvalides $e) {
                self::assertArrayHasKey($champ, $e->erreurs);
            }
        }
    }

    public function testUnContactExigeNomEmailEtTelephoneValides(): void
    {
        $contact = Contact::depuis('  Marie Dupont ', 'marie@exemple.fr', '06 12 34 56 78');
        self::assertSame('Marie Dupont', $contact->nom);

        try {
            Contact::depuis('', 'pas-un-mail', '12');
            self::fail('Contact invalide accepté');
        } catch (DonneesInvalides $e) {
            self::assertSame(['nom', 'email', 'telephone'], array_keys($e->erreurs));
        }
    }

    /** @return iterable<string, array{string, string, bool}> */
    public static function creneaux(): iterable
    {
        yield 'mardi suivant, créneau ouvert' => ['2026-11-17', '14:00', true];
        yield "aujourd'hui" => ['2026-11-05', '14:00', false];
        yield 'demain vendredi' => ['2026-11-06', '09:00', true];
        yield 'samedi' => ['2026-11-07', '09:00', false];
        yield 'heure non proposée' => ['2026-11-17', '12:00', false];
        yield 'au-delà de 60 jours' => ['2027-01-05', '09:00', false];
        yield 'passé' => ['2026-10-01', '09:00', false];
    }

    #[DataProvider('creneaux')]
    public function testLaRegleDeDisponibilite(string $jour, string $heure, bool $attendu): void
    {
        self::assertSame($attendu, Regles::parDefaut()->estReservable(Creneau::depuis($jour, $heure), Regles::maintenant()));
    }

    public function testUnRendezVousChezLeClientExigeUneAdresse(): void
    {
        $this->expectException(DonneesInvalides::class);
        $this->reserver(Lieu::ChezLeClient, '  ');
    }

    public function testLAdresseNEstGardeeQuePourUnRendezVousChezLeClient(): void
    {
        self::assertNull($this->reserver(Lieu::Visio, '12 rue de la Gare')->adresse);
        self::assertSame('12 rue de la Gare', $this->reserver(Lieu::ChezLeClient, ' 12 rue de la Gare ')->adresse);
    }

    public function testUneAnnulationNeCompteQuUneFois(): void
    {
        $rdv = $this->reserver(Lieu::Telephone, null);
        self::assertSame(StatutRendezVous::Confirme, $rdv->statut());
        self::assertTrue($rdv->annuler());
        self::assertFalse($rdv->annuler());
        self::assertSame(StatutRendezVous::Annule, $rdv->statut());
    }

    private function reserver(Lieu $lieu, ?string $adresse): RendezVous
    {
        return RendezVous::reserver(
            'rdv-1',
            $lieu,
            $adresse,
            Creneau::depuis('2026-11-17', '14:00'),
            Contact::depuis('Marie', 'marie@exemple.fr', '0612345678'),
            'Detailing',
            '',
            'jeton',
            Regles::maintenant(),
        );
    }

    public function testLesFraisDeDeplacementNeSontGardesQueChezLeClientEtSiPlausibles(): void
    {
        $reserver = static fn (Lieu $lieu, ?int $km, ?int $centimes): RendezVous => RendezVous::reserver(
            'rdv-1',
            $lieu,
            $lieu === Lieu::ChezLeClient ? 'Grand-Place, Lille' : null,
            Creneau::depuis('2026-11-17', '14:00'),
            Contact::depuis('Marie Dupont', 'marie@exemple.fr', '0612345678'),
            'Detailing',
            '',
            str_repeat('a', 64),
            Regles::maintenant(),
            $km,
            $centimes,
        );

        $chezLui = $reserver(Lieu::ChezLeClient, 100, 1875);
        self::assertSame(100, $chezLui->kmFactures);
        self::assertSame(1875, $chezLui->fraisCentimes);
        self::assertSame('18,75 €', $chezLui->fraisLisibles());

        // En visio : pas de frais, même s'ils sont envoyés.
        self::assertNull($reserver(Lieu::Visio, 100, 1875)->fraisCentimes);
        // Valeurs absurdes ou absentes : ignorées.
        self::assertNull($reserver(Lieu::ChezLeClient, -5, 1875)->fraisCentimes);
        self::assertNull($reserver(Lieu::ChezLeClient, 100, 99999999)->fraisCentimes);
        self::assertNull($reserver(Lieu::ChezLeClient, null, null)->fraisLisibles());
    }
}
