<?php

declare(strict_types=1);

namespace App\Prospect\Domain;

enum StatutDevis: string
{
    case Envoye = 'envoye';
    case Accepte = 'accepte';
}
