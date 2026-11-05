<?php

declare(strict_types=1);

namespace App\Booking\Domain;

/** Port : l'heure actuelle (fixée dans les tests). */
interface Horloge
{
    public function maintenant(): \DateTimeImmutable;
}
