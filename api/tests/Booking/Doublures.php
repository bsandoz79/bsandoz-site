<?php

declare(strict_types=1);

namespace App\Tests\Booking;

use App\Booking\Domain\Creneau;
use App\Booking\Domain\Horloge;
use App\Booking\Domain\Identifiants;
use App\Booking\Domain\Notifications;
use App\Booking\Domain\RegleDisponibilite;
use App\Booking\Domain\RendezVous;
use App\Booking\Domain\RendezVousRepository;

/** Doublures des ports, pour tester le domaine et les cas d'usage sans base ni mails. */
final class RendezVousEnMemoire implements RendezVousRepository
{
    /** @var array<string, RendezVous> */
    public array $tous = [];

    public function creneauPris(Creneau $creneau): bool
    {
        foreach ($this->tous as $rdv) {
            if ($rdv->estConfirme() && $rdv->creneau->egal($creneau)) {
                return true;
            }
        }

        return false;
    }

    public function enregistrer(RendezVous $rendezVous): void
    {
        $this->tous[$rendezVous->id] = $rendezVous;
    }

    public function parJeton(string $jeton): ?RendezVous
    {
        foreach ($this->tous as $rdv) {
            if ($rdv->jeton === $jeton) {
                return $rdv;
            }
        }

        return null;
    }
}

final class NotificationsEnregistrees implements Notifications
{
    /** @var list<string> */
    public array $envoyees = [];

    public function rendezVousConfirme(RendezVous $rendezVous): void
    {
        $this->envoyees[] = "confirme:{$rendezVous->id}";
    }

    public function rendezVousAnnule(RendezVous $rendezVous): void
    {
        $this->envoyees[] = "annule:{$rendezVous->id}";
    }
}

final class HorlogeFixe implements Horloge
{
    public function __construct(private readonly \DateTimeImmutable $maintenant)
    {
    }

    public function maintenant(): \DateTimeImmutable
    {
        return $this->maintenant;
    }
}

final class IdentifiantsPrevisibles implements Identifiants
{
    private int $compteur = 0;

    public function nouvelIdentifiant(): string
    {
        return 'rdv-' . ++$this->compteur;
    }

    public function nouveauJeton(): string
    {
        return 'jeton-' . $this->compteur;
    }
}

final class Regles
{
    /** Lundi au vendredi, créneaux de la maquette, de demain à 60 jours, heure de Paris. */
    public static function parDefaut(): RegleDisponibilite
    {
        return new RegleDisponibilite([0, 1, 2, 3, 4], ['09:00', '10:30', '14:00', '15:30', '17:00'], 60, 1, 60, new \DateTimeZone('Europe/Paris'));
    }

    /** Jeudi 5 novembre 2026, 10 h à Paris. */
    public static function maintenant(): \DateTimeImmutable
    {
        return new \DateTimeImmutable('2026-11-05 10:00', new \DateTimeZone('Europe/Paris'));
    }
}
