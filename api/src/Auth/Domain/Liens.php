<?php

declare(strict_types=1);

namespace App\Auth\Domain;

/** Port : stockage des liens envoyés par mail. */
interface Liens
{
    public function parEmpreinte(string $empreinte): ?Lien;

    /** @return list<Lien> liens encore utilisables d'un compte pour un usage */
    public function valides(string $compteId, UsageLien $usage, \DateTimeImmutable $maintenant): array;

    public function enregistrer(Lien $lien): void;
}
