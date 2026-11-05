<?php

declare(strict_types=1);

namespace App\Booking\Domain;

enum StatutRendezVous: string
{
    case Confirme = 'confirme';
    case Annule = 'annule';
}
