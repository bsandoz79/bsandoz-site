<?php

declare(strict_types=1);

namespace App\Auth\Domain;

/** Compte d'un client. Il naît « en attente » et devient actif quand la personne prouve qu'elle reçoit ses mails. */
final class Compte
{
    private function __construct(
        public readonly string $id,
        private string $email,
        private string $nom,
        private ?string $motDePasseHache,
        private StatutCompte $statut,
        public readonly \DateTimeImmutable $creeLe,
        private ?\DateTimeImmutable $activeLe,
        private ?\DateTimeImmutable $motDePasseModifieLe,
        private string $entreprise = '',
        private string $telephone = '',
        private string $adresse = '',
        private bool $notificationsParMail = true,
    ) {
    }

    public static function ouvrir(string $id, string $email, string $nom, \DateTimeImmutable $maintenant): self
    {
        $nom = trim($nom);
        if (mb_strlen($nom) > 120) {
            throw new DonneesInvalides(['nom' => 'Nom trop long (120 caractères au plus).']);
        }

        return new self($id, Email::normaliser($email), $nom, null, StatutCompte::EnAttente, $maintenant, null, null);
    }

    public function email(): string
    {
        return $this->email;
    }

    public function nom(): string
    {
        return $this->nom;
    }

    public function entreprise(): string
    {
        return $this->entreprise;
    }

    public function telephone(): string
    {
        return $this->telephone;
    }

    public function adresse(): string
    {
        return $this->adresse;
    }

    public function notificationsParMail(): bool
    {
        return $this->notificationsParMail;
    }

    public function statut(): StatutCompte
    {
        return $this->statut;
    }

    public function estActif(): bool
    {
        return $this->statut === StatutCompte::Actif;
    }

    public function activeLe(): ?\DateTimeImmutable
    {
        return $this->activeLe;
    }

    public function aUnMotDePasse(): bool
    {
        return $this->motDePasseHache !== null;
    }

    public function motDePasseHache(): ?string
    {
        return $this->motDePasseHache;
    }

    public function motDePasseModifieLe(): ?\DateTimeImmutable
    {
        return $this->motDePasseModifieLe;
    }

    /** Active le compte ; sans effet s'il l'est déjà. Renvoie vrai si l'état a changé. */
    public function activer(\DateTimeImmutable $maintenant): bool
    {
        if ($this->estActif()) {
            return false;
        }
        $this->statut = StatutCompte::Actif;
        $this->activeLe = $maintenant;

        return true;
    }

    /** Enregistre un nouveau mot de passe (déjà haché). Le lien reçu par mail prouve l'adresse : le compte devient actif. */
    public function definirMotDePasse(string $hache, \DateTimeImmutable $maintenant): void
    {
        $this->motDePasseHache = $hache;
        $this->motDePasseModifieLe = $maintenant;
        $this->activer($maintenant);
    }

    /** Coordonnées de « Mon compte ». Tous les champs sont facultatifs sauf le nom. */
    public function modifierProfil(string $nom, string $entreprise, string $telephone, string $adresse, bool $notificationsParMail): void
    {
        $nom = trim($nom);
        $entreprise = trim($entreprise);
        $telephone = trim($telephone);
        $adresse = trim($adresse);
        $erreurs = [];
        if ($nom === '' || mb_strlen($nom) > 120) {
            $erreurs['nom'] = 'Nom obligatoire (120 caractères au plus).';
        }
        if (mb_strlen($entreprise) > 120) {
            $erreurs['entreprise'] = 'Nom d’entreprise trop long (120 caractères au plus).';
        }
        if ($telephone !== '' && !preg_match('/^\+?[\d\s.-]{10,20}$/', $telephone)) {
            $erreurs['telephone'] = 'Numéro de téléphone invalide.';
        }
        if (mb_strlen($adresse) > 300) {
            $erreurs['adresse'] = 'Adresse trop longue (300 caractères au plus).';
        }
        if ($erreurs !== []) {
            throw new DonneesInvalides($erreurs);
        }
        $this->nom = $nom;
        $this->entreprise = $entreprise;
        $this->telephone = $telephone;
        $this->adresse = $adresse;
        $this->notificationsParMail = $notificationsParMail;
    }

    /** Nouvelle adresse, déjà confirmée par le lien reçu à cette adresse. */
    public function changerEmail(string $email): void
    {
        $this->email = Email::normaliser($email);
    }
}
