<?php

declare(strict_types=1);

namespace App\Prospect\Infrastructure\Systeme;

use App\Prospect\Domain\Identifiants;
use Symfony\Component\Uid\Uuid;

final class IdentifiantsUuid implements Identifiants
{
    public function nouvelIdentifiant(): string
    {
        return Uuid::v7()->toRfc4122();
    }
}
