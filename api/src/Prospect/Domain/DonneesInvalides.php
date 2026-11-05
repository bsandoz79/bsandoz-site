<?php

declare(strict_types=1);

namespace App\Prospect\Domain;

/** Données refusées ; `erreurs` associe chaque champ à son message. */
final class DonneesInvalides extends \DomainException
{
    /** @param array<string, string> $erreurs */
    public function __construct(public readonly array $erreurs)
    {
        parent::__construct('Données invalides : ' . implode(', ', array_keys($erreurs)));
    }
}
