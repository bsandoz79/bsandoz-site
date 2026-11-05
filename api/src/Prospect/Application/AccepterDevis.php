<?php

declare(strict_types=1);

namespace App\Prospect\Application;

use App\Prospect\Domain\ActionImpossible;
use App\Prospect\Domain\DemandeIntrouvable;
use App\Prospect\Domain\Demandes;
use App\Prospect\Domain\Devis;
use App\Prospect\Domain\DevisEnregistres;
use App\Prospect\Domain\Horloge;
use App\Prospect\Domain\NotificationsProspect;
use App\Prospect\Domain\StatutDemande;

/** Cas d'usage (client) : accepter le devis de sa demande. La demande passe à « Accepté ». */
final class AccepterDevis
{
    public function __construct(
        private readonly Demandes $demandes,
        private readonly DevisEnregistres $devis,
        private readonly NotificationsProspect $notifications,
        private readonly Horloge $horloge,
    ) {
    }

    /**
     * @param string $email adresse de la personne connectée : seule la demandeuse peut accepter
     *
     * @throws DemandeIntrouvable
     * @throws ActionImpossible   pas de devis, ou déjà accepté
     */
    public function __invoke(string $demandeId, string $email): Devis
    {
        $demande = $this->demandes->parId($demandeId);
        if ($demande === null || !$demande->demandeur->estLaMemePersonne($email)) {
            throw new DemandeIntrouvable('Demande introuvable.');
        }
        $devis = $this->devis->pourDemande($demandeId) ?? throw new ActionImpossible('Aucun devis à accepter pour cette demande.');

        $maintenant = $this->horloge->maintenant();
        $devis->accepter($maintenant);
        $this->devis->enregistrer($devis);
        $demande->passerA(StatutDemande::Acceptee, $maintenant);
        $this->demandes->enregistrer($demande);
        $this->notifications->devisAccepte($demande, $devis);

        return $devis;
    }
}
