<?php

declare(strict_types=1);

namespace App\Booking\Infrastructure\Systeme;

use App\Booking\Domain\Identifiants;
use Symfony\Component\Uid\Uuid;

final class IdentifiantsAleatoires implements Identifiants
{
    public function nouvelIdentifiant(): string
    {
        return Uuid::v7()->toRfc4122();
    }

    /** 32 octets aléatoires en hexadécimal (64 caractères) : impossible à deviner. */
    public function nouveauJeton(): string
    {
        return bin2hex(random_bytes(32));
    }
}
