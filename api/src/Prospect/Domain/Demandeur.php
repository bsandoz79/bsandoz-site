<?php

declare(strict_types=1);

namespace App\Prospect\Domain;

/** Personne qui fait la demande. */
final class Demandeur
{
    private function __construct(
        public readonly string $nom,
        public readonly string $email,
        public readonly string $telephone,
        public readonly string $entreprise,
    ) {
    }

    public static function depuis(string $nom, string $email, string $telephone = '', string $entreprise = ''): self
    {
        $nom = trim($nom);
        $email = mb_strtolower(trim($email));
        $telephone = trim($telephone);
        $entreprise = trim($entreprise);
        $erreurs = [];
        if ($nom === '' || mb_strlen($nom) > 120) {
            $erreurs['nom'] = 'Nom obligatoire (120 caractères au plus).';
        }
        if (filter_var($email, FILTER_VALIDATE_EMAIL) === false || mb_strlen($email) > 200) {
            $erreurs['email'] = 'Adresse e-mail invalide.';
        }
        if ($telephone !== '' && !preg_match('/^\+?[\d\s.-]{10,20}$/', $telephone)) {
            $erreurs['telephone'] = 'Numéro de téléphone invalide.';
        }
        if (mb_strlen($entreprise) > 120) {
            $erreurs['entreprise'] = 'Nom d’entreprise trop long (120 caractères au plus).';
        }
        if ($erreurs !== []) {
            throw new DonneesInvalides($erreurs);
        }

        return new self($nom, $email, $telephone, $entreprise);
    }

    public function estLaMemePersonne(string $email): bool
    {
        return $this->email === mb_strtolower(trim($email));
    }
}
