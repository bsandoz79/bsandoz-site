<?php

declare(strict_types=1);

namespace App\Liaisons;

use App\Auth\Infrastructure\Http\SessionDeLaRequete;
use App\Prospect\Application\AccepterDevis;
use App\Prospect\Domain\ActionImpossible;
use App\Prospect\Domain\Demande;
use App\Prospect\Domain\DemandeIntrouvable;
use App\Prospect\Domain\Demandes;
use App\Prospect\Domain\Devis;
use App\Prospect\Domain\DevisEnregistres;
use App\Prospect\Domain\LigneDevis;
use App\Prospect\Domain\StatutDemande;
use App\Prospect\Infrastructure\Pdf\DevisPdf;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Espace client, « Mes demandes » : liaison propre à bsandoz.fr entre Auth (qui est connecté)
 * et Prospect (ses demandes et devis, retrouvés par son adresse e-mail). Une demande d'une autre adresse répond 404.
 */
final class EspaceDemandesController
{
    public function __construct(
        private readonly SessionDeLaRequete $session,
        private readonly Demandes $demandes,
        private readonly DevisEnregistres $devis,
        private readonly AccepterDevis $accepter,
        private readonly DevisPdf $pdf,
    ) {
    }

    #[Route('/espace/demandes', name: 'espace_demandes', methods: ['GET'])]
    public function lister(Request $request): JsonResponse
    {
        $courante = $this->session->courante($request);
        if ($courante === null) {
            return self::json(['erreur' => 'Non connecté.'], Response::HTTP_UNAUTHORIZED);
        }

        return self::json(['demandes' => array_map(
            fn (Demande $d) => self::demande($d, $this->devis->pourDemande($d->id)),
            $this->demandes->parEmail($courante->compte->email()),
        )]);
    }

    #[Route('/espace/demandes/{id}/devis/accepter', name: 'espace_devis_accepter', methods: ['POST'])]
    public function accepter(Request $request, string $id): JsonResponse
    {
        if ($request->getContentTypeFormat() !== 'json') {
            return self::json(['erreur' => 'Corps JSON attendu (Content-Type: application/json).'], Response::HTTP_UNSUPPORTED_MEDIA_TYPE);
        }
        $courante = $this->session->courante($request);
        if ($courante === null) {
            return self::json(['erreur' => 'Non connecté.'], Response::HTTP_UNAUTHORIZED);
        }
        try {
            $devis = ($this->accepter)($id, $courante->compte->email());
        } catch (DemandeIntrouvable $e) {
            return self::json(['erreur' => $e->getMessage()], Response::HTTP_NOT_FOUND);
        } catch (ActionImpossible $e) {
            return self::json(['erreur' => $e->getMessage()], Response::HTTP_CONFLICT);
        }
        $demande = $this->demandes->parId($id);
        \assert($demande instanceof Demande);

        return self::json(['demande' => self::demande($demande, $devis)]);
    }

    #[Route('/espace/demandes/{id}/devis.pdf', name: 'espace_devis_pdf', methods: ['GET'])]
    public function pdf(Request $request, string $id): Response
    {
        $courante = $this->session->courante($request);
        if ($courante === null) {
            return self::json(['erreur' => 'Non connecté.'], Response::HTTP_UNAUTHORIZED);
        }
        $demande = $this->demandes->parId($id);
        $devis = $demande !== null && $demande->demandeur->estLaMemePersonne($courante->compte->email()) ? $this->devis->pourDemande($id) : null;
        if ($demande === null || $devis === null) {
            return self::json(['erreur' => 'Devis introuvable.'], Response::HTTP_NOT_FOUND);
        }
        $reponse = new Response($this->pdf->generer($demande, $devis), Response::HTTP_OK, ['Content-Type' => 'application/pdf', 'Cache-Control' => 'no-store']);
        $reponse->headers->set('Content-Disposition', $reponse->headers->makeDisposition(ResponseHeaderBag::DISPOSITION_ATTACHMENT, "devis-{$devis->numero}.pdf"));

        return $reponse;
    }

    /** @return array<string, mixed> */
    private static function demande(Demande $d, ?Devis $devis): array
    {
        return [
            'id' => $d->id,
            'numero' => $d->numero,
            'titre' => $d->titre,
            'envoyeeLe' => $d->creeLe->format(\DATE_ATOM),
            'statut' => $d->statut()->value,
            'etapes' => array_map(static fn (StatutDemande $s) => ['statut' => $s->value, 'libelle' => $s->libelle(), 'atteinte' => $s->rang() <= $d->statut()->rang()], StatutDemande::cases()),
            'devis' => $devis === null ? null : [
                'numero' => $devis->numero,
                'lignes' => array_map(static fn (LigneDevis $l) => $l->enTableau(), $devis->lignes()),
                'total' => $devis->total,
                'statut' => $devis->statut()->value,
                'envoyeLe' => $devis->envoyeLe->format(\DATE_ATOM),
                'accepteLe' => $devis->accepteLe()?->format(\DATE_ATOM),
            ],
        ];
    }

    /** @param array<string, mixed> $corps */
    private static function json(array $corps, int $statut = Response::HTTP_OK): JsonResponse
    {
        return new JsonResponse($corps, $statut, ['Cache-Control' => 'no-store']);
    }
}
