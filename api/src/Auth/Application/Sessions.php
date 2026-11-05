<?php

declare(strict_types=1);

namespace App\Auth\Application;

use App\Auth\Domain\Comptes;
use App\Auth\Domain\Horloge;
use App\Auth\Domain\Secret;
use App\Auth\Domain\Session;
use App\Auth\Domain\Sessions as DepotSessions;

/** Cas d'usage autour de la session courante : qui est connecté, se déconnecter, appareils connectés. */
final class Sessions
{
    public function __construct(
        private readonly DepotSessions $sessions,
        private readonly Comptes $comptes,
        private readonly Horloge $horloge,
    ) {
    }

    /** Session du cookie, si elle est encore active (et son compte) ; null sinon. */
    public function courante(string $secret): ?SessionOuverte
    {
        if ($secret === '') {
            return null;
        }
        $maintenant = $this->horloge->maintenant();
        $session = $this->sessions->parEmpreinte(Secret::empreinte($secret));
        if ($session === null || !$session->estActive($maintenant)) {
            return null;
        }
        $compte = $this->comptes->parId($session->compteId);
        if ($compte === null) {
            return null;
        }
        if ($session->noterActivite($maintenant)) {
            $this->sessions->enregistrer($session);
        }

        return new SessionOuverte($compte, $session, $secret);
    }

    public function deconnecter(string $secret): void
    {
        $courante = $this->courante($secret);
        if ($courante !== null) {
            $courante->session->fermer($this->horloge->maintenant());
            $this->sessions->enregistrer($courante->session);
        }
    }

    /** @return list<Session> */
    public function appareils(string $compteId): array
    {
        return $this->sessions->actives($compteId, $this->horloge->maintenant());
    }

    /** Ferme toutes les sessions du compte sauf celle-ci. Renvoie le nombre d'appareils déconnectés. */
    public function deconnecterLesAutres(SessionOuverte $courante): int
    {
        $maintenant = $this->horloge->maintenant();
        $fermees = 0;
        foreach ($this->sessions->actives($courante->compte->id, $maintenant) as $session) {
            if ($session->id !== $courante->session->id) {
                $session->fermer($maintenant);
                $this->sessions->enregistrer($session);
                ++$fermees;
            }
        }

        return $fermees;
    }
}
