<?php

declare(strict_types=1);

namespace App\Booking\Domain;

/**
 * Quand peut-on réserver ? Réglée par chaque installation (booking.yaml), puis depuis le back-office.
 */
final class RegleDisponibilite
{
    /**
     * @param list<int>    $joursTravailles lundi = 0 … dimanche = 6
     * @param list<string> $creneaux        heures de début, « HH:MM »
     * @param list<string> $joursFermes     « AAAA-MM-JJ » : congés, fermetures
     */
    public function __construct(
        public readonly array $joursTravailles,
        public readonly array $creneaux,
        public readonly int $dureeMinutes,
        public readonly int $delaiMinJours,
        public readonly int $horizonJours,
        public readonly \DateTimeZone $fuseau,
        public readonly array $joursFermes = [],
    ) {
    }

    public function estReservable(Creneau $creneau, \DateTimeImmutable $maintenant): bool
    {
        $aujourdhui = $maintenant->setTimezone($this->fuseau)->setTime(0, 0);
        $jour = new \DateTimeImmutable($creneau->jour, $this->fuseau);
        $ecart = (int) $aujourdhui->diff($jour)->format('%r%a');

        return $ecart >= $this->delaiMinJours
            && $ecart <= $this->horizonJours
            && in_array($creneau->jourDeLaSemaine(), $this->joursTravailles, true)
            && in_array($creneau->heure, $this->creneaux, true)
            && !in_array($creneau->jour, $this->joursFermes, true);
    }
}
