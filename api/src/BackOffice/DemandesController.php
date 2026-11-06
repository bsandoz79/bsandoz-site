<?php

declare(strict_types=1);

namespace App\BackOffice;

use App\Prospect\Application\ChangerStatut;
use App\Prospect\Application\EcrireMessage;
use App\Prospect\Application\EtablirDevis;
use App\Prospect\Domain\ActionImpossible;
use App\Prospect\Domain\Demande;
use App\Prospect\Domain\DemandeIntrouvable;
use App\Prospect\Domain\Demandes;
use App\Prospect\Domain\Devis;
use App\Prospect\Domain\DevisEnregistres;
use App\Prospect\Domain\DonneesInvalides;
use App\Prospect\Domain\LigneDevis;
use App\Prospect\Domain\Message;
use App\Prospect\Domain\Messages;
use App\Prospect\Domain\StatutDemande;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

/** Back-office : suivre les demandes, changer leur statut, établir le devis, répondre, noter un appel. */
final class DemandesController
{
    private const LISTE_MAX = 200;

    public function __construct(
        private readonly GardeBackOffice $garde,
        private readonly Demandes $demandes,
        private readonly DevisEnregistres $devis,
        private readonly Messages $messages,
        private readonly ChangerStatut $changerStatut,
        private readonly EtablirDevis $etablirDevis,
        private readonly EcrireMessage $ecrire,
    ) {
    }

    #[Route('/backoffice/demandes', name: 'backoffice_demandes', methods: ['GET'])]
    public function lister(Request $request): JsonResponse
    {
        if ($refus = $this->garde->refus($request)) {
            return $refus;
        }

        return GardeBackOffice::json(['demandes' => array_map(static fn (Demande $d) => [
            'id' => $d->id,
            'numero' => $d->numero,
            'titre' => $d->titre,
            'nom' => $d->demandeur->nom,
            'entreprise' => $d->demandeur->entreprise,
            'envoyeeLe' => $d->creeLe->format(\DATE_ATOM),
            'statut' => $d->statut()->value,
            'statutLibelle' => $d->statut()->libelle(),
        ], $this->demandes->recentes(self::LISTE_MAX))]);
    }

    #[Route('/backoffice/demandes/{id}', name: 'backoffice_demande', methods: ['GET'])]
    public function voir(Request $request, string $id): JsonResponse
    {
        if ($refus = $this->garde->refus($request)) {
            return $refus;
        }
        $demande = $this->demandes->parId($id);

        return $demande === null ? self::introuvable() : GardeBackOffice::json(['demande' => $this->detail($demande)]);
    }

    #[Route('/backoffice/demandes/{id}/statut', name: 'backoffice_demande_statut', methods: ['POST'])]
    public function statut(Request $request, string $id): JsonResponse
    {
        return $this->action($request, $id, function (array $corps) use ($id): void {
            $statut = StatutDemande::tryFrom(is_string($corps['statut'] ?? null) ? $corps['statut'] : '')
                ?? throw new DonneesInvalides(['statut' => 'Statut inconnu.']);
            ($this->changerStatut)($id, $statut);
        });
    }

    #[Route('/backoffice/demandes/{id}/devis', name: 'backoffice_demande_devis', methods: ['POST'])]
    public function devis(Request $request, string $id): JsonResponse
    {
        return $this->action($request, $id, function (array $corps) use ($id): void {
            $lignes = [];
            foreach (is_array($corps['lignes'] ?? null) ? $corps['lignes'] : [] as $ligne) {
                if (!is_array($ligne) || !is_string($ligne['libelle'] ?? null) || !is_int($ligne['prix'] ?? null)) {
                    throw new DonneesInvalides(['lignes' => 'Chaque ligne a un libellé et un prix en euros entiers.']);
                }
                $lignes[] = ['libelle' => $ligne['libelle'], 'prix' => $ligne['prix']];
            }
            ($this->etablirDevis)($id, $lignes);
        });
    }

    #[Route('/backoffice/demandes/{id}/messages', name: 'backoffice_demande_message', methods: ['POST'])]
    public function message(Request $request, string $id): JsonResponse
    {
        return $this->action($request, $id, function (array $corps) use ($id): void {
            $texte = is_string($corps['corps'] ?? null) ? $corps['corps'] : '';
            ($corps['note'] ?? false) === true ? $this->ecrire->noteDAppel($id, $texte) : $this->ecrire->parProfessionnel($id, $texte);
        });
    }

    /** @param callable(array<mixed>): void $faire */
    private function action(Request $request, string $id, callable $faire): JsonResponse
    {
        if ($refus = $this->garde->refus($request)) {
            return $refus;
        }
        $corps = json_decode($request->getContent(), true);
        try {
            $faire(is_array($corps) ? $corps : []);
        } catch (DemandeIntrouvable) {
            return self::introuvable();
        } catch (DonneesInvalides $e) {
            return GardeBackOffice::json(['erreurs' => $e->erreurs], Response::HTTP_BAD_REQUEST);
        } catch (ActionImpossible $e) {
            return GardeBackOffice::json(['erreur' => $e->getMessage()], Response::HTTP_CONFLICT);
        }
        $demande = $this->demandes->parId($id);
        \assert($demande instanceof Demande);

        return GardeBackOffice::json(['demande' => $this->detail($demande)]);
    }

    private static function introuvable(): JsonResponse
    {
        return GardeBackOffice::json(['erreur' => 'Demande inconnue.'], Response::HTTP_NOT_FOUND);
    }

    /** @return array<string, mixed> */
    private function detail(Demande $d): array
    {
        $devis = $this->devis->pourDemande($d->id);

        return [
            'id' => $d->id,
            'numero' => $d->numero,
            'titre' => $d->titre,
            'envoyeeLe' => $d->creeLe->format(\DATE_ATOM),
            'statut' => $d->statut()->value,
            'statuts' => array_map(static fn (StatutDemande $s) => ['statut' => $s->value, 'libelle' => $s->libelle()], StatutDemande::cases()),
            'demandeur' => [
                'nom' => $d->demandeur->nom,
                'email' => $d->demandeur->email,
                'telephone' => $d->demandeur->telephone,
                'entreprise' => $d->demandeur->entreprise,
            ],
            'recapitulatif' => $d->recapitulatif,
            'predevis' => $d->predevis,
            'messages' => array_map(static fn (Message $m) => [
                'id' => $m->id,
                'auteur' => $m->auteur->value,
                'origine' => $m->origine->value,
                'corps' => $m->corps,
                'envoyeLe' => $m->creeLe->format(\DATE_ATOM),
            ], $this->messages->pourDemande($d->id)),
            'devis' => $devis === null ? null : self::devisJson($devis),
        ];
    }

    /** @return array<string, mixed> */
    private static function devisJson(Devis $devis): array
    {
        return [
            'numero' => $devis->numero,
            'lignes' => array_map(static fn (LigneDevis $l) => $l->enTableau(), $devis->lignes()),
            'total' => $devis->total,
            'statut' => $devis->statut()->value,
            'envoyeLe' => $devis->envoyeLe->format(\DATE_ATOM),
            'accepteLe' => $devis->accepteLe()?->format(\DATE_ATOM),
        ];
    }
}
