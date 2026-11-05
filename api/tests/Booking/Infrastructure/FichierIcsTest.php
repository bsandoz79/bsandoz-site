<?php

declare(strict_types=1);

namespace App\Tests\Booking\Infrastructure;

use App\Booking\Domain\Contact;
use App\Booking\Domain\Creneau;
use App\Booking\Domain\Lieu;
use App\Booking\Domain\RendezVous;
use App\Booking\Infrastructure\Mail\FichierIcs;
use PHPUnit\Framework\TestCase;

final class FichierIcsTest extends TestCase
{
    private function rendezVous(Lieu $lieu = Lieu::Visio, ?string $adresse = null): RendezVous
    {
        return RendezVous::reserver(
            'rdv-1',
            $lieu,
            $adresse,
            Creneau::depuis('2026-11-17', '14:00'),
            Contact::depuis('Marie Dupont', 'marie@exemple.fr', '06 12 34 56 78'),
            'Detailing',
            'Un site avec réservation.',
            str_repeat('a', 64),
            new \DateTimeImmutable('2026-11-05 10:00', new \DateTimeZone('Europe/Paris')),
        );
    }

    private function ics(RendezVous $rendezVous, bool $annulation = false, string $titre = 'Rendez-vous découverte'): string
    {
        return FichierIcs::pour($rendezVous, 60, new \DateTimeZone('Europe/Paris'), $titre, 'contact@exemple.fr', 'exemple.fr', $annulation);
    }

    public function testDecritLeRendezVousEnHeureUtc(): void
    {
        $ics = $this->ics($this->rendezVous());

        self::assertStringStartsWith("BEGIN:VCALENDAR\r\n", $ics);
        self::assertStringEndsWith("END:VCALENDAR\r\n", $ics);
        // 17 novembre 2026, 14 h à Paris (heure d'hiver, UTC+1) = 13 h UTC, pour 60 minutes.
        self::assertStringContainsString("DTSTART:20261117T130000Z\r\n", $ics);
        self::assertStringContainsString("DTEND:20261117T140000Z\r\n", $ics);
        self::assertStringContainsString("DTSTAMP:20261105T090000Z\r\n", $ics);
        self::assertStringContainsString("UID:rdv-1@exemple.fr\r\n", $ics);
        self::assertStringContainsString("METHOD:REQUEST\r\n", $ics);
        self::assertStringContainsString("STATUS:CONFIRMED\r\n", $ics);
        self::assertStringContainsString("LOCATION:En visio\r\n", $ics);
        self::assertStringContainsString("ORGANIZER:mailto:contact@exemple.fr\r\n", $ics);
    }

    public function testToutesLesLignesFinissentParCrlf(): void
    {
        $ics = $this->ics($this->rendezVous());

        self::assertSame(0, preg_match("/(?<!\r)\n/", $ics), 'Chaque fin de ligne doit être CRLF.');
    }

    public function testIndiqueLAdresseChezLeClientEnLEchappant(): void
    {
        $ics = $this->ics($this->rendezVous(Lieu::ChezLeClient, '12 rue des Lilas, 80000 Amiens'));

        self::assertStringContainsString("LOCATION:12 rue des Lilas\\, 80000 Amiens\r\n", $ics);
    }

    public function testAnnulation(): void
    {
        $ics = $this->ics($this->rendezVous(), true);

        self::assertStringContainsString("METHOD:CANCEL\r\n", $ics);
        self::assertStringContainsString("STATUS:CANCELLED\r\n", $ics);
        self::assertStringContainsString("SEQUENCE:1\r\n", $ics);
        // Même UID que la confirmation : l'agenda retire le bon événement.
        self::assertStringContainsString("UID:rdv-1@exemple.fr\r\n", $ics);
    }

    public function testEchappeLesCaracteresSpeciaux(): void
    {
        self::assertSame('a\\\\b\\;c\\,d\\ne\\nf', FichierIcs::echapper("a\\b;c,d\r\ne\nf"));
    }

    public function testPlieLesLignesLonguesSansCouperUnCaractere(): void
    {
        $titre = str_repeat('é', 60); // 120 octets
        $ics = $this->ics($this->rendezVous(), false, $titre);

        foreach (explode("\r\n", rtrim($ics, "\r\n")) as $ligne) {
            self::assertLessThanOrEqual(75, strlen($ligne), "Ligne trop longue : {$ligne}");
            self::assertTrue(mb_check_encoding($ligne, 'UTF-8'), 'Une ligne pliée coupe un caractère UTF-8.');
        }
        // Déplier (CRLF + espace) redonne la valeur d'origine.
        self::assertStringContainsString("SUMMARY:{$titre}", str_replace("\r\n ", '', $ics));
    }
}
