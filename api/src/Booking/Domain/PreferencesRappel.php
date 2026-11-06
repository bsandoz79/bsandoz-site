<?php

declare(strict_types=1);

namespace App\Booking\Domain;

/** Port : cette personne accepte-t-elle les rappels par mail ? */
interface PreferencesRappel
{
    public function accepte(string $email): bool;
}
