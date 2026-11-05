<?php

declare(strict_types=1);

namespace App\Auth\Domain;

/** Règles d'un mot de passe : 12 caractères au moins (une phrase de passe convient), 200 au plus. */
final class PolitiqueMotDePasse
{
    public const LONGUEUR_MIN = 12;
    public const LONGUEUR_MAX = 200;

    public static function verifier(string $motDePasse): void
    {
        $longueur = mb_strlen($motDePasse);
        if (trim($motDePasse) === '' || $longueur < self::LONGUEUR_MIN || $longueur > self::LONGUEUR_MAX) {
            throw new DonneesInvalides([
                'motDePasse' => sprintf('Le mot de passe doit contenir de %d à %d caractères.', self::LONGUEUR_MIN, self::LONGUEUR_MAX),
            ]);
        }
    }
}
