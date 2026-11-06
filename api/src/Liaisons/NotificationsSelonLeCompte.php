<?php

declare(strict_types=1);

namespace App\Liaisons;

use App\Auth\Domain\Comptes;
use App\Prospect\Domain\PreferencesClient;
use App\Prospect\Infrastructure\Systeme\NotificationsPourTous;
use Symfony\Component\DependencyInjection\Attribute\AsDecorator;

/** Liaison entre Prospect et Auth : les mails « nouveau message » suivent le réglage du compte. Sans compte, ils partent. */
#[AsDecorator(decorates: NotificationsPourTous::class)]
final class NotificationsSelonLeCompte implements PreferencesClient
{
    public function __construct(private readonly Comptes $comptes)
    {
    }

    public function accepteLesNotifications(string $email): bool
    {
        return $this->comptes->parEmail($email)?->notificationsParMail() ?? true;
    }
}
