<?php

declare(strict_types=1);

namespace App\Auth\Domain;

/** Compte d'un client. Il naît « en attente » et devient actif quand la personne prouve qu'elle reçoit ses mails. */
final class Compte
{
    private function __construct(
        public readonly string $id,
        public readonly string $email,
        private string $nom,
        private ?string $motDePasseHache,
        private StatutCompte $statut,
        public readonly \DateTimeImmutable $creeLe,
        private ?\DateTimeImmutable $activeLe,
        private ?\DateTimeImmutable $motDePasseModifieLe,
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

    public function nom(): string
    {
        return $this->nom;
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
}
