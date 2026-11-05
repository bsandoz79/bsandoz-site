<?php

declare(strict_types=1);

namespace App\Auth\Infrastructure\Doctrine;

use App\Auth\Domain\Session;
use App\Auth\Domain\Sessions;
use Doctrine\ORM\EntityManagerInterface;

/** Adaptateur Doctrine du port Sessions (table auth_session). */
final class SessionsDoctrine implements Sessions
{
    public function __construct(private readonly EntityManagerInterface $em)
    {
    }

    public function parEmpreinte(string $empreinte): ?Session
    {
        return $this->em->getRepository(Session::class)->findOneBy(['empreinte' => $empreinte]);
    }

    public function actives(string $compteId, \DateTimeImmutable $maintenant): array
    {
        /** @var list<Session> $sessions */
        $sessions = $this->em->createQueryBuilder()
            ->select('s')->from(Session::class, 's')
            ->where('s.compteId = :compte AND s.fermeeLe IS NULL')
            ->orderBy('s.derniereActivite', 'DESC')
            ->setParameter('compte', $compteId)
            ->getQuery()->getResult();

        // L'expiration (30 jours sans activité) est une règle du domaine : on la laisse décider.
        return array_values(array_filter($sessions, static fn (Session $s) => $s->estActive($maintenant)));
    }

    public function enregistrer(Session $session): void
    {
        $this->em->persist($session);
        $this->em->flush();
    }
}
