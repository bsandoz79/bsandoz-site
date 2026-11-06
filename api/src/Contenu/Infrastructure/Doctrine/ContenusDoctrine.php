<?php

declare(strict_types=1);

namespace App\Contenu\Infrastructure\Doctrine;

use App\Contenu\Domain\ContenuPersonnalise;
use App\Contenu\Domain\ContenusEnregistres;
use Doctrine\ORM\EntityManagerInterface;

/** Adaptateur Doctrine du port ContenusEnregistres (table contenu_personnalise). */
final class ContenusDoctrine implements ContenusEnregistres
{
    public function __construct(private readonly EntityManagerInterface $em)
    {
    }

    public function tous(): array
    {
        $contenus = [];
        foreach ($this->em->getRepository(ContenuPersonnalise::class)->findAll() as $c) {
            $contenus[$c->cle] = $c->valeur();
        }

        return $contenus;
    }

    public function appliquer(array $changements): void
    {
        $this->em->wrapInTransaction(function () use ($changements): void {
            foreach ($changements as $cle => $valeur) {
                $existant = $this->em->find(ContenuPersonnalise::class, $cle);
                if ($valeur === null) {
                    if ($existant !== null) {
                        $this->em->remove($existant);
                    }
                } elseif ($existant !== null) {
                    $existant->changer($valeur);
                } else {
                    $this->em->persist(ContenuPersonnalise::depuis($cle, $valeur));
                }
            }
        });
    }
}
