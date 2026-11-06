<?php

declare(strict_types=1);

namespace App\Liaisons;

use App\Auth\Domain\Comptes;
use App\Booking\Domain\PreferencesRappel;
use App\Booking\Infrastructure\Systeme\RappelsPourTous;
use Symfony\Component\DependencyInjection\Attribute\AsDecorator;

/** Liaison entre Booking et Auth : les rappels suivent le réglage du compte. Sans compte, ils partent. */
#[AsDecorator(decorates: RappelsPourTous::class)]
final class RappelsSelonLeCompte implements PreferencesRappel
{
    public function __construct(private readonly Comptes $comptes)
    {
    }

    public function accepte(string $email): bool
    {
        return $this->comptes->parEmail($email)?->notificationsParMail() ?? true;
    }
}
