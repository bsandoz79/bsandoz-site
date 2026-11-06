<?php

declare(strict_types=1);

namespace App\Booking\Domain;

/** Disponibilités réglées depuis le back-office. Sans elles, les valeurs de booking.yaml s'appliquent. */
class Disponibilites
{
    private const UNIQUE = 'regles';
    private const JOURS_FERMES_MAX = 366;
    private const CRENEAUX_MAX = 24;

    /**
     * @param list<int>    $joursTravailles lundi = 0 … dimanche = 6
     * @param list<string> $creneaux        « HH:MM »
     * @param list<string> $joursFermes     « AAAA-MM-JJ » : congés, fermetures
     */
    private function __construct(
        public readonly string $id,
        public readonly array $joursTravailles,
        public readonly array $creneaux,
        public readonly array $joursFermes,
    ) {
    }

    /**
     * @param array<mixed> $joursTravailles
     * @param array<mixed> $creneaux
     * @param array<mixed> $joursFermes
     *
     * @throws DonneesInvalides
     */
    public static function depuis(array $joursTravailles, array $creneaux, array $joursFermes): self
    {
        $erreurs = [];
        if ($joursTravailles === [] || array_filter($joursTravailles, static fn ($j) => !is_int($j) || $j < 0 || $j > 6) !== []) {
            $erreurs['joursTravailles'] = 'Choisissez au moins un jour.';
        }
        if ($creneaux === [] || count($creneaux) > self::CRENEAUX_MAX || array_filter($creneaux, static fn ($c) => !is_string($c) || preg_match('/^([01]\d|2[0-3]):[0-5]\d$/', $c) !== 1) !== []) {
            $erreurs['creneaux'] = 'Indiquez au moins un créneau, au format 09:00.';
        }
        if (count($joursFermes) > self::JOURS_FERMES_MAX || array_filter($joursFermes, static fn ($j) => !self::estUneDate($j)) !== []) {
            $erreurs['joursFermes'] = 'Jour fermé invalide.';
        }
        if ($erreurs !== []) {
            throw new DonneesInvalides($erreurs);
        }
        $trier = static function (array $valeurs): array {
            $valeurs = array_values(array_unique($valeurs));
            sort($valeurs);

            return $valeurs;
        };

        return new self(self::UNIQUE, $trier($joursTravailles), $trier($creneaux), $trier($joursFermes));
    }

    private static function estUneDate(mixed $jour): bool
    {
        if (!is_string($jour)) {
            return false;
        }
        $date = \DateTimeImmutable::createFromFormat('!Y-m-d', $jour);

        return $date !== false && $date->format('Y-m-d') === $jour;
    }
}
