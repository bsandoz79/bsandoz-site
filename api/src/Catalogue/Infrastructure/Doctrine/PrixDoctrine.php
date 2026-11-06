<?php

declare(strict_types=1);

namespace App\Catalogue\Infrastructure\Doctrine;

use App\Catalogue\Domain\PrixEnregistres;
use App\Catalogue\Domain\PrixPersonnalise;
use Doctrine\ORM\EntityManagerInterface;

/** Adaptateur Doctrine du port PrixEnregistres (table catalogue_prix). */
final class PrixDoctrine implements PrixEnregistres
{
    public function __construct(private readonly EntityManagerInterface $em)
    {
    }

    public function tous(): array
    {
        $prix = [];
        foreach ($this->em->getRepository(PrixPersonnalise::class)->findAll() as $p) {
            $prix[$p->cle] = $p->montant;
        }

        return $prix;
    }

    public function remplacer(array $prix): void
    {
        $this->em->wrapInTransaction(function () use ($prix): void {
            foreach ($this->em->getRepository(PrixPersonnalise::class)->findAll() as $ancien) {
                $this->em->remove($ancien);
            }
            $this->em->flush();
            foreach ($prix as $p) {
                $this->em->persist($p);
            }
        });
    }
}
