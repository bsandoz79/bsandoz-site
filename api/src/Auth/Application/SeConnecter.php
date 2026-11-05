<?php

declare(strict_types=1);

namespace App\Auth\Application;

use App\Auth\Domain\Comptes;
use App\Auth\Domain\DonneesInvalides;
use App\Auth\Domain\Email;
use App\Auth\Domain\HacheurMotDePasse;
use App\Auth\Domain\IdentifiantsIncorrects;

/** Cas d'usage : se connecter avec son e-mail et son mot de passe. */
final class SeConnecter
{
    /** Empreinte factice : on vérifie quand même un mot de passe si le compte n'existe pas (même durée de réponse). */
    private ?string $empreinteFactice = null;

    public function __construct(
        private readonly Comptes $comptes,
        private readonly HacheurMotDePasse $hacheur,
        private readonly Outils $outils,
    ) {
    }

    /** @throws IdentifiantsIncorrects */
    public function __invoke(string $email, string $motDePasse, string $appareil): SessionOuverte
    {
        try {
            $compte = $this->comptes->parEmail(Email::normaliser($email));
        } catch (DonneesInvalides) {
            $compte = null;
        }

        $hache = $compte?->motDePasseHache();
        if ($compte === null || $hache === null) {
            $this->hacheur->verifier($this->empreinteFactice ??= $this->hacheur->hacher('mot de passe factice'), $motDePasse);
            throw new IdentifiantsIncorrects('E-mail ou mot de passe incorrect.');
        }
        if (!$this->hacheur->verifier($hache, $motDePasse)) {
            throw new IdentifiantsIncorrects('E-mail ou mot de passe incorrect.');
        }

        return $this->outils->ouvrirSession($compte, $appareil);
    }
}
