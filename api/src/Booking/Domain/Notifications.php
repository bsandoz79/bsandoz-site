<?php

declare(strict_types=1);

namespace App\Booking\Domain;

/** Port : prévenir la personne et le professionnel (e-mails en production). */
interface Notifications
{
    public function rendezVousConfirme(RendezVous $rendezVous): void;

    public function rendezVousAnnule(RendezVous $rendezVous): void;
}
