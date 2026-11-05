<?php

declare(strict_types=1);

namespace App\Booking\Domain;

/** Un rendez-vous découverte réservé en ligne. */
final class RendezVous
{
    private StatutRendezVous $statut = StatutRendezVous::Confirme;

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
        );
    }

    public function statut(): StatutRendezVous
    {
        return $this->statut;
    }

    public function estConfirme(): bool
    {
        return $this->statut === StatutRendezVous::Confirme;
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
