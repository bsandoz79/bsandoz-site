<?php

declare(strict_types=1);

namespace App\Prospect\Domain;

/** Port : identifiants uniques. */
interface Identifiants
{
    public function nouvelIdentifiant(): string;
}
