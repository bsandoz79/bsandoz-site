<?php

declare(strict_types=1);

namespace App\Auth\Infrastructure\Doctrine;

use App\Auth\Domain\Compte;
use App\Auth\Domain\Comptes;
use Doctrine\ORM\EntityManagerInterface;

/** Adaptateur Doctrine du port Comptes (table auth_compte). */
final class ComptesDoctrine implements Comptes
{
    public function __construct(private readonly EntityManagerInterface $em)
    {
    }

    public function parId(string $id): ?Compte
    {
        return $this->em->find(Compte::class, $id);
    }

    public function parEmail(string $email): ?Compte
    {
        return $this->em->getRepository(Compte::class)->findOneBy(['email' => $email]);
    }

    public function enregistrer(Compte $compte): void
    {
        $this->em->persist($compte);
        $this->em->flush();
    }
}
