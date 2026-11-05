<?php

declare(strict_types=1);

namespace App\Booking\Application;

use App\Booking\Domain\Notifications;
use App\Booking\Domain\RendezVous;
use App\Booking\Domain\RendezVousIntrouvable;
use App\Booking\Domain\RendezVousRepository;

/**
 * Cas d'usage : annuler un rendez-vous depuis le lien secret reçu par mail.
 * Le créneau redevient libre. Annuler deux fois ne prévient qu'une fois.
 */
final class AnnulerRendezVous
{
    public function __construct(
        private readonly RendezVousRepository $rendezVous,
        private readonly Notifications $notifications,
    ) {
    }

    /** @throws RendezVousIntrouvable */
    public function __invoke(string $jeton): RendezVous
    {
        $rendezVous = $this->rendezVous->parJeton($jeton) ?? throw new RendezVousIntrouvable('Lien de rendez-vous inconnu.');
        if ($rendezVous->annuler()) {
            $this->rendezVous->enregistrer($rendezVous);
            $this->notifications->rendezVousAnnule($rendezVous);
        }

        return $rendezVous;
    }
}
