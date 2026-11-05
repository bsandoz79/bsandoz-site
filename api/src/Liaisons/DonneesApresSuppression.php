<?php

declare(strict_types=1);

namespace App\Liaisons;

use App\Auth\Infrastructure\Evenement\CompteSupprime;
use App\Booking\Application\AnnulerRendezVous;
use App\Booking\Domain\Horloge;
use App\Booking\Domain\RegleDisponibilite;
use App\Booking\Domain\RendezVousRepository;
use App\Prospect\Domain\Demandes;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;

/**
 * Liaison propre à bsandoz.fr : quand un compte est supprimé, ses rendez-vous, ses demandes et leurs devis le sont aussi.
 * Un rendez-vous à venir est d'abord annulé (le créneau est libéré et le professionnel prévenu).
 */
final class DonneesApresSuppression
{
    public function __construct(
        private readonly RendezVousRepository $rendezVous,
        private readonly AnnulerRendezVous $annuler,
        private readonly RegleDisponibilite $regle,
        private readonly Horloge $horloge,
        private readonly Demandes $demandes,
    ) {
    }

    #[AsEventListener]
    public function __invoke(CompteSupprime $evenement): void
    {
        $maintenant = $this->horloge->maintenant();
        foreach ($this->rendezVous->parEmail($evenement->email) as $rendezVous) {
            if ($rendezVous->estConfirme() && $rendezVous->creneau->debut($this->regle->fuseau) > $maintenant) {
                ($this->annuler)($rendezVous->jeton);
            }
            $this->rendezVous->supprimer($rendezVous);
        }
        foreach ($this->demandes->parEmail($evenement->email) as $demande) {
            $this->demandes->supprimer($demande);
        }
    }
}
