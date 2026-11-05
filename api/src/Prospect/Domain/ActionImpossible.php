<?php

declare(strict_types=1);

namespace App\Prospect\Domain;

/** Action refusée par l'état actuel (devis déjà accepté, pas de devis à accepter…). */
final class ActionImpossible extends \DomainException
{
}
