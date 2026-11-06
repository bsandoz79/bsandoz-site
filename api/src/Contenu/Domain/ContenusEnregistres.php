<?php

declare(strict_types=1);

namespace App\Contenu\Domain;

/** Port : les contenus modifiés depuis le site. */
interface ContenusEnregistres
{
    /** @return array<string, string> clé => valeur */
    public function tous(): array;

    /**
     * Applique des changements d'un coup. Les autres contenus ne bougent pas.
     *
     * @param array<string, string|null> $changements clé => valeur, ou null pour revenir au texte du code
     *
     * @throws ContenuInvalide
     */
    public function appliquer(array $changements): void;
}
