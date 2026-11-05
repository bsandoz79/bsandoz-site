<?php

declare(strict_types=1);

namespace App\Prospect\Domain;

/** Port : stockage des devis (un devis par demande). */
interface DevisEnregistres
{
    public function pourDemande(string $demandeId): ?Devis;

    public function enregistrer(Devis $devis): void;
}
