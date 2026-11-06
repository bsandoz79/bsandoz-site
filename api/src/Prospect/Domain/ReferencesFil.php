<?php

declare(strict_types=1);

namespace App\Prospect\Domain;

/**
 * Port : référence signée placée dans l'objet des mails, pour rattacher une réponse à sa demande.
 * Sans la signature, connaître un numéro de demande ne permet pas d'écrire dans son fil.
 */
interface ReferencesFil
{
    /** « [fil:2026-014-a1b2c3d4e5f60718] ». */
    public function pour(Demande $demande): string;

    /** Numéro de la demande si l'objet contient une référence valide, sinon null. */
    public function numeroDans(string $sujet): ?string;
}
