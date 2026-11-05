<?php

declare(strict_types=1);

namespace App\Booking\Infrastructure\Mail;

use App\Booking\Domain\Lieu;
use App\Booking\Domain\RendezVous;

/**
 * Fichier .ics (iCalendar, RFC 5545) pour ajouter le rendez-vous à son agenda.
 * Heures en UTC, lignes terminées par CRLF, texte échappé.
 */
final class FichierIcs
{
    public static function pour(
        RendezVous $rendezVous,
        int $dureeMinutes,
        \DateTimeZone $fuseau,
        string $titre,
        string $organisateurEmail,
        string $domaine,
        bool $annulation = false,
    ): string {
        $utc = new \DateTimeZone('UTC');
        $format = static fn (\DateTimeImmutable $d): string => $d->setTimezone($utc)->format('Ymd\THis\Z');
        $lieu = match ($rendezVous->lieu) {
            Lieu::ChezLeClient => (string) $rendezVous->adresse,
            default => $rendezVous->lieu->libelle(),
        };

        $lignes = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//' . self::echapper($domaine) . '//Rendez-vous//FR',
            'CALSCALE:GREGORIAN',
            'METHOD:' . ($annulation ? 'CANCEL' : 'REQUEST'),
            'BEGIN:VEVENT',
            "UID:{$rendezVous->id}@{$domaine}",
            'DTSTAMP:' . $format($rendezVous->creeLe),
            'DTSTART:' . $format($rendezVous->creneau->debut($fuseau)),
            'DTEND:' . $format($rendezVous->creneau->fin($fuseau, $dureeMinutes)),
            'SUMMARY:' . self::echapper($titre),
            'LOCATION:' . self::echapper($lieu),
            'ORGANIZER:mailto:' . $organisateurEmail,
            'STATUS:' . ($annulation ? 'CANCELLED' : 'CONFIRMED'),
            'SEQUENCE:' . ($annulation ? '1' : '0'),
            'END:VEVENT',
            'END:VCALENDAR',
        ];

        return implode("\r\n", array_map(self::plier(...), $lignes)) . "\r\n";
    }

    /** Échappe les caractères spéciaux d'une valeur texte iCalendar. */
    public static function echapper(string $texte): string
    {
        return str_replace(['\\', ';', ',', "\r\n", "\n"], ['\\\\', '\;', '\,', '\n', '\n'], $texte);
    }

    /** Coupe les lignes de plus de 75 octets (suite précédée d'une espace). */
    private static function plier(string $ligne): string
    {
        $morceaux = [];
        while (strlen($ligne) > 75) {
            $coupe = 75;
            while ($coupe > 0 && (ord($ligne[$coupe]) & 0xC0) === 0x80) {
                --$coupe; // ne pas couper au milieu d'un caractère UTF-8
            }
            $morceaux[] = substr($ligne, 0, $coupe);
            $ligne = ' ' . substr($ligne, $coupe);
        }
        $morceaux[] = $ligne;

        return implode("\r\n", $morceaux);
    }
}
