<?php

declare(strict_types=1);

namespace App\Prospect\Domain;

/** Devis envoyé pour une demande ; le client l'accepte depuis son espace. Même numéro que la demande. */
class Devis
{
    /** @param list<array{libelle: string, prix: int}> $lignes */
    private function __construct(
        public readonly string $id,
        public readonly string $demandeId,
        public readonly string $numero,
        private array $lignes,
        public readonly int $total,
        private StatutDevis $statut,
        public readonly \DateTimeImmutable $envoyeLe,
        private ?\DateTimeImmutable $accepteLe,
    ) {
    }

    /** @param list<LigneDevis> $lignes */
    public static function etablir(string $id, Demande $demande, array $lignes, \DateTimeImmutable $maintenant): self
    {
        if ($lignes === []) {
            throw new DonneesInvalides(['lignes' => 'Un devis a au moins une ligne.']);
        }
        $total = array_sum(array_map(static fn (LigneDevis $l) => $l->prix, $lignes));

        return new self($id, $demande->id, $demande->numero, array_map(static fn (LigneDevis $l) => $l->enTableau(), $lignes), $total, StatutDevis::Envoye, $maintenant, null);
    }

    /** @return list<LigneDevis> */
    public function lignes(): array
    {
        return array_map(static fn (array $l) => LigneDevis::depuis($l['libelle'], $l['prix']), $this->lignes);
    }

    public function statut(): StatutDevis
    {
        return $this->statut;
    }

    public function accepteLe(): ?\DateTimeImmutable
    {
        return $this->accepteLe;
    }

    public function accepter(\DateTimeImmutable $maintenant): void
    {
        if ($this->statut === StatutDevis::Accepte) {
            throw new ActionImpossible('Ce devis est déjà accepté.');
        }
        $this->statut = StatutDevis::Accepte;
        $this->accepteLe = $maintenant;
    }
}
