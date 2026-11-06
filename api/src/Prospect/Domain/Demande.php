<?php

declare(strict_types=1);

namespace App\Prospect\Domain;

/** Demande de devis envoyée depuis le site, suivie de « Reçue » à « Livré ». */
class Demande
{
    private function __construct(
        public readonly string $id,
        public readonly string $numero,
        public readonly Demandeur $demandeur,
        public readonly string $titre,
        public readonly string $recapitulatif,
        public readonly string $predevis,
        private StatutDemande $statut,
        public readonly \DateTimeImmutable $creeLe,
        private \DateTimeImmutable $statutModifieLe,
    ) {
    }

    /** Numéro lisible : année et rang dans l'année (« 2026-014 »). */
    public static function numero(\DateTimeImmutable $maintenant, int $dejaRecuesCetteAnnee): string
    {
        return sprintf('%s-%03d', $maintenant->format('Y'), $dejaRecuesCetteAnnee + 1);
    }

    public static function recevoir(
        string $id,
        string $numero,
        Demandeur $demandeur,
        string $titre,
        string $recapitulatif,
        string $predevis,
        \DateTimeImmutable $maintenant,
    ): self {
        $recapitulatif = trim($recapitulatif);
        if (mb_strlen($recapitulatif) < 20) {
            throw new DonneesInvalides(['recapitulatif' => 'La demande est trop courte.']);
        }
        $titre = trim($titre) !== '' ? mb_substr(trim($titre), 0, 160) : 'Projet de site';

        return new self(
            $id,
            $numero,
            $demandeur,
            $titre,
            mb_substr($recapitulatif, 0, 8000),
            mb_substr(trim(str_replace("\r", '', $predevis)), 0, 3000),
            StatutDemande::Recue,
            $maintenant,
            $maintenant,
        );
    }

    public function statut(): StatutDemande
    {
        return $this->statut;
    }

    public function statutModifieLe(): \DateTimeImmutable
    {
        return $this->statutModifieLe;
    }

    /** Fait avancer (ou corriger) le statut ; sans effet s'il est déjà celui-ci. */
    public function passerA(StatutDemande $statut, \DateTimeImmutable $maintenant): void
    {
        if ($statut !== $this->statut) {
            $this->statut = $statut;
            $this->statutModifieLe = $maintenant;
        }
    }
}
