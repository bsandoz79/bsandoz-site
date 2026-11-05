<?php

declare(strict_types=1);

namespace App\Booking\Domain;

/** Où se déroule le rendez-vous. */
enum Lieu: string
{
    case ChezLeClient = 'chezvous';
    case Visio = 'visio';
    case Telephone = 'telephone';

    public function libelle(): string
    {
        return match ($this) {
            self::ChezLeClient => 'Chez vous',
            self::Visio => 'En visio',
            self::Telephone => 'Par téléphone',
        };
    }
}
