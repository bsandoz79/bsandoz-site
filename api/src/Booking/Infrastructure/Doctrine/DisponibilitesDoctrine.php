<?php

declare(strict_types=1);

namespace App\Booking\Infrastructure\Doctrine;

use App\Booking\Domain\Disponibilites;
use App\Booking\Domain\DisponibilitesEnregistrees;
use Doctrine\ORM\EntityManagerInterface;

/** Adaptateur Doctrine (table booking_disponibilites, une seule ligne). */
final class DisponibilitesDoctrine implements DisponibilitesEnregistrees
{
    public function __construct(private readonly EntityManagerInterface $em)
    {
    }

    public function lire(): ?Disponibilites
    {
        return $this->em->getRepository(Disponibilites::class)->findOneBy([]);
    }

    public function enregistrer(Disponibilites $disponibilites): void
    {
        $this->em->wrapInTransaction(function () use ($disponibilites): void {
            $ancienne = $this->lire();
            if ($ancienne !== null) {
                $this->em->remove($ancienne);
                $this->em->flush();
            }
            $this->em->persist($disponibilites);
        });
    }
}
