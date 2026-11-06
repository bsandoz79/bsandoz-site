<?php

declare(strict_types=1);

namespace App\Prospect\Domain;

/** Port : adresse du professionnel, pour reconnaître ses réponses par mail. */
interface ContactProfessionnel
{
    public function email(): string;
}
