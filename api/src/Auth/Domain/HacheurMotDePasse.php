<?php

declare(strict_types=1);

namespace App\Auth\Domain;

/** Port : hachage lent et salé des mots de passe (bcrypt ou Argon2). */
interface HacheurMotDePasse
{
    public function hacher(string $motDePasse): string;

    public function verifier(string $hache, string $motDePasse): bool;
}
