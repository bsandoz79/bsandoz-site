<?php

declare(strict_types=1);

namespace App\Prospect\Domain;

/** Photo jointe à une demande : transmise par mail, jamais stockée. */
final class PieceJointe
{
    public function __construct(
        public readonly string $nom,
        public readonly string $type,
        public readonly string $contenu,
    ) {
    }
}
