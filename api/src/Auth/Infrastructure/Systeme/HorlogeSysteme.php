<?php

declare(strict_types=1);

namespace App\Auth\Infrastructure\Systeme;

use App\Auth\Domain\Horloge;

final class HorlogeSysteme implements Horloge
{
    public function maintenant(): \DateTimeImmutable
    {
        return new \DateTimeImmutable();
    }
}
