<?php

declare(strict_types=1);

namespace App\Prospect\Domain;

/** Port : stockage du fil de messages. L'effacement passe par Demandes::supprimer. */
interface Messages
{
    /** @return list<Message> fil d'une demande, du plus ancien au plus récent */
    public function pourDemande(string $demandeId): array;

    public function mailDejaRecu(string $idMail): bool;

    public function enregistrer(Message $message): void;
}
