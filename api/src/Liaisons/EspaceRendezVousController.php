<?php

declare(strict_types=1);

namespace App\Liaisons;

use App\Auth\Application\SessionOuverte;
use App\Auth\Infrastructure\Http\SessionDeLaRequete;
use App\Booking\Application\AnnulerRendezVous;
use App\Booking\Domain\Horloge;
use App\Booking\Domain\RegleDisponibilite;
use App\Booking\Domain\RendezVous;
use App\Booking\Domain\RendezVousRepository;
use App\Booking\Infrastructure\Mail\FichierIcs;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Espace client, « Mes rendez-vous » : liaison propre à bsandoz.fr entre Auth (qui est connecté)
 * et Booking (ses rendez-vous, retrouvés par son adresse e-mail).
 *
 * Un rendez-vous d'une autre adresse répond 404, comme s'il n'existait pas.
 */
final class EspaceRendezVousController
{
    public function __construct(
        private readonly SessionDeLaRequete $session,
        private readonly RendezVousRepository $rendezVous,
        private readonly AnnulerRendezVous $annuler,
        private readonly RegleDisponibilite $regle,
        private readonly Horloge $horloge,
        #[Autowire('%booking.professionnel_nom%')]
        private readonly string $professionnelNom,
        #[Autowire('%booking.professionnel_email%')]
        private readonly string $professionnelEmail,
        #[Autowire('%booking.url_publique%')]
        private readonly string $urlPublique,
    ) {
    }

    #[Route('/espace/rendez-vous', name: 'espace_rendez_vous', methods: ['GET'])]
    public function lister(Request $request): JsonResponse
    {
        $courante = $this->session->courante($request);
        if ($courante === null) {
            return self::json(['erreur' => 'Non connecté.'], Response::HTTP_UNAUTHORIZED);
        }
        $maintenant = $this->horloge->maintenant();
        $liste = array_map(fn (RendezVous $r) => [
            'id' => $r->id,
            'jour' => $r->creneau->jour,
            'debut' => $r->creneau->heure,
            'fin' => $r->creneau->fin($this->regle->fuseau, $this->regle->dureeMinutes)->format('H:i'),
            'lieu' => $r->lieu->value,
            'lieuLibelle' => $r->lieu->libelle(),
            'adresse' => $r->adresse,
            'statut' => $r->statut()->value,
            'aVenir' => $r->estConfirme() && $r->creneau->debut($this->regle->fuseau) > $maintenant,
        ], $this->rendezVous->parEmail($courante->compte->email()));

        return self::json(['rendezVous' => $liste]);
    }

    /** Fichier .ics à ouvrir pour ajouter le rendez-vous à son agenda. */
    #[Route('/espace/rendez-vous/{id}/agenda.ics', name: 'espace_rendez_vous_agenda', methods: ['GET'])]
    public function agenda(Request $request, string $id): Response
    {
        $rendezVous = $this->sien($request, $id);
        if (!$rendezVous instanceof RendezVous) {
            return $rendezVous;
        }
        $ics = FichierIcs::pour(
            $rendezVous,
            $this->regle->dureeMinutes,
            $this->regle->fuseau,
            "Rendez-vous découverte – {$this->professionnelNom}",
            $this->professionnelEmail,
            (string) (parse_url($this->urlPublique, \PHP_URL_HOST) ?: 'localhost'),
            !$rendezVous->estConfirme(),
        );
        $reponse = new Response($ics, Response::HTTP_OK, ['Content-Type' => 'text/calendar; charset=utf-8', 'Cache-Control' => 'no-store']);
        $reponse->headers->set('Content-Disposition', $reponse->headers->makeDisposition(ResponseHeaderBag::DISPOSITION_ATTACHMENT, 'rendez-vous.ics'));

        return $reponse;
    }

    #[Route('/espace/rendez-vous/{id}/annuler', name: 'espace_rendez_vous_annuler', methods: ['POST'])]
    public function annuler(Request $request, string $id): JsonResponse
    {
        if ($request->getContentTypeFormat() !== 'json') {
            return self::json(['erreur' => 'Corps JSON attendu (Content-Type: application/json).'], Response::HTTP_UNSUPPORTED_MEDIA_TYPE);
        }
        $rendezVous = $this->sien($request, $id);
        if (!$rendezVous instanceof RendezVous) {
            return $rendezVous;
        }
        if ($rendezVous->estConfirme() && $rendezVous->creneau->debut($this->regle->fuseau) <= $this->horloge->maintenant()) {
            return self::json(['erreur' => 'Ce rendez-vous est déjà passé.'], Response::HTTP_CONFLICT);
        }
        // Même cas d'usage que le lien du mail : le créneau redevient libre, la personne et le professionnel sont prévenus.
        ($this->annuler)($rendezVous->jeton);

        return self::json(['statut' => $rendezVous->statut()->value]);
    }

    /** Le rendez-vous s'il appartient à la personne connectée ; sinon la réponse d'erreur (401 ou 404). */
    private function sien(Request $request, string $id): RendezVous|JsonResponse
    {
        $courante = $this->session->courante($request);
        if (!$courante instanceof SessionOuverte) {
            return self::json(['erreur' => 'Non connecté.'], Response::HTTP_UNAUTHORIZED);
        }
        $rendezVous = $this->rendezVous->parId($id);
        if ($rendezVous === null || mb_strtolower($rendezVous->contact->email) !== $courante->compte->email()) {
            return self::json(['erreur' => 'Rendez-vous introuvable.'], Response::HTTP_NOT_FOUND);
        }

        return $rendezVous;
    }

    /** @param array<string, mixed> $corps */
    private static function json(array $corps, int $statut = Response::HTTP_OK): JsonResponse
    {
        return new JsonResponse($corps, $statut, ['Cache-Control' => 'no-store']);
    }
}
