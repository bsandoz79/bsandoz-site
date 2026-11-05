<?php

declare(strict_types=1);

namespace App\Auth\Infrastructure\Systeme;

use App\Auth\Domain\HacheurMotDePasse;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\PasswordHasher\Hasher\NativePasswordHasher;

/**
 * Hachage par l'algorithme le plus sûr disponible dans PHP (Argon2id ou bcrypt), salé et lent.
 * En test, le coût est réduit au minimum pour garder des tests rapides.
 */
final class HacheurNatif implements HacheurMotDePasse
{
    private readonly NativePasswordHasher $hacheur;

    public function __construct(#[Autowire('%auth.hachage_rapide%')] bool $rapide = false)
    {
        $this->hacheur = $rapide
            ? new NativePasswordHasher(opsLimit: 3, memLimit: 10 * 1024, cost: 4)
            : new NativePasswordHasher();
    }

    public function hacher(string $motDePasse): string
    {
        return $this->hacheur->hash($motDePasse);
    }

    public function verifier(string $hache, string $motDePasse): bool
    {
        return $this->hacheur->verify($hache, $motDePasse);
    }
}
