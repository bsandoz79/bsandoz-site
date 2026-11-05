<?php

declare(strict_types=1);

namespace App\Auth\Application;

use App\Auth\Domain\Comptes;
use App\Auth\Domain\Horloge;
use App\Auth\Domain\LienInvalide;
use App\Auth\Domain\Liens;
use App\Auth\Domain\Secret;
use App\Auth\Domain\UsageLien;

/**
 * Cas d'usage : ouvrir le lien d'activation ou de connexion reçu par mail.
 * Le lien est consommé, le compte devient actif (l'adresse est prouvée) et une session s'ouvre.
 */
final class UtiliserLien
{
    public function __construct(
        private readonly Liens $liens,
        private readonly Comptes $comptes,
        private readonly Outils $outils,
        private readonly Horloge $horloge,
    ) {
    }

    /** @throws LienInvalide */
    public function __invoke(string $secret, string $appareil): SessionOuverte
    {
        $maintenant = $this->horloge->maintenant();
        $lien = $this->liens->parEmpreinte(Secret::empreinte($secret));
        if ($lien === null || $lien->usage === UsageLien::MotDePasse || !$lien->estValide($maintenant)) {
            throw new LienInvalide('Ce lien a expiré ou a déjà servi.');
        }
        $compte = $this->comptes->parId($lien->compteId) ?? throw new LienInvalide('Compte introuvable.');

        $lien->utiliser($maintenant);
        $this->liens->enregistrer($lien);
        if ($compte->activer($maintenant)) {
            $this->comptes->enregistrer($compte);
        }

        return $this->outils->ouvrirSession($compte, $appareil);
    }
}
