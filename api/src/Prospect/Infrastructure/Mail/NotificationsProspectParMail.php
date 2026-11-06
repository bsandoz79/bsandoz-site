<?php

declare(strict_types=1);

namespace App\Prospect\Infrastructure\Mail;

use App\Prospect\Domain\Demande;
use App\Prospect\Domain\AuteurMessage;
use App\Prospect\Domain\Devis;
use App\Prospect\Domain\Message;
use App\Prospect\Domain\NotificationsProspect;
use App\Prospect\Domain\ReferencesFil;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\Mime\Email;

/** Adaptateur du port NotificationsProspect : mails au demandeur et au professionnel. */
final class NotificationsProspectParMail implements NotificationsProspect
{
    public const CHEMIN_ESPACE = '/mon-espace';

    public function __construct(
        private readonly MailerInterface $mailer,
        #[Autowire('%prospect.expediteur%')]
        private readonly string $expediteur,
        #[Autowire('%prospect.professionnel_nom%')]
        private readonly string $professionnelNom,
        #[Autowire('%prospect.professionnel_email%')]
        private readonly string $professionnelEmail,
        #[Autowire('%prospect.url_site%')]
        private readonly string $urlSite,
        private readonly ReferencesFil $references,
        /** Boîte relevée en IMAP. Vide : les réponses vont directement à l'autre personne, hors du fil. */
        #[Autowire('%prospect.boite_reponses%')]
        private readonly string $boiteReponses = '',
    ) {
    }

    public function demandeRecue(Demande $demande, array $photos): void
    {
        $d = $demande->demandeur;
        $estimation = $demande->predevis !== ''
            ? "Voici une première estimation, calculée d'après vos réponses. Je vous réponds sous 24 h pour la confirmer ou l'ajuster.\n\n{$demande->predevis}\n\n"
            : "Je vous réponds sous 24 h avec une première estimation.\n\n";

        $this->mailer->send($this->duFil($demande, $d->email, $demande->predevis !== ''
            ? "Votre demande n° {$demande->numero} et une première estimation"
            : "Votre demande n° {$demande->numero} est bien reçue", $this->professionnelEmail)
            ->text("Bonjour {$d->nom},\n\nMerci pour votre demande, je l'ai bien reçue (n° {$demande->numero}). {$estimation}"
                . "Pour rappel, voici ce que vous m'avez indiqué :\n\n{$demande->recapitulatif}\n\n"
                . "Vous pouvez suivre votre demande dans votre espace client : {$this->lienEspace()}\n"
                . "Pour ajouter une précision, répondez simplement à cet e-mail.\n\n{$this->professionnelNom}"));

        $pourPro = $this->duFil($demande, $this->professionnelEmail, "Demande de devis n° {$demande->numero} : {$d->nom}", $d->email)
            ->text("Nouvelle demande de devis n° {$demande->numero}\n\n{$demande->recapitulatif}"
                . ($photos !== [] ? "\n\nPhotos jointes : " . count($photos) : '')
                . ($demande->predevis !== '' ? "\n\nPré-devis envoyé au client :\n\n{$demande->predevis}" : ''));
        foreach ($photos as $photo) {
            $pourPro->attach($photo->contenu, $photo->nom, $photo->type);
        }
        $this->mailer->send($pourPro);
    }

    public function devisEnvoye(Demande $demande, Devis $devis): void
    {
        $this->mailer->send($this->duFil($demande, $demande->demandeur->email, "Votre devis n° {$devis->numero} est prêt", $this->professionnelEmail)
            ->text("Bonjour {$demande->demandeur->nom},\n\nLe devis de votre demande « {$demande->titre} » est prêt : "
                . self::euros($devis->total) . ".\n\nRetrouvez-le dans votre espace client, où vous pouvez l'accepter et le télécharger en PDF : {$this->lienEspace()}\n\n"
                . "Une question ? Répondez simplement à cet e-mail.\n\n{$this->professionnelNom}"));
    }

    public function devisAccepte(Demande $demande, Devis $devis): void
    {
        $d = $demande->demandeur;
        $this->mailer->send($this->duFil($demande, $this->professionnelEmail, "Devis n° {$devis->numero} accepté : {$d->nom}", $d->email)
            ->text("{$d->nom} ({$d->email}) a accepté le devis n° {$devis->numero} (" . self::euros($devis->total) . ") pour « {$demande->titre} »."));
        $this->mailer->send($this->duFil($demande, $d->email, "Devis n° {$devis->numero} accepté", $this->professionnelEmail)
            ->text("Bonjour {$d->nom},\n\nMerci, votre acceptation du devis n° {$devis->numero} (" . self::euros($devis->total) . ") est bien enregistrée. "
                . "Je reviens vers vous très vite pour la suite.\n\n{$this->professionnelNom}"));
    }

    public function messageAjoute(Demande $demande, Message $message): void
    {
        $d = $demande->demandeur;
        if ($message->auteur === AuteurMessage::Client) {
            $this->mailer->send($this->duFil($demande, $this->professionnelEmail, "Message de {$d->nom} : demande n° {$demande->numero}", $d->email)
                ->text("{$d->nom} ({$d->email}) a écrit à propos de « {$demande->titre} » :\n\n{$message->corps}"));

            return;
        }
        $this->mailer->send($this->duFil($demande, $d->email, "Nouveau message : demande n° {$demande->numero}", $this->professionnelEmail)
            ->text("Bonjour {$d->nom},\n\n{$message->corps}\n\nRépondez simplement à cet e-mail, ou retrouvez tous nos échanges dans votre espace client : {$this->lienEspace()}\n\n{$this->professionnelNom}"));
    }

    /** « 1 389 € ». */
    public static function euros(int $montant): string
    {
        return number_format($montant, 0, ',', "\u{202F}") . "\u{00A0}€";
    }

    private function lienEspace(): string
    {
        return rtrim($this->urlSite, '/') . self::CHEMIN_ESPACE;
    }

    /** Mail rattaché au fil : si la boîte des réponses est réglée, la réponse y arrive, avec la référence dans l'objet. */
    private function duFil(Demande $demande, string $a, string $sujet, string $repondreASinon): Email
    {
        if ($this->boiteReponses === '') {
            return $this->email($a, $sujet)->replyTo($repondreASinon);
        }

        return $this->email($a, "{$sujet} {$this->references->pour($demande)}")->replyTo($this->boiteReponses);
    }

    private function email(string $a, string $sujet): Email
    {
        return (new Email())->from(new Address($this->expediteur, $this->professionnelNom))->to($a)->subject($sujet);
    }
}
