<?php

declare(strict_types=1);

namespace App\Prospect\Domain;

/** Ligne d'un devis : libellé et prix net en euros (TVA non applicable). */
final class LigneDevis
{
    private function __construct(
        public readonly string $libelle,
        public readonly int $prix,
    ) {
    }

    public static function depuis(string $libelle, int $prix): self
    {
        $libelle = trim($libelle);
        if ($libelle === '' || mb_strlen($libelle) > 160 || $prix < 0 || $prix > 1_000_000) {
            throw new DonneesInvalides(['lignes' => 'Chaque ligne a un libellé (160 caractères au plus) et un prix positif.']);
        }

        return new self($libelle, $prix);
    }

    /** @return array{libelle: string, prix: int} */
    public function enTableau(): array
    {
        return ['libelle' => $this->libelle, 'prix' => $this->prix];
    }
}
