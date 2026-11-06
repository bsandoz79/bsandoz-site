<?php

declare(strict_types=1);

namespace App\Auth\Domain;

/**
 * Session ouverte sur un appareil. Expire après 30 jours sans activité ; peut être fermée à distance
 * (« Déconnecter les autres appareils »).
 */
class Session
{
    public const DUREE_INACTIVITE = 'P30D';

    private function __construct(
        public readonly string $id,
        public readonly string $compteId,
        public readonly string $empreinte,
        public readonly string $appareil,
        public readonly \DateTimeImmutable $creeLe,
        private \DateTimeImmutable $derniereActivite,
        private ?\DateTimeImmutable $fermeeLe,
    ) {
    }

    public static function ouvrir(string $id, string $compteId, string $secret, string $appareil, \DateTimeImmutable $maintenant): self
    {
        return new self($id, $compteId, Secret::empreinte($secret), mb_substr(trim($appareil), 0, 120), $maintenant, $maintenant, null);
    }

    public function derniereActivite(): \DateTimeImmutable
    {
        return $this->derniereActivite;
    }

    public function expireLe(): \DateTimeImmutable
    {
        return $this->derniereActivite->add(new \DateInterval(self::DUREE_INACTIVITE));
    }

    public function estActive(\DateTimeImmutable $maintenant): bool
    {
        return $this->fermeeLe === null && $maintenant < $this->expireLe();
    }

    /**
     * Note l'activité, au plus une fois par heure pour ne pas écrire en base à chaque requête.
     * Renvoie vrai si la session a changé et doit être enregistrée.
     */
    public function noterActivite(\DateTimeImmutable $maintenant): bool
    {
        if ($maintenant < $this->derniereActivite->add(new \DateInterval('PT1H'))) {
            return false;
        }
        $this->derniereActivite = $maintenant;

        return true;
    }

    public function fermer(\DateTimeImmutable $maintenant): void
    {
        $this->fermeeLe ??= $maintenant;
    }
}
