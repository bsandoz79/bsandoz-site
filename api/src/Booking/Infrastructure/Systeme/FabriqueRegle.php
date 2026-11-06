<?php

declare(strict_types=1);

namespace App\Booking\Infrastructure\Systeme;

use App\Booking\Domain\DisponibilitesEnregistrees;
use App\Booking\Domain\RegleDisponibilite;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

/** Règle en vigueur : les disponibilités enregistrées si elles existent, sinon celles de booking.yaml. */
final class FabriqueRegle
{
    /**
     * @param list<int>    $joursTravailles
     * @param list<string> $creneaux
     */
    public function __construct(
        private readonly DisponibilitesEnregistrees $enregistrees,
        #[Autowire('%booking.jours_travailles%')]
        private readonly array $joursTravailles,
        #[Autowire('%booking.creneaux%')]
        private readonly array $creneaux,
        #[Autowire('%booking.duree_minutes%')]
        private readonly int $dureeMinutes,
        #[Autowire('%booking.delai_min_jours%')]
        private readonly int $delaiMinJours,
        #[Autowire('%booking.horizon_jours%')]
        private readonly int $horizonJours,
        #[Autowire('%booking.fuseau%')]
        private readonly string $fuseau,
    ) {
    }

    public function creer(): RegleDisponibilite
    {
        $reglees = $this->enregistrees->lire();

        return new RegleDisponibilite(
            $reglees?->joursTravailles ?? $this->joursTravailles,
            $reglees?->creneaux ?? $this->creneaux,
            $this->dureeMinutes,
            $this->delaiMinJours,
            $this->horizonJours,
            new \DateTimeZone($this->fuseau),
            $reglees?->joursFermes ?? [],
        );
    }
}
