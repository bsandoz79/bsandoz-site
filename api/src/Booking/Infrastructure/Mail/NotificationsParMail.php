<?php

declare(strict_types=1);

namespace App\Booking\Infrastructure\Mail;

use App\Booking\Domain\Lieu;
use App\Booking\Domain\Notifications;
use App\Booking\Domain\RegleDisponibilite;
use App\Booking\Domain\RendezVous;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\Mime\Email;

/**
 * Adaptateur du port Notifications : e-mails à la personne (avec .ics et lien pour annuler)
 * et au professionnel. Tous les réglages viennent de config/packages/booking.yaml.
 */
final class NotificationsParMail implements Notifications
{
    public function __construct(
        private readonly MailerInterface $mailer,
        private readonly RegleDisponibilite $regle,
        #[Autowire('%booking.expediteur%')]
        private readonly string $expediteur,
        #[Autowire('%booking.professionnel_nom%')]
        private readonly string $professionnelNom,
        #[Autowire('%booking.professionnel_email%')]
        private readonly string $professionnelEmail,
        #[Autowire('%booking.url_publique%')]
        private readonly string $urlPublique,
    ) {
    }

    public function rendezVousConfirme(RendezVous $rendezVous): void
    {
        $quand = $this->quand($rendezVous);
        $ou = $this->ou($rendezVous);
        $lien = rtrim($this->urlPublique, '/') . "/rendez-vous/{$rendezVous->jeton}";

        $this->mailer->send($this->email($rendezVous->contact->email, "Votre rendez-vous du {$quand} est confirmé")
            ->text(
                "Bonjour {$rendezVous->contact->nom},\n\n"
                . "Votre rendez-vous découverte est confirmé :\n"
                . "- Quand : {$quand}\n- Où : {$ou}\n- Durée : {$this->regle->dureeMinutes} minutes, gratuit et sans engagement.\n\n"
                . "Pour l'ajouter à votre agenda, ouvrez le fichier joint.\n"
                . "Pour le déplacer ou l'annuler : {$lien}\n\n"
                . "À bientôt,\n{$this->professionnelNom}"
            )
            ->attach($this->ics($rendezVous), 'rendez-vous.ics', 'text/calendar; charset=utf-8; method=REQUEST'));

        $this->mailer->send($this->email($this->professionnelEmail, "Nouveau rendez-vous : {$rendezVous->contact->nom}, {$quand}")
            ->replyTo($rendezVous->contact->email)
            ->text(
                "Nouveau rendez-vous découverte\n\n"
                . "Quand : {$quand}\nOù : {$ou}\n"
                . "Nom : {$rendezVous->contact->nom}\nE-mail : {$rendezVous->contact->email}\nTéléphone : {$rendezVous->contact->telephone}\n"
                . "Activité : {$rendezVous->activite}\n\nMessage :\n{$rendezVous->message}\n"
            )
            ->attach($this->ics($rendezVous), 'rendez-vous.ics', 'text/calendar; charset=utf-8; method=REQUEST'));
    }

    public function rendezVousAnnule(RendezVous $rendezVous): void
    {
        $quand = $this->quand($rendezVous);
        $annulation = $this->ics($rendezVous, true);

        $this->mailer->send($this->email($rendezVous->contact->email, "Votre rendez-vous du {$quand} est annulé")
            ->text("Bonjour {$rendezVous->contact->nom},\n\nVotre rendez-vous du {$quand} est bien annulé.\nVous pouvez en reprendre un quand vous voulez.\n\n{$this->professionnelNom}")
            ->attach($annulation, 'annulation.ics', 'text/calendar; charset=utf-8; method=CANCEL'));

        $this->mailer->send($this->email($this->professionnelEmail, "Rendez-vous annulé : {$rendezVous->contact->nom}, {$quand}")
            ->text("Le rendez-vous de {$rendezVous->contact->nom} ({$rendezVous->contact->email}) du {$quand} a été annulé. Le créneau est de nouveau libre.")
            ->attach($annulation, 'annulation.ics', 'text/calendar; charset=utf-8; method=CANCEL'));
    }

    public function rappel(RendezVous $rendezVous): void
    {
        $quand = $this->quand($rendezVous);
        $lien = rtrim($this->urlPublique, '/') . "/rendez-vous/{$rendezVous->jeton}";

        $this->mailer->send($this->email($rendezVous->contact->email, "Rappel : votre rendez-vous de demain, {$rendezVous->creneau->heure}")
            ->text(
                "Bonjour {$rendezVous->contact->nom},\n\n"
                . "Un petit rappel pour notre rendez-vous :\n"
                . "- Quand : {$quand}\n- Où : {$this->ou($rendezVous)}\n\n"
                . "Un empêchement ? Vous pouvez l'annuler ici : {$lien}\n\n"
                . "À demain,\n{$this->professionnelNom}"
            ));
    }

    private function email(string $a, string $sujet): Email
    {
        return (new Email())->from(new Address($this->expediteur, $this->professionnelNom))->to($a)->subject($sujet);
    }

    /** « mardi 17 novembre 2026 à 14:00 ». */
    private function quand(RendezVous $rendezVous): string
    {
        // Sans l'extension intl, on garde la date au format AAAA-MM-JJ.
        $date = class_exists(\IntlDateFormatter::class)
            ? \IntlDateFormatter::create('fr_FR', \IntlDateFormatter::FULL, \IntlDateFormatter::NONE, $this->regle->fuseau, null, 'EEEE d MMMM y')
            : null;
        $jour = $date ? (string) $date->format($rendezVous->creneau->debut($this->regle->fuseau)) : $rendezVous->creneau->jour;

        return "{$jour} à {$rendezVous->creneau->heure}";
    }

    private function ou(RendezVous $rendezVous): string
    {
        return $rendezVous->lieu === Lieu::ChezLeClient
            ? "chez vous, {$rendezVous->adresse}"
            : mb_strtolower($rendezVous->lieu->libelle());
    }

    private function ics(RendezVous $rendezVous, bool $annulation = false): string
    {
        return FichierIcs::pour(
            $rendezVous,
            $this->regle->dureeMinutes,
            $this->regle->fuseau,
            "Rendez-vous découverte – {$this->professionnelNom}",
            $this->professionnelEmail,
            (string) (parse_url($this->urlPublique, PHP_URL_HOST) ?: 'localhost'),
            $annulation,
        );
    }
}
