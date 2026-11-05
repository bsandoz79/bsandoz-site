<?php

declare(strict_types=1);

namespace App\Auth\Application;

use App\Auth\Domain\Compte;
use App\Auth\Domain\Comptes;
use App\Auth\Domain\DonneesInvalides;
use App\Auth\Domain\Email;
use App\Auth\Domain\Horloge;
use App\Auth\Domain\Lien;
use App\Auth\Domain\LienInvalide;
use App\Auth\Domain\Liens;
use App\Auth\Domain\NotificationsCompte;
use App\Auth\Domain\Secret;
use App\Auth\Domain\UsageLien;

/**
 * Cas d'usage de « Mon compte » : coordonnées et préférences, changement d'e-mail confirmé par la nouvelle adresse,
 * suppression du compte confirmée par mail.
 */
final class MonCompte
{
    public function __construct(
        private readonly Comptes $comptes,
        private readonly Liens $liens,
        private readonly Outils $outils,
        private readonly NotificationsCompte $notifications,
        private readonly Horloge $horloge,
    ) {
    }

    /** @throws DonneesInvalides */
    public function modifierProfil(Compte $compte, string $nom, string $entreprise, string $telephone, string $adresse, bool $notificationsParMail): void
    {
        $compte->modifierProfil($nom, $entreprise, $telephone, $adresse, $notificationsParMail);
        $this->comptes->enregistrer($compte);
    }

    /**
     * Envoie un lien de confirmation à la nouvelle adresse. L'adresse du compte ne change qu'à l'ouverture de ce lien.
     *
     * @throws DonneesInvalides adresse invalide, identique, ou déjà utilisée par un autre compte
     */
    public function demanderChangementEmail(Compte $compte, string $nouvelEmail): void
    {
        $nouvelEmail = Email::normaliser($nouvelEmail);
        if ($nouvelEmail === $compte->email()) {
            throw new DonneesInvalides(['email' => 'C’est déjà l’adresse de votre compte.']);
        }
        if ($this->comptes->parEmail($nouvelEmail) !== null) {
            throw new DonneesInvalides(['email' => 'Cette adresse est déjà utilisée par un autre compte.']);
        }
        $this->outils->envoyerLien($compte, UsageLien::ChangementEmail, $nouvelEmail);
    }

    /**
     * Ouvre le lien reçu à la nouvelle adresse : l'adresse du compte change, l'ancienne est prévenue.
     *
     * @throws LienInvalide
     * @throws DonneesInvalides l'adresse a été prise entre-temps par un autre compte
     */
    public function confirmerChangementEmail(string $secret): Compte
    {
        $maintenant = $this->horloge->maintenant();
        [$lien, $compte] = $this->lienValide($secret, UsageLien::ChangementEmail);
        $nouvelEmail = (string) $lien->nouvelEmail;
        if ($this->comptes->parEmail($nouvelEmail) !== null) {
            throw new DonneesInvalides(['email' => 'Cette adresse est déjà utilisée par un autre compte.']);
        }

        $lien->utiliser($maintenant);
        $this->liens->enregistrer($lien);
        $ancienne = $compte->email();
        $compte->changerEmail($nouvelEmail);
        $compte->activer($maintenant);
        $this->comptes->enregistrer($compte);
        $this->notifications->emailModifie($compte, $ancienne);

        return $compte;
    }

    public function demanderSuppression(Compte $compte): void
    {
        $this->outils->envoyerLien($compte, UsageLien::Suppression);
    }

    /**
     * Supprime définitivement le compte (avec ses liens et ses sessions) et confirme par mail.
     * Renvoie l'adresse et le nom du compte supprimé, pour effacer ailleurs ce qui s'y rattache.
     *
     * @return array{email: string, nom: string}
     *
     * @throws LienInvalide
     */
    public function confirmerSuppression(string $secret): array
    {
        [$lien, $compte] = $this->lienValide($secret, UsageLien::Suppression);
        $lien->utiliser($this->horloge->maintenant());
        $supprime = ['email' => $compte->email(), 'nom' => $compte->nom()];
        $this->comptes->supprimer($compte);
        $this->notifications->compteSupprime($supprime['email'], $supprime['nom']);

        return $supprime;
    }

    /** @return array{Lien, Compte} */
    private function lienValide(string $secret, UsageLien $usage): array
    {
        $lien = $this->liens->parEmpreinte(Secret::empreinte($secret));
        if ($lien === null || $lien->usage !== $usage || !$lien->estValide($this->horloge->maintenant())) {
            throw new LienInvalide('Ce lien a expiré ou a déjà servi.');
        }
        $compte = $this->comptes->parId($lien->compteId) ?? throw new LienInvalide('Compte introuvable.');

        return [$lien, $compte];
    }
}
