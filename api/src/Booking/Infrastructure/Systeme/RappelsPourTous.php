<?php

declare(strict_types=1);

namespace App\Booking\Infrastructure\Systeme;

use App\Booking\Domain\PreferencesRappel;

/** Sans espace client (module installé seul), il n'y a pas de préférence à consulter. */
final class RappelsPourTous implements PreferencesRappel
{
    public function accepte(string $email): bool
    {
        return true;
    }
}
