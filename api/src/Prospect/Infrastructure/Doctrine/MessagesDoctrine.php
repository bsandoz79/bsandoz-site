<?php

declare(strict_types=1);

namespace App\Prospect\Infrastructure\Doctrine;

use App\Prospect\Domain\Message;
use App\Prospect\Domain\Messages;
use Doctrine\ORM\EntityManagerInterface;

/** Adaptateur Doctrine du port Messages (table prospect_message). */
final class MessagesDoctrine implements Messages
{
    public function __construct(private readonly EntityManagerInterface $em)
    {
    }

    public function pourDemande(string $demandeId): array
    {
        /** @var list<Message> */
        return $this->em->createQueryBuilder()
            ->select('m')->from(Message::class, 'm')
            ->where('m.demandeId = :demande')
            ->orderBy('m.creeLe', 'ASC')->addOrderBy('m.id', 'ASC')
            ->setParameter('demande', $demandeId)
            ->getQuery()->getResult();
    }

    public function mailDejaRecu(string $idMail): bool
    {
        return (int) $this->em->createQueryBuilder()
            ->select('COUNT(m.id)')->from(Message::class, 'm')
            ->where('m.idMail = :id')
            ->setParameter('id', $idMail)
            ->getQuery()->getSingleScalarResult() > 0;
    }

    public function enregistrer(Message $message): void
    {
        $this->em->persist($message);
        $this->em->flush();
    }
}
