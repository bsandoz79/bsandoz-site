<?php

declare(strict_types=1);

namespace App\Prospect\Application;

use App\Prospect\Domain\ActionImpossible;
use App\Prospect\Domain\Demande;
use App\Prospect\Domain\DemandeIntrouvable;
use App\Prospect\Domain\Demandes;
use App\Prospect\Domain\DevisEnregistres;
use App\Prospect\Domain\Horloge;
use App\Prospect\Domain\StatutDemande;
use App\Prospect\Domain\StatutDevis;

/**
 * Cas d'usage (professionnel) : faire avancer ou corriger le statut d'une demande.
 *
 * Le statut doit rester vrai pour le client : pas de « Devis envoyé » sans devis, pas d'« Accepté » ni au-delà
 * sans son acceptation, et une acceptation enregistrée ne s'efface pas en revenant en arrière.
 */
final class ChangerStatut
{
    public function __construct(
        private readonly Demandes $demandes,
        private readonly DevisEnregistres $devis,
        private readonly Horloge $horloge,
    ) {
    }

    /**
     * @throws DemandeIntrouvable
     * @throws ActionImpossible
     */
    public function __invoke(string $demandeId, StatutDemande $statut): Demande
    {
        $demande = $this->demandes->parId($demandeId) ?? throw new DemandeIntrouvable('Demande inconnue.');
        $devis = $this->devis->pourDemande($demandeId);
        $accepte = $devis?->statut() === StatutDevis::Accepte;

        if ($devis === null && $statut->rang() >= StatutDemande::DevisEnvoye->rang()) {
            throw new ActionImpossible('Établissez d’abord le devis.');
        }
        if (!$accepte && $statut->rang() >= StatutDemande::Acceptee->rang()) {
            throw new ActionImpossible('Le client doit d’abord accepter le devis depuis son espace.');
        }
        if ($accepte && $statut->rang() < StatutDemande::Acceptee->rang()) {
            throw new ActionImpossible('Ce devis est accepté : la demande ne peut pas revenir avant « Accepté ».');
        }

        $demande->passerA($statut, $this->horloge->maintenant());
        $this->demandes->enregistrer($demande);

        return $demande;
    }
}
