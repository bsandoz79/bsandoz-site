<?php

declare(strict_types=1);

namespace App\Catalogue\Domain;

/** Port : les prix modifiés depuis le back-office. */
interface PrixEnregistres
{
    /** @return array<string, int> clé => montant */
    public function tous(): array;

    /**
     * Remplace tous les prix modifiés d'un coup : une clé absente reprend le prix écrit dans le code du site.
     *
     * @param list<PrixPersonnalise> $prix
     */
    public function remplacer(array $prix): void;
}
