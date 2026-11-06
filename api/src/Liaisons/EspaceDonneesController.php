<?php

declare(strict_types=1);

namespace App\Liaisons;

use App\Auth\Application\Sessions;
use App\Auth\Domain\Session;
use App\Auth\Infrastructure\Http\CompteJson;
use App\Auth\Infrastructure\Http\SessionDeLaRequete;
use App\Booking\Domain\RendezVous;
use App\Booking\Domain\RendezVousRepository;
use App\Prospect\Domain\Demande;
use App\Prospect\Domain\Demandes;
use App\Prospect\Domain\DevisEnregistres;
use App\Prospect\Domain\LigneDevis;
use App\Prospect\Domain\Message;
use App\Prospect\Domain\Messages;
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
        private readonly Demandes $demandes,
        private readonly DevisEnregistres $devis,
        private readonly Messages $messages,
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
            'demandes' => array_map(fn (Demande $d) => [
                'numero' => $d->numero,
                'titre' => $d->titre,
                'envoyeeLe' => $d->creeLe->format(\DATE_ATOM),
                'statut' => $d->statut()->libelle(),
                'demandeur' => ['nom' => $d->demandeur->nom, 'email' => $d->demandeur->email, 'telephone' => $d->demandeur->telephone, 'entreprise' => $d->demandeur->entreprise],
                'recapitulatif' => $d->recapitulatif,
                'predevis' => $d->predevis,
                'messages' => array_map(static fn (Message $m) => [
                    'auteur' => $m->auteur->value,
                    'origine' => $m->origine->value,
                    'corps' => $m->corps,
                    'envoyeLe' => $m->creeLe->format(\DATE_ATOM),
                ], $this->messages->pourDemande($d->id)),
                'devis' => ($devis = $this->devis->pourDemande($d->id)) === null ? null : [
                    'lignes' => array_map(static fn (LigneDevis $l) => $l->enTableau(), $devis->lignes()),
                    'total' => $devis->total,
                    'statut' => $devis->statut()->value,
                    'accepteLe' => $devis->accepteLe()?->format(\DATE_ATOM),
                ],
            ], $this->demandes->parEmail($compte->email())),
        ];

        $reponse = new JsonResponse($donnees, Response::HTTP_OK, ['Cache-Control' => 'no-store']);
        $reponse->setEncodingOptions(\JSON_PRETTY_PRINT | \JSON_UNESCAPED_UNICODE | \JSON_UNESCAPED_SLASHES);
        $reponse->headers->set('Content-Disposition', $reponse->headers->makeDisposition(ResponseHeaderBag::DISPOSITION_ATTACHMENT, 'mes-donnees-bsandoz.json'));

        return $reponse;
    }
}
