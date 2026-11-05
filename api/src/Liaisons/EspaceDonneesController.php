<?php

declare(strict_types=1);

namespace App\Liaisons;

use App\Auth\Application\Sessions;
use App\Auth\Domain\Session;
use App\Auth\Infrastructure\Http\CompteJson;
use App\Auth\Infrastructure\Http\SessionDeLaRequete;
use App\Booking\Domain\RendezVous;
use App\Booking\Domain\RendezVousRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\Routing\Attribute\Route;

/**
 * « Télécharger mes données » (droit d'accès et de portabilité) : tout ce qui se rattache au compte connecté,
 * dans un fichier JSON lisible. Les secrets (mot de passe haché, empreintes des liens et des sessions) n'y figurent pas.
 */
final class EspaceDonneesController
{
    public function __construct(
        private readonly SessionDeLaRequete $session,
        private readonly Sessions $sessions,
        private readonly RendezVousRepository $rendezVous,
    ) {
    }

    #[Route('/espace/donnees', name: 'espace_donnees', methods: ['GET'])]
    public function telecharger(Request $request): JsonResponse
    {
        $courante = $this->session->courante($request);
        if ($courante === null) {
            return new JsonResponse(['erreur' => 'Non connecté.'], Response::HTTP_UNAUTHORIZED, ['Cache-Control' => 'no-store']);
        }
        $compte = $courante->compte;
        $donnees = [
            'exporteLe' => (new \DateTimeImmutable())->format(\DATE_ATOM),
            'compte' => CompteJson::depuis($compte) + ['creeLe' => $compte->creeLe->format(\DATE_ATOM)],
            'appareilsConnectes' => array_map(static fn (Session $s) => [
                'appareil' => $s->appareil,
                'connecteLe' => $s->creeLe->format(\DATE_ATOM),
                'derniereActivite' => $s->derniereActivite()->format(\DATE_ATOM),
            ], $this->sessions->appareils($compte->id)),
            'rendezVous' => array_map(static fn (RendezVous $r) => [
                'jour' => $r->creneau->jour,
                'heure' => $r->creneau->heure,
                'lieu' => $r->lieu->libelle(),
                'adresse' => $r->adresse,
                'nom' => $r->contact->nom,
                'email' => $r->contact->email,
                'telephone' => $r->contact->telephone,
                'activite' => $r->activite,
                'message' => $r->message,
                'statut' => $r->statut()->value,
                'prisLe' => $r->creeLe->format(\DATE_ATOM),
            ], $this->rendezVous->parEmail($compte->email())),
        ];

        $reponse = new JsonResponse($donnees, Response::HTTP_OK, ['Cache-Control' => 'no-store']);
        $reponse->setEncodingOptions(\JSON_PRETTY_PRINT | \JSON_UNESCAPED_UNICODE | \JSON_UNESCAPED_SLASHES);
        $reponse->headers->set('Content-Disposition', $reponse->headers->makeDisposition(ResponseHeaderBag::DISPOSITION_ATTACHMENT, 'mes-donnees-bsandoz.json'));

        return $reponse;
    }
}
