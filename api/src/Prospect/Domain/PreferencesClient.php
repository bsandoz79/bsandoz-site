<?php

declare(strict_types=1);

namespace App\Prospect\Domain;

/** Port : ce client accepte-t-il d'être prévenu par mail de chaque nouveau message ? */
interface PreferencesClient
{
    public function accepteLesNotifications(string $email): bool;
}
