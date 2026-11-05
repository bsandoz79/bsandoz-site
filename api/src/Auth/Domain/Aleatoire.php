<?php

declare(strict_types=1);

namespace App\Auth\Domain;

/** Port : identifiants et secrets impossibles à deviner. */
interface Aleatoire
{
    public function identifiant(): string;

    /** Secret de 64 caractères hexadécimaux (256 bits). */
    public function secret(): string;
}
