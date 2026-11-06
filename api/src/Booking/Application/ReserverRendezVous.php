<?php

declare(strict_types=1);

namespace App\Booking\Application;

use App\Booking\Domain\Contact;
use App\Booking\Domain\CreneauIndisponible;
use App\Booking\Domain\Creneau;
use App\Booking\Domain\DonneesInvalides;
use App\Booking\Domain\Horloge;
use App\Booking\Domain\Identifiants;
use App\Booking\Domain\Lieu;
use App\Booking\Domain\Notifications;
use App\Booking\Domain\RegleDisponibilite;
use App\Booking\Domain\RendezVous;
use App\Booking\Domain\RendezVousRepository;

/**
 * Cas d'usage : réserver un rendez-vous.
 * Vérifie les données, la disponibilité du créneau, enregistre, puis prévient la personne et le professionnel.
 */
final class ReserverRendezVous
{
    public function __construct(
        private readonly RendezVousRepository $rendezVous,
        private readonly Notifications $notifications,
        private readonly RegleDisponibilite $regle,
        private readonly Horloge $horloge,
        private readonly Identifiants $identifiants,
    ) {
    }

    /**
     * @param array<string, mixed> $donnees lieu, adresse, jour, creneau, nom, email, telephone, activite, message,
     *                                     et pour un rendez-vous chez le client : kmFactures, fraisCentimes (estimation)
     *
     * @throws DonneesInvalides    données manquantes ou mal formées
     * @throws CreneauIndisponible créneau déjà pris ou non réservable
     */
    public function __invoke(array $donnees): RendezVous
    {
        $texte = static fn (string $cle): string => is_string($donnees[$cle] ?? null) ? $donnees[$cle] : '';
        $erreurs = [];

        $lieu = Lieu::tryFrom($texte('lieu'));
        if ($lieu === null) {
            $erreurs['lieu'] = 'Lieu inconnu (chezvous, visio ou telephone).';
        }
        $creneau = $contact = null;
        try {
            $creneau = Creneau::depuis($texte('jour'), $texte('creneau'));
        } catch (DonneesInvalides $e) {
            $erreurs += $e->erreurs;
        }
        try {
            $contact = Contact::depuis($texte('nom'), $texte('email'), $texte('telephone'));
        } catch (DonneesInvalides $e) {
            $erreurs += $e->erreurs;
        }
        if ($erreurs !== [] || $lieu === null || $creneau === null || $contact === null) {
            throw new DonneesInvalides($erreurs);
        }

        $maintenant = $this->horloge->maintenant();
        if (!$this->regle->estReservable($creneau, $maintenant) || $this->rendezVous->creneauPris($creneau)) {
            throw new CreneauIndisponible("Le créneau du {$creneau->jour} à {$creneau->heure} n'est pas disponible.");
        }

        $rendezVous = RendezVous::reserver(
            $this->identifiants->nouvelIdentifiant(),
            $lieu,
            is_string($donnees['adresse'] ?? null) ? $donnees['adresse'] : null,
            $creneau,
            $contact,
            $texte('activite'),
            $texte('message'),
            $this->identifiants->nouveauJeton(),
            $maintenant,
            is_int($donnees['kmFactures'] ?? null) ? $donnees['kmFactures'] : null,
            is_int($donnees['fraisCentimes'] ?? null) ? $donnees['fraisCentimes'] : null,
        );
        $this->rendezVous->enregistrer($rendezVous);
        $this->notifications->rendezVousConfirme($rendezVous);

        return $rendezVous;
    }
}
