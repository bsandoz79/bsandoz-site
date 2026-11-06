<?php

declare(strict_types=1);

namespace App\Booking\Infrastructure\Mail;

use App\Booking\Domain\Lieu;
use App\Booking\Domain\RegleDisponibilite;
use App\Booking\Domain\RendezVous;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

/**
 * Ajouter un rendez-vous à son agenda : fichier .ics (Apple, Thunderbird…) et liens directs Google et Outlook.
 * Les liens n'utilisent jamais le jeton, qui permet d'annuler et ne part que par mail.
 */
final class AgendaDuRendezVous
{
    public function __construct(
        private readonly RegleDisponibilite $regle,
        #[Autowire('%booking.professionnel_nom%')]
        private readonly string $professionnelNom,
        #[Autowire('%booking.professionnel_email%')]
        private readonly string $professionnelEmail,
        #[Autowire('%booking.url_publique%')]
        private readonly string $urlPublique,
    ) {
    }

    public function ics(RendezVous $rendezVous, bool $annulation = false): string
    {
        return FichierIcs::pour(
            $rendezVous,
            $this->regle->dureeMinutes,
            $this->regle->fuseau,
            $this->titre(),
            $this->professionnelEmail,
            (string) (parse_url($this->urlPublique, PHP_URL_HOST) ?: 'localhost'),
            $annulation,
        );
    }

    /** @return array{google: string, outlook: string, ics: string} */
    public function liens(RendezVous $rendezVous): array
    {
        $utc = new \DateTimeZone('UTC');
        $debut = $rendezVous->creneau->debut($this->regle->fuseau)->setTimezone($utc);
        $fin = $rendezVous->creneau->fin($this->regle->fuseau, $this->regle->dureeMinutes)->setTimezone($utc);
        $lieu = $rendezVous->lieu === Lieu::ChezLeClient ? (string) $rendezVous->adresse : $rendezVous->lieu->libelle();

        return [
            'google' => 'https://calendar.google.com/calendar/render?' . http_build_query([
                'action' => 'TEMPLATE',
                'text' => $this->titre(),
                'dates' => $debut->format('Ymd\THis\Z') . '/' . $fin->format('Ymd\THis\Z'),
                'location' => $lieu,
            ], '', '&', PHP_QUERY_RFC3986),
            'outlook' => 'https://outlook.live.com/calendar/0/action/compose?' . http_build_query([
                'rru' => 'addevent',
                'subject' => $this->titre(),
                'startdt' => $debut->format('Y-m-d\TH:i:s\Z'),
                'enddt' => $fin->format('Y-m-d\TH:i:s\Z'),
                'location' => $lieu,
            ], '', '&', PHP_QUERY_RFC3986),
            'ics' => rtrim($this->urlPublique, '/') . "/rendez-vous/{$rendezVous->id}/agenda.ics",
        ];
    }

    private function titre(): string
    {
        return "Rendez-vous découverte – {$this->professionnelNom}";
    }
}
