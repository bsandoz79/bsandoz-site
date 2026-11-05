<?php

declare(strict_types=1);

namespace App\Auth\Domain;

enum StatutCompte: string
{
    /** Créé automatiquement (première demande ou premier rendez-vous), pas encore confirmé par le lien du mail. */
    case EnAttente = 'en_attente';
    case Actif = 'actif';
}
