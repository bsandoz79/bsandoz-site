<?php

declare(strict_types=1);

namespace App\Prospect\Application;

use App\Prospect\Domain\AuteurMessage;
use App\Prospect\Domain\BoiteDeReception;
use App\Prospect\Domain\ContactProfessionnel;
use App\Prospect\Domain\Demande;
use App\Prospect\Domain\Demandes;
use App\Prospect\Domain\DonneesInvalides;
use App\Prospect\Domain\Horloge;
use App\Prospect\Domain\Identifiants;
use App\Prospect\Domain\MailRecu;
use App\Prospect\Domain\Message;
use App\Prospect\Domain\Messages;
use App\Prospect\Domain\NotificationsProspect;
use App\Prospect\Domain\OrigineMessage;
use App\Prospect\Domain\ReferencesFil;
use App\Prospect\Domain\TexteDeReponse;

/**
 * Cas d'usage : relever la boîte des réponses et rattacher chaque réponse au fil de sa demande.
 *
 * Un mail n'entre dans le fil que si sa référence est valide ET si son expéditeur est le client de cette demande
 * ou le professionnel. Un mail qui n'est pas une réponse reste non lu, pour qu'un humain le voie.
 */
final class ReleverLesReponses
{
    private const MAXIMUM_PAR_RELEVE = 50;

    public function __construct(
        private readonly BoiteDeReception $boite,
        private readonly Demandes $demandes,
        private readonly Messages $messages,
        private readonly ReferencesFil $references,
        private readonly NotificationsProspect $notifications,
        private readonly ContactProfessionnel $professionnel,
        private readonly Horloge $horloge,
        private readonly Identifiants $identifiants,
    ) {
    }

    /**
     * @return array{ajoutes: int, automatiques: int, laisses: int}
     *
     * @throws \RuntimeException boîte injoignable
     */
    public function __invoke(): array
    {
        $bilan = ['ajoutes' => 0, 'automatiques' => 0, 'laisses' => 0];
        foreach ($this->boite->nonLus(self::MAXIMUM_PAR_RELEVE) as $mail) {
            if ($mail->automatique) {
                // Jamais dans le fil : une absence du bureau répondrait sinon à chaque notification.
                $this->boite->marquerLu($mail);
                ++$bilan['automatiques'];
                continue;
            }
            $demande = $this->demandeDe($mail);
            $auteur = $demande === null ? null : $this->auteur($mail, $demande);
            if ($demande === null || $auteur === null) {
                ++$bilan['laisses'];
                continue;
            }
            if ($this->ajouter($mail, $demande, $auteur)) {
                ++$bilan['ajoutes'];
            }
            $this->boite->marquerLu($mail);
        }

        return $bilan;
    }

    private function demandeDe(MailRecu $mail): ?Demande
    {
        $numero = $this->references->numeroDans($mail->sujet);

        return $numero === null ? null : $this->demandes->parNumero($numero);
    }

    private function auteur(MailRecu $mail, Demande $demande): ?AuteurMessage
    {
        if ($demande->demandeur->estLaMemePersonne($mail->expediteur)) {
            return AuteurMessage::Client;
        }

        return mb_strtolower(trim($mail->expediteur)) === mb_strtolower(trim($this->professionnel->email()))
            ? AuteurMessage::Professionnel
            : null;
    }

    private function ajouter(MailRecu $mail, Demande $demande, AuteurMessage $auteur): bool
    {
        if ($this->messages->mailDejaRecu($mail->idMail)) {
            return false;
        }
        try {
            $message = Message::ecrire(
                $this->identifiants->nouvelIdentifiant(),
                $demande,
                $auteur,
                OrigineMessage::Mail,
                TexteDeReponse::nettoyer($mail->texte),
                $this->horloge->maintenant(),
                $mail->idMail,
            );
        } catch (DonneesInvalides) {
            return false; // Réponse vide une fois la citation retirée (une pièce jointe seule, par exemple).
        }
        $this->messages->enregistrer($message);
        $this->notifications->messageAjoute($demande, $message);

        return true;
    }
}
