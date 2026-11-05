<?php

declare(strict_types=1);

namespace App\Prospect\Infrastructure\Doctrine;

use App\Prospect\Domain\Demande;
use App\Prospect\Domain\Demandes;
use App\Prospect\Domain\Devis;
use Doctrine\ORM\EntityManagerInterface;

/** Adaptateur Doctrine du port Demandes (table prospect_demande). */
final class DemandesDoctrine implements Demandes
{
    public function __construct(private readonly EntityManagerInterface $em)
    {
    }

    public function parId(string $id): ?Demande
    {
        return $this->em->find(Demande::class, $id);
    }

    public function parEmail(string $email): array
    {
        /** @var list<Demande> */
        return $this->em->createQueryBuilder()
            ->select('d')->from(Demande::class, 'd')
            ->where('d.demandeur.email = :email')
            ->orderBy('d.creeLe', 'DESC')
            ->setParameter('email', mb_strtolower(trim($email)))
            ->getQuery()->getResult();
    }

    public function nombreRecuesEn(int $annee): int
    {
        return (int) $this->em->createQueryBuilder()
            ->select('COUNT(d.id)')->from(Demande::class, 'd')
            ->where('d.numero LIKE :prefixe')
            ->setParameter('prefixe', $annee . '-%')
            ->getQuery()->getSingleScalarResult();
    }

    public function enregistrer(Demande $demande): void
    {
        $this->em->persist($demande);
        $this->em->flush();
    }

    public function supprimer(Demande $demande): void
    {
        $this->em->wrapInTransaction(function () use ($demande): void {
            $this->em->createQueryBuilder()->delete(Devis::class, 'v')->where('v.demandeId = :demande')
                ->setParameter('demande', $demande->id)->getQuery()->execute();
            $this->em->remove($demande);
        });
    }
}
