<?php

declare(strict_types=1);

namespace App\Prospect\Application;

use App\Prospect\Domain\ActionImpossible;
use App\Prospect\Domain\DemandeIntrouvable;
use App\Prospect\Domain\Demandes;
use App\Prospect\Domain\Devis;
use App\Prospect\Domain\DevisEnregistres;
use App\Prospect\Domain\Horloge;
use App\Prospect\Domain\Identifiants;
use App\Prospect\Domain\LigneDevis;
use App\Prospect\Domain\NotificationsProspect;
use App\Prospect\Domain\StatutDemande;

/**
 * Cas d'usage (professionnel) : établir le devis d'une demande. La demande passe à « Devis envoyé »
 * et le client est prévenu. Sera appelé depuis le back-office.
 */
final class EtablirDevis
{
    public function __construct(
        private readonly Demandes $demandes,
        private readonly DevisEnregistres $devis,
        private readonly NotificationsProspect $notifications,
        private readonly Horloge $horloge,
        private readonly Identifiants $identifiants,
    ) {
    }

    /**
     * @param list<array{libelle: string, prix: int}> $lignes
     *
     * @throws DemandeIntrouvable
     * @throws ActionImpossible   un devis existe déjà pour cette demande
     */
    public function __invoke(string $demandeId, array $lignes): Devis
    {
        $demande = $this->demandes->parId($demandeId) ?? throw new DemandeIntrouvable('Demande inconnue.');
        if ($this->devis->pourDemande($demandeId) !== null) {
            throw new ActionImpossible('Cette demande a déjà un devis.');
        }
        $maintenant = $this->horloge->maintenant();
        $devis = Devis::etablir(
            $this->identifiants->nouvelIdentifiant(),
            $demande,
            array_map(static fn (array $l) => LigneDevis::depuis($l['libelle'], $l['prix']), $lignes),
            $maintenant,
        );
        $this->devis->enregistrer($devis);
        $demande->passerA(StatutDemande::DevisEnvoye, $maintenant);
        $this->demandes->enregistrer($demande);
        $this->notifications->devisEnvoye($demande, $devis);

        return $devis;
    }
}
