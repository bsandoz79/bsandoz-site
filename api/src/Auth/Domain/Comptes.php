<?php

declare(strict_types=1);

namespace App\Auth\Domain;

/** Port : stockage des comptes. */
interface Comptes
{
    public function parId(string $id): ?Compte;

    /** @param string $email adresse déjà normalisée (Email::normaliser) */
    public function parEmail(string $email): ?Compte;

    public function enregistrer(Compte $compte): void;

    /** Efface le compte, ses liens et ses sessions. */
    public function supprimer(Compte $compte): void;
}
