<?php

declare(strict_types=1);

namespace App\Prospect\Domain;

enum AuteurMessage: string
{
    case Client = 'client';
    case Professionnel = 'professionnel';
}
