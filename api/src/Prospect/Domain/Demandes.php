<?php

declare(strict_types=1);

namespace App\Prospect\Domain;

/** Port : stockage des demandes. */
interface Demandes
{
    public function parId(string $id): ?Demande;

    public function parNumero(string $numero): ?Demande;

    /** @return list<Demande> demandes d'une adresse e-mail, la plus récente d'abord */
    public function parEmail(string $email): array;

    /** Nombre de demandes déjà reçues cette année (pour numéroter la suivante). */
    public function nombreRecuesEn(int $annee): int;

    public function enregistrer(Demande $demande): void;

    /** Efface la demande, son devis et son fil de messages (droit à l'effacement). */
    public function supprimer(Demande $demande): void;
}
