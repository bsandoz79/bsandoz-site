<?php

declare(strict_types=1);

namespace App\Auth\Infrastructure\Mail;

use App\Auth\Domain\Compte;
use App\Auth\Domain\NotificationsCompte;
use App\Auth\Domain\UsageLien;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\Mime\Email;

/**
 * Adaptateur du port NotificationsCompte. Les liens mènent au site (pas à l'API) :
 * la page du site confirme ensuite par une requête POST, si bien qu'un logiciel
 * qui « visite » les liens des mails (antivirus, aperçu) ne consomme rien.
 */
final class NotificationsCompteParMail implements NotificationsCompte
{
    public const CHEMIN_LIEN = '/mon-espace/lien';
    public const CHEMIN_MOT_DE_PASSE = '/mon-espace/mot-de-passe';

    public function __construct(
        private readonly MailerInterface $mailer,
        #[Autowire('%auth.expediteur%')]
        private readonly string $expediteur,
        #[Autowire('%auth.expediteur_nom%')]
        private readonly string $expediteurNom,
        #[Autowire('%auth.url_site%')]
        private readonly string $urlSite,
    ) {
    }

    public function lien(Compte $compte, UsageLien $usage, string $secret): void
    {
        $chemin = $usage === UsageLien::MotDePasse ? self::CHEMIN_MOT_DE_PASSE : self::CHEMIN_LIEN;
        $url = rtrim($this->urlSite, '/') . $chemin . '?jeton=' . $secret;
        $bonjour = $compte->nom() !== '' ? "Bonjour {$compte->nom()}," : 'Bonjour,';

        [$sujet, $texte] = match ($usage) {
            UsageLien::Activation => [
                'Votre espace client est prêt',
                "Votre espace client a été créé avec votre demande. Vous pourrez y suivre vos demandes, vos devis et vos rendez-vous.\n\n"
                . "Pour l'activer, ouvrez ce lien (valable 7 jours) :\n{$url}\n\n"
                . "Vous pourrez ensuite choisir un mot de passe, ou continuer à vous connecter par un lien reçu par mail.",
            ],
            UsageLien::Connexion => [
                'Votre lien de connexion',
                "Pour vous connecter à votre espace client, ouvrez ce lien (valable 15 minutes, une seule fois) :\n{$url}",
            ],
            UsageLien::MotDePasse => [
                'Choisir un nouveau mot de passe',
                "Pour choisir un nouveau mot de passe, ouvrez ce lien (valable 1 heure, une seule fois) :\n{$url}\n\n"
                . 'Une fois le mot de passe changé, vos appareils connectés seront déconnectés.',
            ],
        };

        $this->envoyer($compte, $sujet, "{$bonjour}\n\n{$texte}\n\n"
            . "Si vous n'êtes pas à l'origine de cette demande, ignorez ce message : rien ne sera modifié.\n\n"
            . $this->expediteurNom);
    }

    public function motDePasseModifie(Compte $compte): void
    {
        $bonjour = $compte->nom() !== '' ? "Bonjour {$compte->nom()}," : 'Bonjour,';
        $this->envoyer($compte, 'Votre mot de passe a été modifié', "{$bonjour}\n\n"
            . "Le mot de passe de votre espace client vient d'être modifié, et vos appareils ont été déconnectés.\n\n"
            . "Si vous n'êtes pas à l'origine de ce changement, répondez vite à ce message.\n\n"
            . $this->expediteurNom);
    }

    private function envoyer(Compte $compte, string $sujet, string $texte): void
    {
        $this->mailer->send((new Email())
            ->from(new Address($this->expediteur, $this->expediteurNom))
            ->to($compte->email)
            ->subject($sujet)
            ->text($texte));
    }
}
