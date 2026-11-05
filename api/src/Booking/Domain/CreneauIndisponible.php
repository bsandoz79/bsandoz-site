<?php

declare(strict_types=1);

namespace App\Booking\Domain;

/** Le créneau est déjà pris, hors des jours ouverts ou hors des dates réservables. */
final class CreneauIndisponible extends \DomainException
{
}
