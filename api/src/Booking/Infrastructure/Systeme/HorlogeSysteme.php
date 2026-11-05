<?php

declare(strict_types=1);

namespace App\Booking\Infrastructure\Systeme;

use App\Booking\Domain\Horloge;

final class HorlogeSysteme implements Horloge
{
    public function maintenant(): \DateTimeImmutable
    {
        return new \DateTimeImmutable();
    }
}
