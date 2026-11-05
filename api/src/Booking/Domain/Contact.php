<?php

declare(strict_types=1);

namespace App\Booking\Domain;

/** Coordonnées de la personne qui réserve. */
final class Contact
{
    private function __construct(
        public readonly string $nom,
        public readonly string $email,
        public readonly string $telephone,
    ) {
    }

    public static function depuis(string $nom, string $email, string $telephone): self
    {
        $nom = trim($nom);
        $email = trim($email);
        $telephone = trim($telephone);
        $erreurs = [];
        if ($nom === '' || mb_strlen($nom) > 120) {
            $erreurs['nom'] = 'Nom obligatoire (120 caractères au plus).';
        }
        if (filter_var($email, FILTER_VALIDATE_EMAIL) === false || mb_strlen($email) > 200) {
            $erreurs['email'] = 'Adresse e-mail invalide.';
        }
        if (!preg_match('/^\+?[\d\s.-]{10,20}$/', $telephone)) {
            $erreurs['telephone'] = 'Numéro de téléphone invalide.';
        }
        if ($erreurs !== []) {
            throw new DonneesInvalides($erreurs);
        }

        return new self($nom, $email, $telephone);
    }
}
