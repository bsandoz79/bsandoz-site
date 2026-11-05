<?php

declare(strict_types=1);

namespace App\Auth\Domain;

/** Port : e-mails liés au compte. Les secrets ne sont transmis qu'ici, jamais renvoyés par l'API. */
interface NotificationsCompte
{
    /** Envoie le lien ; pour un changement d'e-mail, à la nouvelle adresse (`$destinataire`). */
    public function lien(Compte $compte, UsageLien $usage, string $secret, ?string $destinataire = null): void;

    public function motDePasseModifie(Compte $compte): void;

    /** Prévient l'ANCIENNE adresse que l'adresse du compte a changé. */
    public function emailModifie(Compte $compte, string $ancienneAdresse): void;

    /** Confirme la suppression, à l'adresse du compte supprimé. */
    public function compteSupprime(string $email, string $nom): void;
}
