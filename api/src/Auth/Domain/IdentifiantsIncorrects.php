<?php

declare(strict_types=1);

namespace App\Auth\Domain;

/** E-mail ou mot de passe incorrect. Le message ne dit jamais lequel des deux. */
final class IdentifiantsIncorrects extends \DomainException
{
}
