<?php

declare(strict_types=1);

namespace App\Booking\Application;

use App\Booking\Domain\Disponibilites;
use App\Booking\Domain\DisponibilitesEnregistrees;
use App\Booking\Domain\DonneesInvalides;

/** Cas d'usage (professionnel). Les rendez-vous déjà pris ne sont pas touchés : ils restent à annuler un par un. */
final class ModifierDisponibilites
{
    public function __construct(private readonly DisponibilitesEnregistrees $disponibilites)
    {
    }

    /**
     * @param array<mixed> $joursTravailles
     * @param array<mixed> $creneaux
     * @param array<mixed> $joursFermes
     *
     * @throws DonneesInvalides
     */
    public function __invoke(array $joursTravailles, array $creneaux, array $joursFermes): Disponibilites
    {
        $disponibilites = Disponibilites::depuis($joursTravailles, $creneaux, $joursFermes);
        $this->disponibilites->enregistrer($disponibilites);

        return $disponibilites;
    }
}
