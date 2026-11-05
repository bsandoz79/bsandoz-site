<?php

declare(strict_types=1);

namespace App\Auth\Domain;

/** Lien reçu par mail inconnu, expiré, déjà utilisé ou employé pour un autre usage. */
final class LienInvalide extends \DomainException
{
}
