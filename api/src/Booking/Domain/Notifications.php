<?php

declare(strict_types=1);

namespace App\Booking\Domain;

/** Port : prévenir la personne et le professionnel (e-mails en production). */
interface Notifications
{
    public function rendezVousConfirme(RendezVous $rendezVous): void;

    public function rendezVousAnnule(RendezVous $rendezVous): void;

    /**
     * Le professionnel annule : la personne reçoit ses disponibilités et un lien pour reprendre un créneau.
     *
     * @param string $message ce que le professionnel propose
     * @param string $lien    adresse de la prise de rendez-vous
     */
    public function rendezVousAnnuleParProfessionnel(RendezVous $rendezVous, string $message, string $lien): void;

    /** Rappel la veille du rendez-vous, à la personne. */
    public function rappel(RendezVous $rendezVous): void;
}
