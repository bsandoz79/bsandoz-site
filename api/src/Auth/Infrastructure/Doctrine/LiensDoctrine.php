<?php

declare(strict_types=1);

namespace App\Auth\Infrastructure\Doctrine;

use App\Auth\Domain\Lien;
use App\Auth\Domain\Liens;
use App\Auth\Domain\UsageLien;
use Doctrine\ORM\EntityManagerInterface;

/** Adaptateur Doctrine du port Liens (table auth_lien). */
final class LiensDoctrine implements Liens
{
    public function __construct(private readonly EntityManagerInterface $em)
    {
    }

    public function parEmpreinte(string $empreinte): ?Lien
    {
        return $this->em->getRepository(Lien::class)->findOneBy(['empreinte' => $empreinte]);
    }

    public function valides(string $compteId, UsageLien $usage, \DateTimeImmutable $maintenant): array
    {
        /** @var list<Lien> */
        return $this->em->createQueryBuilder()
            ->select('l')->from(Lien::class, 'l')
            ->where('l.compteId = :compte AND l.usage = :usage AND l.utiliseLe IS NULL AND l.expireLe > :maintenant')
            ->setParameter('compte', $compteId)
            ->setParameter('usage', $usage)
            ->setParameter('maintenant', $maintenant)
            ->getQuery()->getResult();
    }

    public function enregistrer(Lien $lien): void
    {
        $this->em->persist($lien);
        $this->em->flush();
    }
}
