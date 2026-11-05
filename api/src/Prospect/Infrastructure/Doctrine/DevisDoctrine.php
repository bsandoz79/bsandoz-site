<?php

declare(strict_types=1);

namespace App\Prospect\Infrastructure\Doctrine;

use App\Prospect\Domain\Devis;
use App\Prospect\Domain\DevisEnregistres;
use Doctrine\ORM\EntityManagerInterface;

/** Adaptateur Doctrine du port DevisEnregistres (table prospect_devis). */
final class DevisDoctrine implements DevisEnregistres
{
    public function __construct(private readonly EntityManagerInterface $em)
    {
    }

    public function pourDemande(string $demandeId): ?Devis
    {
        return $this->em->getRepository(Devis::class)->findOneBy(['demandeId' => $demandeId]);
    }

    public function enregistrer(Devis $devis): void
    {
        $this->em->persist($devis);
        $this->em->flush();
    }
}
