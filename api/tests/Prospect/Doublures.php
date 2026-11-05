<?php

declare(strict_types=1);

namespace App\Tests\Prospect;

use App\Prospect\Domain\Demande;
use App\Prospect\Domain\Demandes;
use App\Prospect\Domain\Devis;
use App\Prospect\Domain\DevisEnregistres;
use App\Prospect\Domain\Horloge;
use App\Prospect\Domain\Identifiants;
use App\Prospect\Domain\NotificationsProspect;

/** Doublures des ports du module Prospect. */
final class DemandesEnMemoire implements Demandes
{
    /** @var array<string, Demande> */
    public array $toutes = [];

    public function parId(string $id): ?Demande
    {
        return $this->toutes[$id] ?? null;
    }

    public function parEmail(string $email): array
    {
        $trouvees = array_values(array_filter($this->toutes, static fn (Demande $d) => $d->demandeur->estLaMemePersonne($email)));
        usort($trouvees, static fn (Demande $a, Demande $b) => $b->creeLe <=> $a->creeLe);

        return $trouvees;
    }

    public function nombreRecuesEn(int $annee): int
    {
        return count(array_filter($this->toutes, static fn (Demande $d) => (int) $d->creeLe->format('Y') === $annee));
    }

    public function enregistrer(Demande $demande): void
    {
        $this->toutes[$demande->id] = $demande;
    }

    public function supprimer(Demande $demande): void
    {
        unset($this->toutes[$demande->id]);
    }
}

final class DevisEnMemoire implements DevisEnregistres
{
    /** @var array<string, Devis> */
    public array $tous = [];

    public function pourDemande(string $demandeId): ?Devis
    {
        foreach ($this->tous as $devis) {
            if ($devis->demandeId === $demandeId) {
                return $devis;
            }
        }

        return null;
    }

    public function enregistrer(Devis $devis): void
    {
        $this->tous[$devis->id] = $devis;
    }
}

final class HorlogeProspect implements Horloge
{
    public function __construct(public \DateTimeImmutable $maintenant)
    {
    }

    public function maintenant(): \DateTimeImmutable
    {
        return $this->maintenant;
    }
}

final class IdentifiantsProspect implements Identifiants
{
    private int $n = 0;

    public function nouvelIdentifiant(): string
    {
        return 'p-' . ++$this->n;
    }
}

final class NotificationsProspectEnregistrees implements NotificationsProspect
{
    /** @var list<string> */
    public array $envoyees = [];

    public function demandeRecue(Demande $demande, array $photos): void
    {
        $this->envoyees[] = "recue:{$demande->numero}:" . count($photos);
    }

    public function devisEnvoye(Demande $demande, Devis $devis): void
    {
        $this->envoyees[] = "devis:{$devis->numero}";
    }

    public function devisAccepte(Demande $demande, Devis $devis): void
    {
        $this->envoyees[] = "accepte:{$devis->numero}";
    }
}
