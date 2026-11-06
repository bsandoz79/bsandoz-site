<?php

declare(strict_types=1);

namespace App\Tests\Prospect;

use App\Prospect\Domain\BoiteDeReception;
use App\Prospect\Domain\ContactProfessionnel;
use App\Prospect\Domain\Demande;
use App\Prospect\Domain\Demandes;
use App\Prospect\Domain\Devis;
use App\Prospect\Domain\DevisEnregistres;
use App\Prospect\Domain\Horloge;
use App\Prospect\Domain\Identifiants;
use App\Prospect\Domain\MailRecu;
use App\Prospect\Domain\Message;
use App\Prospect\Domain\Messages;
use App\Prospect\Domain\NotificationsProspect;
use App\Prospect\Domain\ReferencesFil;

/** Doublures des ports du module Prospect. */
final class DemandesEnMemoire implements Demandes
{
    /** @var array<string, Demande> */
    public array $toutes = [];

    public function parId(string $id): ?Demande
    {
        return $this->toutes[$id] ?? null;
    }

    public function parNumero(string $numero): ?Demande
    {
        foreach ($this->toutes as $demande) {
            if ($demande->numero === $numero) {
                return $demande;
            }
        }

        return null;
    }

    public function parEmail(string $email): array
    {
        $trouvees = array_values(array_filter($this->toutes, static fn (Demande $d) => $d->demandeur->estLaMemePersonne($email)));
        usort($trouvees, static fn (Demande $a, Demande $b) => $b->creeLe <=> $a->creeLe);

        return $trouvees;
    }

    public function nombreRecuesEn(int $annee): int
    {
        return count(array_filter($this->toutes, static fn (Demande $d) => (int) $d->creeLe->format('Y') === $annee));
    }

    public function enregistrer(Demande $demande): void
    {
        $this->toutes[$demande->id] = $demande;
    }

    public function supprimer(Demande $demande): void
    {
        unset($this->toutes[$demande->id]);
    }
}

final class DevisEnMemoire implements DevisEnregistres
{
    /** @var array<string, Devis> */
    public array $tous = [];

    public function pourDemande(string $demandeId): ?Devis
    {
        foreach ($this->tous as $devis) {
            if ($devis->demandeId === $demandeId) {
                return $devis;
            }
        }

        return null;
    }

    public function enregistrer(Devis $devis): void
    {
        $this->tous[$devis->id] = $devis;
    }
}

final class HorlogeProspect implements Horloge
{
    public function __construct(public \DateTimeImmutable $maintenant)
    {
    }

    public function maintenant(): \DateTimeImmutable
    {
        return $this->maintenant;
    }
}

final class IdentifiantsProspect implements Identifiants
{
    private int $n = 0;

    public function nouvelIdentifiant(): string
    {
        return 'p-' . ++$this->n;
    }
}

final class NotificationsProspectEnregistrees implements NotificationsProspect
{
    /** @var list<string> */
    public array $envoyees = [];

    public function demandeRecue(Demande $demande, array $photos): void
    {
        $this->envoyees[] = "recue:{$demande->numero}:" . count($photos);
    }

    public function devisEnvoye(Demande $demande, Devis $devis): void
    {
        $this->envoyees[] = "devis:{$devis->numero}";
    }

    public function devisAccepte(Demande $demande, Devis $devis): void
    {
        $this->envoyees[] = "accepte:{$devis->numero}";
    }

    public function messageAjoute(Demande $demande, Message $message): void
    {
        $this->envoyees[] = "message:{$message->auteur->value}";
    }
}

final class MessagesEnMemoire implements Messages
{
    /** @var list<Message> */
    public array $tous = [];

    public function pourDemande(string $demandeId): array
    {
        return array_values(array_filter($this->tous, static fn (Message $m) => $m->demandeId === $demandeId));
    }

    public function mailDejaRecu(string $idMail): bool
    {
        return array_filter($this->tous, static fn (Message $m) => $m->idMail === $idMail) !== [];
    }

    public function enregistrer(Message $message): void
    {
        $this->tous[] = $message;
    }
}

final class BoiteEnMemoire implements BoiteDeReception
{
    /** @var list<MailRecu> */
    public array $mails = [];
    /** @var list<string> */
    public array $lus = [];

    public function estConfiguree(): bool
    {
        return true;
    }

    public function nonLus(int $maximum): array
    {
        return array_values(array_filter($this->mails, fn (MailRecu $m) => !in_array($m->uid, $this->lus, true)));
    }

    public function marquerLu(MailRecu $mail): void
    {
        $this->lus[] = $mail->uid;
    }
}

final class ReferenceFactice implements ReferencesFil
{
    public function pour(Demande $demande): string
    {
        return "[fil:{$demande->numero}-valide]";
    }

    public function numeroDans(string $sujet): ?string
    {
        return preg_match('/\[fil:(\d{4}-\d+)-valide\]/', $sujet, $t) === 1 ? $t[1] : null;
    }
}

final class ProfessionnelFactice implements ContactProfessionnel
{
    public function email(): string
    {
        return 'pro@exemple.fr';
    }
}
