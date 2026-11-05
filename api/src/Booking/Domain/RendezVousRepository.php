<?php

declare(strict_types=1);

namespace App\Booking\Domain;

/** Port : où sont gardés les rendez-vous (Doctrine en production, mémoire dans les tests). */
interface RendezVousRepository
{
    /** Un rendez-vous confirmé occupe-t-il déjà ce créneau ? */
    public function creneauPris(Creneau $creneau): bool;

    public function enregistrer(RendezVous $rendezVous): void;

    public function parJeton(string $jeton): ?RendezVous;

    public function parId(string $id): ?RendezVous;

    /**
     * Rendez-vous pris avec cette adresse e-mail (sans tenir compte des majuscules), du plus proche au plus lointain.
     *
     * @return list<RendezVous>
     */
    public function parEmail(string $email): array;
}
