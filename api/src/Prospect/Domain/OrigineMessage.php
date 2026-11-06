<?php

declare(strict_types=1);

namespace App\Prospect\Domain;

enum OrigineMessage: string
{
    /** Écrit depuis l'espace client ou le back-office. */
    case Site = 'site';
    /** Réponse reçue par mail, rattachée par le relevé de la boîte. */
    case Mail = 'mail';
    /** Note d'appel : visible par le client, sans mail envoyé. */
    case Note = 'note';
}
