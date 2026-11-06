<?php

declare(strict_types=1);

namespace App\Booking\Domain;

/** Un rendez-vous découverte réservé en ligne. */
class RendezVous
{
    private StatutRendezVous $statut = StatutRendezVous::Confirme;
    private ?\DateTimeImmutable $rappelEnvoyeLe = null;

    private function __construct(
        public readonly string $id,
        public readonly Lieu $lieu,
        public readonly ?string $adresse,
        public readonly Creneau $creneau,
        public readonly Contact $contact,
        public readonly string $activite,
        public readonly string $message,
        /** Jeton secret du lien « déplacer ou annuler » envoyé par mail. */
        public readonly string $jeton,
        public readonly \DateTimeImmutable $creeLe,
        /** Kilomètres facturés (aller-retour, au-delà de la zone gratuite), pour un rendez-vous chez le client. */
        public readonly ?int $kmFactures = null,
        /** Frais kilométriques estimés, en centimes. */
        public readonly ?int $fraisCentimes = null,
    ) {
    }

    public static function reserver(
        string $id,
        Lieu $lieu,
        ?string $adresse,
        Creneau $creneau,
        Contact $contact,
        string $activite,
        string $message,
        string $jeton,
        \DateTimeImmutable $maintenant,
        ?int $kmFactures = null,
        ?int $fraisCentimes = null,
    ): self {
        $adresse = $adresse !== null ? trim($adresse) : null;
        if ($lieu === Lieu::ChezLeClient && ($adresse === null || $adresse === '')) {
            throw new DonneesInvalides(['adresse' => "L'adresse est obligatoire pour un rendez-vous chez vous."]);
        }

        return new self(
            $id,
            $lieu,
            $lieu === Lieu::ChezLeClient ? mb_substr((string) $adresse, 0, 300) : null,
            $creneau,
            $contact,
            mb_substr(trim($activite), 0, 120),
            mb_substr(trim($message), 0, 2000),
            $jeton,
            $maintenant,
            ...self::deplacement($lieu, $kmFactures, $fraisCentimes),
        );
    }

    /**
     * Frais de déplacement gardés seulement chez le client, et seulement s'ils sont plausibles
     * (nombres positifs, au plus 4 000 km et 2 000 €) ; sinon aucun.
     *
     * @return array{0: ?int, 1: ?int}
     */
    private static function deplacement(Lieu $lieu, ?int $km, ?int $centimes): array
    {
        $valide = $lieu === Lieu::ChezLeClient
            && $km !== null && $centimes !== null
            && $km > 0 && $km <= 4000 && $centimes > 0 && $centimes <= 200000;

        return $valide ? [$km, $centimes] : [null, null];
    }

    /** « 18,75 € » : frais kilométriques lisibles, ou null s'il n'y en a pas. */
    public function fraisLisibles(): ?string
    {
        return $this->fraisCentimes === null
            ? null
            : number_format($this->fraisCentimes / 100, 2, ',', ' ') . ' €';
    }

    public function statut(): StatutRendezVous
    {
        return $this->statut;
    }

    public function estConfirme(): bool
    {
        return $this->statut === StatutRendezVous::Confirme;
    }

    public function rappelEnvoyeLe(): ?\DateTimeImmutable
    {
        return $this->rappelEnvoyeLe;
    }

    public function marquerRappele(\DateTimeImmutable $maintenant): void
    {
        $this->rappelEnvoyeLe = $maintenant;
    }

    /** Annule le rendez-vous ; sans effet s'il l'est déjà. Renvoie vrai si l'état a changé. */
    public function annuler(): bool
    {
        if (!$this->estConfirme()) {
            return false;
        }
        $this->statut = StatutRendezVous::Annule;

        return true;
    }
}
