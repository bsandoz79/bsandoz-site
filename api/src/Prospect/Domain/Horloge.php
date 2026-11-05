<?php

declare(strict_types=1);

namespace App\Prospect\Domain;

/** Port : l'heure actuelle (remplaçable dans les tests). */
interface Horloge
{
    public function maintenant(): \DateTimeImmutable;
}
