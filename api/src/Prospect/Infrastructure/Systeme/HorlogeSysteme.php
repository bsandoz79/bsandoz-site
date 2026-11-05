<?php

declare(strict_types=1);

namespace App\Prospect\Infrastructure\Systeme;

use App\Prospect\Domain\Horloge;

final class HorlogeSysteme implements Horloge
{
    public function maintenant(): \DateTimeImmutable
    {
        return new \DateTimeImmutable();
    }
}
