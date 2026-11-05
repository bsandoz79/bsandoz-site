<?php

declare(strict_types=1);

namespace App\Auth\Infrastructure\Http;

use App\Auth\Domain\Compte;

/** Le compte tel que l'API le renvoie (jamais le mot de passe haché). */
final class CompteJson
{
    /** @return array<string, mixed> */
    public static function depuis(Compte $compte): array
    {
        return [
            'id' => $compte->id,
            'email' => $compte->email(),
            'nom' => $compte->nom(),
            'entreprise' => $compte->entreprise(),
            'telephone' => $compte->telephone(),
            'adresse' => $compte->adresse(),
            'notifications' => $compte->notificationsParMail(),
            'statut' => $compte->statut()->value,
            'motDePasse' => $compte->aUnMotDePasse(),
            'motDePasseModifieLe' => $compte->motDePasseModifieLe()?->format(\DATE_ATOM),
        ];
    }
}
