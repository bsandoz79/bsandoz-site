<?php

declare(strict_types=1);

namespace App\Contenu\Domain;

/**
 * Texte ou adresse d'image modifié depuis le site. Sans lui, le site affiche ce qui est écrit dans son code.
 * Du texte brut : le site l'affiche sans jamais l'interpréter comme du HTML.
 */
class ContenuPersonnalise
{
    private const LONGUEUR_MAX = 5000;

    private function __construct(
        public readonly string $cle,
        private string $valeur,
    ) {
    }

    /** @throws ContenuInvalide */
    public static function depuis(string $cle, string $valeur): self
    {
        if (preg_match('/^[a-zA-Z0-9._-]{1,120}$/', $cle) !== 1) {
            throw new ContenuInvalide("Clé de contenu invalide : {$cle}.");
        }

        return new self($cle, self::valeurValide($valeur));
    }

    public function valeur(): string
    {
        return $this->valeur;
    }

    /** @throws ContenuInvalide */
    public function changer(string $valeur): void
    {
        $this->valeur = self::valeurValide($valeur);
    }

    private static function valeurValide(string $valeur): string
    {
        if (mb_strlen($valeur) > self::LONGUEUR_MAX) {
            throw new ContenuInvalide('Ce texte est trop long.');
        }

        return $valeur;
    }
}
