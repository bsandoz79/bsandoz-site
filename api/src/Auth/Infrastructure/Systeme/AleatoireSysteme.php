<?php

declare(strict_types=1);

namespace App\Auth\Infrastructure\Systeme;

use App\Auth\Domain\Aleatoire;
use Symfony\Component\Uid\Uuid;

final class AleatoireSysteme implements Aleatoire
{
    public function identifiant(): string
    {
        return Uuid::v7()->toRfc4122();
    }

    /** 32 octets du générateur cryptographique du système, en hexadécimal. */
    public function secret(): string
    {
        return bin2hex(random_bytes(32));
    }
}
