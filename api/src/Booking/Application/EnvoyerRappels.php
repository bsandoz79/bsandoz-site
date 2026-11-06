<?php

declare(strict_types=1);

namespace App\Booking\Application;

use App\Booking\Domain\Horloge;
use App\Booking\Domain\Notifications;
use App\Booking\Domain\PreferencesRappel;
use App\Booking\Domain\RegleDisponibilite;
use App\Booking\Domain\RendezVousRepository;

/**
 * Cas d'usage : rappeler la veille les rendez-vous du lendemain. Peut être relancé sans risque :
 * un rendez-vous n'est rappelé qu'une fois, même si la personne a refusé les rappels.
 */
final class EnvoyerRappels
{
    public function __construct(
        private readonly RendezVousRepository $rendezVous,
        private readonly Notifications $notifications,
        private readonly PreferencesRappel $preferences,
        private readonly RegleDisponibilite $regle,
        private readonly Horloge $horloge,
    ) {
    }

    /** @return array{envoyes: int, refuses: int} */
    public function __invoke(): array
    {
        $maintenant = $this->horloge->maintenant();
        $demain = $maintenant->setTimezone($this->regle->fuseau)->modify('+1 day')->format('Y-m-d');
        $bilan = ['envoyes' => 0, 'refuses' => 0];
        foreach ($this->rendezVous->aRappeler($demain) as $rendezVous) {
            if ($this->preferences->accepte($rendezVous->contact->email)) {
                $this->notifications->rappel($rendezVous);
                ++$bilan['envoyes'];
            } else {
                ++$bilan['refuses'];
            }
            $rendezVous->marquerRappele($maintenant);
            $this->rendezVous->enregistrer($rendezVous);
        }

        return $bilan;
    }
}
