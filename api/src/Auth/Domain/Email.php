<?php

declare(strict_types=1);

namespace App\Auth\Domain;

/** Adresse e-mail normalisée (espaces retirés, minuscules) : une adresse = un compte. */
final class Email
{
    public static function normaliser(string $email): string
    {
        $email = mb_strtolower(trim($email));
        if (filter_var($email, FILTER_VALIDATE_EMAIL) === false || mb_strlen($email) > 200) {
            throw new DonneesInvalides(['email' => 'Adresse e-mail invalide.']);
        }

        return $email;
    }
}
