<?php

declare(strict_types=1);

namespace App\Auth\Domain;

/** Port : stockage des sessions. */
interface Sessions
{
    public function parEmpreinte(string $empreinte): ?Session;

    /** @return list<Session> sessions actives d'un compte, la plus récente d'abord */
    public function actives(string $compteId, \DateTimeImmutable $maintenant): array;

    public function enregistrer(Session $session): void;
}
