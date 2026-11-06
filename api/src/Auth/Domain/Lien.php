<?php

declare(strict_types=1);

namespace App\Auth\Domain;

/** Lien à usage unique envoyé par mail (activation, connexion sans mot de passe, changement de mot de passe). */
class Lien
{
    private function __construct(
        public readonly string $id,
        public readonly string $compteId,
        public readonly UsageLien $usage,
        public readonly string $empreinte,
        public readonly \DateTimeImmutable $creeLe,
        public readonly \DateTimeImmutable $expireLe,
        private ?\DateTimeImmutable $utiliseLe,
        /** Donnée attachée au lien : la nouvelle adresse pour un changement d'e-mail. */
        public readonly ?string $nouvelEmail = null,
    ) {
    }

    /** Crée le lien à partir de son secret (qui part par mail et n'est pas conservé). */
    public static function creer(
        string $id,
        string $compteId,
        UsageLien $usage,
        string $secret,
        \DateTimeImmutable $maintenant,
        ?string $nouvelEmail = null,
    ): self {
        if (($usage === UsageLien::ChangementEmail) !== ($nouvelEmail !== null)) {
            throw new \LogicException('Seul un lien de changement d’e-mail porte une nouvelle adresse, et il en porte toujours une.');
        }

        return new self($id, $compteId, $usage, Secret::empreinte($secret), $maintenant, $maintenant->add($usage->dureeDeVie()), null, $nouvelEmail);
    }

    public function utiliseLe(): ?\DateTimeImmutable
    {
        return $this->utiliseLe;
    }

    public function estValide(\DateTimeImmutable $maintenant): bool
    {
        return $this->utiliseLe === null && $maintenant < $this->expireLe;
    }

    /** Consomme le lien : il ne servira plus. */
    public function utiliser(\DateTimeImmutable $maintenant): void
    {
        if (!$this->estValide($maintenant)) {
            throw new LienInvalide('Ce lien a expiré ou a déjà servi.');
        }
        $this->utiliseLe = $maintenant;
    }

    /** Retire le lien sans l'avoir utilisé (un lien plus récent du même usage le remplace). */
    public function annuler(\DateTimeImmutable $maintenant): void
    {
        $this->utiliseLe ??= $maintenant;
    }
}
