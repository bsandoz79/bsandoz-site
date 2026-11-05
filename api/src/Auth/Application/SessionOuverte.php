<?php

declare(strict_types=1);

namespace App\Auth\Application;

use App\Auth\Domain\Compte;
use App\Auth\Domain\Session;

/** Résultat d'une connexion : le secret de session ne sert qu'à poser le cookie, il n'est jamais stocké. */
final class SessionOuverte
{
    public function __construct(
        public readonly Compte $compte,
        public readonly Session $session,
        public readonly string $secret,
    ) {
    }
}
