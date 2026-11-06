<?php

declare(strict_types=1);

namespace App\Contenu\Application;

use App\Contenu\Domain\ContenuInvalide;
use App\Contenu\Domain\ContenusEnregistres;

/** Cas d'usage : enregistrer ce qui a changé dans un bloc. */
final class ModifierLesContenus
{
    private const CHANGEMENTS_MAX = 200;

    public function __construct(private readonly ContenusEnregistres $contenus)
    {
    }

    /**
     * Tout ou rien : une seule valeur invalide et rien n'est changé.
     *
     * @param array<mixed> $saisis clé => texte, ou null pour revenir au texte du code
     *
     * @throws ContenuInvalide
     */
    public function __invoke(array $saisis): void
    {
        if (count($saisis) > self::CHANGEMENTS_MAX) {
            throw new ContenuInvalide('Trop de changements à la fois.');
        }
        $changements = [];
        foreach ($saisis as $cle => $valeur) {
            if (!is_string($cle) || (!is_string($valeur) && $valeur !== null)) {
                throw new ContenuInvalide('Un contenu est un texte.');
            }
            $changements[$cle] = $valeur;
        }
        $this->contenus->appliquer($changements);
    }
}
