<?php

declare(strict_types=1);

namespace App\Auth\Application;

use App\Auth\Domain\Aleatoire;
use App\Auth\Domain\Compte;
use App\Auth\Domain\Comptes;
use App\Auth\Domain\Email;
use App\Auth\Domain\Horloge;
use App\Auth\Domain\UsageLien;

/**
 * Cas d'usage : ouvrir automatiquement un compte (première demande, premier rendez-vous).
 * Si l'adresse a déjà un compte, rien ne change et aucun mail ne part.
 * Sinon le compte est créé « en attente » et un lien d'activation est envoyé.
 */
final class OuvrirCompte
{
    public function __construct(
        private readonly Comptes $comptes,
        private readonly Outils $outils,
        private readonly Horloge $horloge,
        private readonly Aleatoire $aleatoire,
    ) {
    }

    /** @throws \App\Auth\Domain\DonneesInvalides */
    public function __invoke(string $email, string $nom): Compte
    {
        $existant = $this->comptes->parEmail(Email::normaliser($email));
        if ($existant !== null) {
            return $existant;
        }

        $compte = Compte::ouvrir($this->aleatoire->identifiant(), $email, $nom, $this->horloge->maintenant());
        $this->comptes->enregistrer($compte);
        $this->outils->envoyerLien($compte, UsageLien::Activation);

        return $compte;
    }
}
