<?php

declare(strict_types=1);

namespace App\Prospect\Infrastructure\Systeme;

use App\Prospect\Domain\PreferencesClient;

/** Sans espace client (module installé seul), il n'y a pas de préférence à consulter. */
final class NotificationsPourTous implements PreferencesClient
{
    public function accepteLesNotifications(string $email): bool
    {
        return true;
    }
}
