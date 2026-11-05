<?php

declare(strict_types=1);

namespace App\Auth\Application;

use App\Auth\Domain\Comptes;
use App\Auth\Domain\HacheurMotDePasse;
use App\Auth\Domain\Horloge;
use App\Auth\Domain\LienInvalide;
use App\Auth\Domain\Liens;
use App\Auth\Domain\NotificationsCompte;
use App\Auth\Domain\PolitiqueMotDePasse;
use App\Auth\Domain\Secret;
use App\Auth\Domain\Sessions;
use App\Auth\Domain\UsageLien;

/**
 * Cas d'usage : choisir un nouveau mot de passe depuis le lien reçu par mail (valable 1 h).
 * Toutes les sessions ouvertes sont fermées (un éventuel intrus est déconnecté) et un mail confirme le changement.
 */
final class DefinirMotDePasse
{
    public function __construct(
        private readonly Liens $liens,
        private readonly Comptes $comptes,
        private readonly Sessions $sessions,
        private readonly HacheurMotDePasse $hacheur,
        private readonly NotificationsCompte $notifications,
        private readonly Horloge $horloge,
    ) {
    }

    /**
     * @throws LienInvalide
     * @throws \App\Auth\Domain\DonneesInvalides mot de passe refusé (le lien reste alors utilisable)
     */
    public function __invoke(string $secret, string $motDePasse): void
    {
        $maintenant = $this->horloge->maintenant();
        $lien = $this->liens->parEmpreinte(Secret::empreinte($secret));
        if ($lien === null || $lien->usage !== UsageLien::MotDePasse || !$lien->estValide($maintenant)) {
            throw new LienInvalide('Ce lien a expiré ou a déjà servi.');
        }
        PolitiqueMotDePasse::verifier($motDePasse);
        $compte = $this->comptes->parId($lien->compteId) ?? throw new LienInvalide('Compte introuvable.');

        $lien->utiliser($maintenant);
        $this->liens->enregistrer($lien);
        $compte->definirMotDePasse($this->hacheur->hacher($motDePasse), $maintenant);
        $this->comptes->enregistrer($compte);
        foreach ($this->sessions->actives($compte->id, $maintenant) as $session) {
            $session->fermer($maintenant);
            $this->sessions->enregistrer($session);
        }
        $this->notifications->motDePasseModifie($compte);
    }
}
