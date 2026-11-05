<?php

declare(strict_types=1);

namespace App\Auth\Domain;

/**
 * Un secret (lien de mail, session) n'est jamais stocké : on garde son empreinte SHA-256.
 * Une fuite de la base ne permet donc ni de se connecter ni d'utiliser un lien.
 */
final class Secret
{
    public static function empreinte(string $secret): string
    {
        return hash('sha256', $secret);
    }
}
