<?php

declare(strict_types=1);

namespace App\Booking\Domain;

/** Port : les disponibilités réglées depuis le back-office. */
interface DisponibilitesEnregistrees
{
    public function lire(): ?Disponibilites;

    public function enregistrer(Disponibilites $disponibilites): void;
}
