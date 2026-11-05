<?php

declare(strict_types=1);

namespace App\Auth\Infrastructure\Evenement;

/**
 * Publié après la suppression d'un compte. Le module Auth ne sait pas qui l'écoute :
 * une installation peut s'en servir pour effacer ce qui se rattache à cette adresse ailleurs.
 */
final class CompteSupprime
{
    public function __construct(
        public readonly string $email,
        public readonly string $nom,
    ) {
    }
}
