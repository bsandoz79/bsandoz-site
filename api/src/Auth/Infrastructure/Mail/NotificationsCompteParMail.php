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
    /** Page du site qui ouvre chaque sorte de lien. */
    public const CHEMINS = [
        'activation' => '/mon-espace/lien',
        'connexion' => '/mon-espace/lien',
        'mot_de_passe' => '/mon-espace/mot-de-passe',
        'changement_email' => '/mon-espace/email',
        'suppression' => '/mon-espace/suppression',
    ];

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

    public function lien(Compte $compte, UsageLien $usage, string $secret, ?string $destinataire = null): void
    {
        $url = rtrim($this->urlSite, '/') . self::CHEMINS[$usage->value] . '?jeton=' . $secret;

        [$sujet, $texte] = match ($usage) {
            UsageLien::Activation => [
                'Votre espace client est prêt',
                "Votre espace client a été créé avec votre demande. Vous pourrez y suivre vos demandes, vos devis et vos rendez-vous.\n\n"
                . "Pour l'activer, ouvrez ce lien (valable 7 jours) :\n{$url}\n\n"
                . 'Vous pourrez ensuite choisir un mot de passe, ou continuer à vous connecter par un lien reçu par mail.',
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
            UsageLien::ChangementEmail => [
                'Confirmez votre nouvelle adresse e-mail',
                "Vous avez demandé à utiliser cette adresse pour votre espace client.\n\n"
                . "Pour confirmer, ouvrez ce lien (valable 1 heure, une seule fois) :\n{$url}\n\n"
                . "Tant que ce lien n'est pas ouvert, votre ancienne adresse reste celle du compte.",
            ],
            UsageLien::Suppression => [
                'Confirmez la suppression de votre compte',
                "Vous avez demandé la suppression de votre espace client.\n\n"
                . "Pour confirmer, ouvrez ce lien (valable 1 heure) puis validez :\n{$url}\n\n"
                . "Vos informations, rendez-vous et échanges seront effacés définitivement. Les factures sont conservées 10 ans, comme la loi l'impose.",
            ],
        };

        $this->envoyer($destinataire ?? $compte->email(), $sujet, self::bonjour($compte->nom()) . "\n\n{$texte}\n\n"
            . "Si vous n'êtes pas à l'origine de cette demande, ignorez ce message : rien ne sera modifié.\n\n"
            . $this->expediteurNom);
    }

    public function motDePasseModifie(Compte $compte): void
    {
        $this->envoyer($compte->email(), 'Votre mot de passe a été modifié', self::bonjour($compte->nom()) . "\n\n"
            . "Le mot de passe de votre espace client vient d'être modifié, et vos appareils ont été déconnectés.\n\n"
            . "Si vous n'êtes pas à l'origine de ce changement, répondez vite à ce message.\n\n"
            . $this->expediteurNom);
    }

    public function emailModifie(Compte $compte, string $ancienneAdresse): void
    {
        $this->envoyer($ancienneAdresse, 'L’adresse de votre espace client a changé', self::bonjour($compte->nom()) . "\n\n"
            . "Votre espace client utilise désormais l'adresse {$compte->email()}. Les prochains messages iront à cette adresse.\n\n"
            . "Si vous n'êtes pas à l'origine de ce changement, répondez vite à ce message.\n\n"
            . $this->expediteurNom);
    }

    public function compteSupprime(string $email, string $nom): void
    {
        $this->envoyer($email, 'Votre compte a été supprimé', self::bonjour($nom) . "\n\n"
            . "Votre espace client et les informations qui s'y rattachent ont été supprimés. Les factures éventuelles sont conservées 10 ans, comme la loi l'impose.\n\n"
            . "Merci de votre confiance.\n\n"
            . $this->expediteurNom);
    }

    private static function bonjour(string $nom): string
    {
        return $nom !== '' ? "Bonjour {$nom}," : 'Bonjour,';
    }

    private function envoyer(string $a, string $sujet, string $texte): void
    {
        $this->mailer->send((new Email())
            ->from(new Address($this->expediteur, $this->expediteurNom))
            ->to($a)
            ->subject($sujet)
            ->text($texte));
    }
}
