<?php

declare(strict_types=1);

namespace App\Prospect\Application;

use App\Prospect\Domain\Demande;
use App\Prospect\Domain\Demandes;
use App\Prospect\Domain\Demandeur;
use App\Prospect\Domain\DonneesInvalides;
use App\Prospect\Domain\Horloge;
use App\Prospect\Domain\Identifiants;
use App\Prospect\Domain\NotificationsProspect;
use App\Prospect\Domain\PieceJointe;

/**
 * Cas d'usage : recevoir une demande de devis du site. Elle est numérotée, enregistrée (« Reçue »),
 * puis le demandeur reçoit l'accusé de réception avec le pré-devis, et le professionnel la demande avec les photos.
 */
final class EnregistrerDemande
{
    public function __construct(
        private readonly Demandes $demandes,
        private readonly NotificationsProspect $notifications,
        private readonly Horloge $horloge,
        private readonly Identifiants $identifiants,
    ) {
    }

    /**
     * @param array<string, string> $donnees nom, email, telephone, entreprise, titre, recapitulatif, predevis
     * @param list<PieceJointe>     $photos
     *
     * @throws DonneesInvalides
     */
    public function __invoke(array $donnees, array $photos = []): Demande
    {
        $texte = static fn (string $cle): string => $donnees[$cle] ?? '';
        $erreurs = [];
        $demandeur = null;
        try {
            $demandeur = Demandeur::depuis($texte('nom'), $texte('email'), $texte('telephone'), $texte('entreprise'));
        } catch (DonneesInvalides $e) {
            $erreurs = $e->erreurs;
        }
        if (mb_strlen(trim($texte('recapitulatif'))) < 20) {
            $erreurs['recapitulatif'] = 'La demande est trop courte.';
        }
        if ($erreurs !== [] || $demandeur === null) {
            throw new DonneesInvalides($erreurs);
        }

        $maintenant = $this->horloge->maintenant();
        $demande = Demande::recevoir(
            $this->identifiants->nouvelIdentifiant(),
            Demande::numero($maintenant, $this->demandes->nombreRecuesEn((int) $maintenant->format('Y'))),
            $demandeur,
            $texte('titre'),
            $texte('recapitulatif'),
            $texte('predevis'),
            $maintenant,
        );
        $this->demandes->enregistrer($demande);
        $this->notifications->demandeRecue($demande, $photos);

        return $demande;
    }
}
