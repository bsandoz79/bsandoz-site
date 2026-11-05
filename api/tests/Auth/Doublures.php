<?php

declare(strict_types=1);

namespace App\Tests\Auth;

use App\Auth\Domain\Aleatoire;
use App\Auth\Domain\Compte;
use App\Auth\Domain\Comptes;
use App\Auth\Domain\HacheurMotDePasse;
use App\Auth\Domain\Horloge;
use App\Auth\Domain\Lien;
use App\Auth\Domain\Liens;
use App\Auth\Domain\NotificationsCompte;
use App\Auth\Domain\Session;
use App\Auth\Domain\Sessions;
use App\Auth\Domain\UsageLien;

/** Doublures des ports du module Auth, pour tester sans base ni mails. */
final class ComptesEnMemoire implements Comptes
{
    /** @var array<string, Compte> */
    public array $tous = [];

    public function parId(string $id): ?Compte
    {
        return $this->tous[$id] ?? null;
    }

    public function parEmail(string $email): ?Compte
    {
        foreach ($this->tous as $compte) {
            if ($compte->email === $email) {
                return $compte;
            }
        }

        return null;
    }

    public function enregistrer(Compte $compte): void
    {
        $this->tous[$compte->id] = $compte;
    }
}

final class LiensEnMemoire implements Liens
{
    /** @var array<string, Lien> */
    public array $tous = [];

    public function parEmpreinte(string $empreinte): ?Lien
    {
        foreach ($this->tous as $lien) {
            if ($lien->empreinte === $empreinte) {
                return $lien;
            }
        }

        return null;
    }

    public function valides(string $compteId, UsageLien $usage, \DateTimeImmutable $maintenant): array
    {
        return array_values(array_filter(
            $this->tous,
            static fn (Lien $l) => $l->compteId === $compteId && $l->usage === $usage && $l->estValide($maintenant),
        ));
    }

    public function enregistrer(Lien $lien): void
    {
        $this->tous[$lien->id] = $lien;
    }
}

final class SessionsEnMemoire implements Sessions
{
    /** @var array<string, Session> */
    public array $toutes = [];

    public function parEmpreinte(string $empreinte): ?Session
    {
        foreach ($this->toutes as $session) {
            if ($session->empreinte === $empreinte) {
                return $session;
            }
        }

        return null;
    }

    public function actives(string $compteId, \DateTimeImmutable $maintenant): array
    {
        return array_values(array_filter(
            $this->toutes,
            static fn (Session $s) => $s->compteId === $compteId && $s->estActive($maintenant),
        ));
    }

    public function enregistrer(Session $session): void
    {
        $this->toutes[$session->id] = $session;
    }
}

/** Horloge réglable : `avancer('PT2H')`. */
final class HorlogeReglable implements Horloge
{
    public function __construct(public \DateTimeImmutable $maintenant)
    {
    }

    public function maintenant(): \DateTimeImmutable
    {
        return $this->maintenant;
    }

    public function avancer(string $duree): void
    {
        $this->maintenant = $this->maintenant->add(new \DateInterval($duree));
    }
}

final class AleatoirePrevisible implements Aleatoire
{
    private int $id = 0;
    private int $secret = 0;

    public function identifiant(): string
    {
        return 'id-' . ++$this->id;
    }

    public function secret(): string
    {
        return str_pad(dechex(++$this->secret), 64, '0', STR_PAD_LEFT);
    }
}

/** Hachage réversible pour les tests uniquement. */
final class HacheurDeTest implements HacheurMotDePasse
{
    public int $verifications = 0;

    public function hacher(string $motDePasse): string
    {
        return 'hache:' . $motDePasse;
    }

    public function verifier(string $hache, string $motDePasse): bool
    {
        ++$this->verifications;

        return $hache === 'hache:' . $motDePasse;
    }
}

final class MailsEnregistres implements NotificationsCompte
{
    /** @var list<array{type: string, email: string, secret: ?string}> */
    public array $envoyes = [];

    public function lien(Compte $compte, UsageLien $usage, string $secret): void
    {
        $this->envoyes[] = ['type' => $usage->value, 'email' => $compte->email, 'secret' => $secret];
    }

    public function motDePasseModifie(Compte $compte): void
    {
        $this->envoyes[] = ['type' => 'mot_de_passe_modifie', 'email' => $compte->email, 'secret' => null];
    }

    /** Secret du dernier lien envoyé pour cet usage. */
    public function dernierSecret(UsageLien $usage): string
    {
        foreach (array_reverse($this->envoyes) as $mail) {
            if ($mail['type'] === $usage->value) {
                return (string) $mail['secret'];
            }
        }
        throw new \LogicException("Aucun lien {$usage->value} envoyé.");
    }
}
