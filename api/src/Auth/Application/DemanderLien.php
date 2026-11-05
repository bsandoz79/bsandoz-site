<?php

declare(strict_types=1);

namespace App\Auth\Application;

use App\Auth\Domain\Comptes;
use App\Auth\Domain\DonneesInvalides;
use App\Auth\Domain\Email;
use App\Auth\Domain\UsageLien;

/**
 * Cas d'usage : recevoir par mail un lien de connexion (sans mot de passe) ou de changement de mot de passe.
 * La réponse est la même que l'adresse ait un compte ou non : on ne révèle pas qui est client.
 */
final class DemanderLien
{
    public function __construct(
        private readonly Comptes $comptes,
        private readonly Outils $outils,
    ) {
    }

    /** @throws DonneesInvalides adresse mal formée, ou usage non demandable */
    public function __invoke(string $email, UsageLien $usage): void
    {
        if ($usage === UsageLien::Activation) {
            throw new DonneesInvalides(['usage' => 'Usage inconnu.']);
        }
        $compte = $this->comptes->parEmail(Email::normaliser($email));
        if ($compte !== null) {
            $this->outils->envoyerLien($compte, $usage);
        }
    }
}
