<?php

declare(strict_types=1);

namespace App\Catalogue\Application;

use App\Catalogue\Domain\PrixEnregistres;
use App\Catalogue\Domain\PrixInvalide;
use App\Catalogue\Domain\PrixPersonnalise;

final class ModifierLesPrix
{
    public function __construct(private readonly PrixEnregistres $prix)
    {
    }

    /**
     * Tout ou rien : une seule valeur invalide et rien n'est changé.
     *
     * @param array<mixed> $saisis clé => montant
     *
     * @throws PrixInvalide
     */
    public function __invoke(array $saisis): void
    {
        $prix = [];
        foreach ($saisis as $cle => $montant) {
            if (!is_string($cle) || !is_int($montant)) {
                throw new PrixInvalide('Un prix est un nombre entier d’euros, positif.');
            }
            $prix[] = PrixPersonnalise::depuis($cle, $montant);
        }
        $this->prix->remplacer($prix);
    }
}
