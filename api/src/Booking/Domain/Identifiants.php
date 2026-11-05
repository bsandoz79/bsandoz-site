<?php

declare(strict_types=1);

namespace App\Booking\Domain;

/** Port : identifiants et jetons secrets. */
interface Identifiants
{
    public function nouvelIdentifiant(): string;

    /** Jeton imprévisible, utilisable dans une adresse. */
    public function nouveauJeton(): string;
}
