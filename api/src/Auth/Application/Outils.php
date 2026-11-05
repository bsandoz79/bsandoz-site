<?php

declare(strict_types=1);

namespace App\Auth\Application;

use App\Auth\Domain\Aleatoire;
use App\Auth\Domain\Compte;
use App\Auth\Domain\Horloge;
use App\Auth\Domain\Lien;
use App\Auth\Domain\Liens;
use App\Auth\Domain\NotificationsCompte;
use App\Auth\Domain\Session;
use App\Auth\Domain\Sessions;
use App\Auth\Domain\UsageLien;

/** Opérations communes aux cas d'usage : envoyer un lien par mail, ouvrir une session. */
final class Outils
{
    public function __construct(
        private readonly Liens $liens,
        private readonly Sessions $sessions,
        private readonly NotificationsCompte $notifications,
        private readonly Horloge $horloge,
        private readonly Aleatoire $aleatoire,
    ) {
    }

    /** Envoie un nouveau lien ; les liens précédents du même usage cessent de fonctionner. */
    public function envoyerLien(Compte $compte, UsageLien $usage): void
    {
        $maintenant = $this->horloge->maintenant();
        foreach ($this->liens->valides($compte->id, $usage, $maintenant) as $ancien) {
            $ancien->annuler($maintenant);
            $this->liens->enregistrer($ancien);
        }
        $secret = $this->aleatoire->secret();
        $this->liens->enregistrer(Lien::creer($this->aleatoire->identifiant(), $compte->id, $usage, $secret, $maintenant));
        $this->notifications->lien($compte, $usage, $secret);
    }

    public function ouvrirSession(Compte $compte, string $appareil): SessionOuverte
    {
        $secret = $this->aleatoire->secret();
        $session = Session::ouvrir($this->aleatoire->identifiant(), $compte->id, $secret, $appareil, $this->horloge->maintenant());
        $this->sessions->enregistrer($session);

        return new SessionOuverte($compte, $session, $secret);
    }
}
