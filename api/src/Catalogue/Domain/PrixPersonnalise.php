<?php

declare(strict_types=1);

namespace App\Catalogue\Domain;

/** Prix modifié depuis le back-office. Sans lui, le site affiche le prix écrit dans son code. */
class PrixPersonnalise
{
    private const MONTANT_MAX = 1_000_000;

    private function __construct(
        public readonly string $cle,
        public readonly int $montant,
    ) {
    }

    /** @throws PrixInvalide */
    public static function depuis(string $cle, int $montant): self
    {
        if (preg_match('/^(formule|option)\.[a-zA-Z]{1,40}$/', $cle) !== 1) {
            throw new PrixInvalide("Clé de prix inconnue : {$cle}.");
        }
        if ($montant < 0 || $montant > self::MONTANT_MAX) {
            throw new PrixInvalide('Un prix est un nombre entier d’euros, positif.');
        }

        return new self($cle, $montant);
    }
}
