<?php

declare(strict_types=1);

namespace App\Booking\Infrastructure\Doctrine;

use App\Booking\Domain\Creneau;
use App\Booking\Domain\RendezVous;
use App\Booking\Domain\RendezVousRepository;
use App\Booking\Domain\StatutRendezVous;
use Doctrine\ORM\EntityManagerInterface;

/** Adaptateur Doctrine du port RendezVousRepository (table booking_rendez_vous). */
final class DoctrineRendezVousRepository implements RendezVousRepository
{
    public function __construct(private readonly EntityManagerInterface $em)
    {
    }

    public function creneauPris(Creneau $creneau): bool
    {
        return (int) $this->em->createQueryBuilder()
            ->select('COUNT(r.id)')
            ->from(RendezVous::class, 'r')
            ->where('r.creneau.jour = :jour AND r.creneau.heure = :heure AND r.statut = :statut')
            ->setParameter('jour', $creneau->jour)
            ->setParameter('heure', $creneau->heure)
            ->setParameter('statut', StatutRendezVous::Confirme)
            ->getQuery()
            ->getSingleScalarResult() > 0;
    }

    public function enregistrer(RendezVous $rendezVous): void
    {
        $this->em->persist($rendezVous);
        $this->em->flush();
    }

    public function parJeton(string $jeton): ?RendezVous
    {
        return $this->em->getRepository(RendezVous::class)->findOneBy(['jeton' => $jeton]);
    }
}
