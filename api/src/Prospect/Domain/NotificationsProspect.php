<?php

declare(strict_types=1);

namespace App\Prospect\Domain;

/** Port : e-mails autour des demandes et des devis. */
interface NotificationsProspect
{
    /**
     * Accusé de réception (avec le pré-devis) au demandeur, et la demande au professionnel (avec les photos).
     *
     * @param list<PieceJointe> $photos
     */
    public function demandeRecue(Demande $demande, array $photos): void;

    /** Le devis est prêt : le client le retrouve dans son espace. */
    public function devisEnvoye(Demande $demande, Devis $devis): void;

    /** Le client a accepté : prévenir le professionnel et confirmer au client. */
    public function devisAccepte(Demande $demande, Devis $devis): void;
}
