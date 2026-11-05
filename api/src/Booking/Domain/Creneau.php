<?php

declare(strict_types=1);

namespace App\Booking\Domain;

/**
 * Un créneau : un jour (AAAA-MM-JJ) et une heure de début (HH:MM), à l'heure de Paris.
 */
final class Creneau
{
    private function __construct(
        public readonly string $jour,
        public readonly string $heure,
    ) {
    }

    public static function depuis(string $jour, string $heure): self
    {
        $date = \DateTimeImmutable::createFromFormat('!Y-m-d', $jour);
        if ($date === false || $date->format('Y-m-d') !== $jour) {
            throw new DonneesInvalides(['jour' => 'Date invalide (format AAAA-MM-JJ attendu).']);
        }
        if (!preg_match('/^([01]\d|2[0-3]):[0-5]\d$/', $heure)) {
            throw new DonneesInvalides(['creneau' => 'Heure invalide (format HH:MM attendu).']);
        }

        return new self($jour, $heure);
    }

    public function debut(\DateTimeZone $fuseau): \DateTimeImmutable
    {
        return new \DateTimeImmutable("{$this->jour} {$this->heure}", $fuseau);
    }

    public function fin(\DateTimeZone $fuseau, int $dureeMinutes): \DateTimeImmutable
    {
        return $this->debut($fuseau)->modify("+{$dureeMinutes} minutes");
    }

    /** Jour de la semaine : lundi = 0 … dimanche = 6. */
    public function jourDeLaSemaine(): int
    {
        return ((int) (new \DateTimeImmutable($this->jour))->format('N')) - 1;
    }

    public function egal(self $autre): bool
    {
        return $this->jour === $autre->jour && $this->heure === $autre->heure;
    }
}
