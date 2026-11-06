<?php

declare(strict_types=1);

namespace App\Prospect\Application;

use App\Prospect\Domain\AuteurMessage;
use App\Prospect\Domain\Demande;
use App\Prospect\Domain\DemandeIntrouvable;
use App\Prospect\Domain\Demandes;
use App\Prospect\Domain\Horloge;
use App\Prospect\Domain\Identifiants;
use App\Prospect\Domain\Message;
use App\Prospect\Domain\Messages;
use App\Prospect\Domain\NotificationsProspect;
use App\Prospect\Domain\OrigineMessage;

/** Cas d'usage : ajouter un message au fil d'une demande, et prévenir l'autre personne par mail. */
final class EcrireMessage
{
    public function __construct(
        private readonly Demandes $demandes,
        private readonly Messages $messages,
        private readonly NotificationsProspect $notifications,
        private readonly Horloge $horloge,
        private readonly Identifiants $identifiants,
    ) {
    }

    /**
     * Message du client, depuis son espace. Une demande d'une autre adresse est traitée comme inexistante.
     *
     * @throws DemandeIntrouvable
     */
    public function parClient(string $demandeId, string $email, string $corps): Message
    {
        $demande = $this->demandes->parId($demandeId);
        if ($demande === null || !$demande->demandeur->estLaMemePersonne($email)) {
            throw new DemandeIntrouvable('Demande inconnue.');
        }

        return $this->ajouter($demande, AuteurMessage::Client, OrigineMessage::Site, $corps);
    }

    /** @throws DemandeIntrouvable */
    public function parProfessionnel(string $demandeId, string $corps): Message
    {
        return $this->ajouter($this->demande($demandeId), AuteurMessage::Professionnel, OrigineMessage::Site, $corps);
    }

    /**
     * Note d'appel : le client la voit dans son espace, sans recevoir de mail.
     *
     * @throws DemandeIntrouvable
     */
    public function noteDAppel(string $demandeId, string $corps): Message
    {
        return $this->ajouter($this->demande($demandeId), AuteurMessage::Professionnel, OrigineMessage::Note, $corps);
    }

    private function demande(string $id): Demande
    {
        return $this->demandes->parId($id) ?? throw new DemandeIntrouvable('Demande inconnue.');
    }

    private function ajouter(Demande $demande, AuteurMessage $auteur, OrigineMessage $origine, string $corps): Message
    {
        $message = Message::ecrire($this->identifiants->nouvelIdentifiant(), $demande, $auteur, $origine, $corps, $this->horloge->maintenant());
        $this->messages->enregistrer($message);
        if ($origine !== OrigineMessage::Note) {
            $this->notifications->messageAjoute($demande, $message);
        }

        return $message;
    }
}
