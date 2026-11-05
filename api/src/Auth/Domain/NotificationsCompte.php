<?php

declare(strict_types=1);

namespace App\Auth\Domain;

/** Port : e-mails liés au compte. Les secrets ne sont transmis qu'ici, jamais renvoyés par l'API. */
interface NotificationsCompte
{
    public function lien(Compte $compte, UsageLien $usage, string $secret): void;

    public function motDePasseModifie(Compte $compte): void;
}
