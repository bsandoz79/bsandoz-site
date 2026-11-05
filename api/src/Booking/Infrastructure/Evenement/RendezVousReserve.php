<?php

declare(strict_types=1);

namespace App\Booking\Infrastructure\Evenement;

use App\Booking\Domain\RendezVous;

/**
 * Publié après une réservation réussie. Le module Booking ne sait pas qui l'écoute :
 * une installation peut s'en servir (ouvrir un compte client…) ou l'ignorer.
 */
final class RendezVousReserve
{
    public function __construct(public readonly RendezVous $rendezVous)
    {
    }
}
