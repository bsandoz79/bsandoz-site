<?php

declare(strict_types=1);

namespace App\Booking\Infrastructure\Http;

use App\Booking\Application\AnnulerRendezVous;
use App\Booking\Application\ReserverRendezVous;
use App\Booking\Domain\CreneauIndisponible;
use App\Booking\Domain\DonneesInvalides;
use App\Booking\Domain\RendezVousIntrouvable;
use App\Booking\Domain\RendezVousRepository;
use App\Booking\Infrastructure\Mail\AgendaDuRendezVous;
use App\Booking\Infrastructure\Evenement\RendezVousReserve;
use Psr\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Points d'entrée HTTP du module Booking.
 *
 * POST /rendez-vous                  JSON → 201 | 400 { erreurs } | 409
 * GET  /rendez-vous/{id}/agenda.ics  fichier d'agenda (identifiant non devinable, ne permet pas d'annuler)
 * GET  /rendez-vous/{jeton}          page « déplacer ou annuler » (lien du mail, sans effet)
 * POST /rendez-vous/{jeton}/annuler  annule, puis page de confirmation
 */
final class RendezVousController
{
    public function __construct(
        private readonly ReserverRendezVous $reserver,
        private readonly AnnulerRendezVous $annuler,
        private readonly RendezVousRepository $rendezVous,
        private readonly EventDispatcherInterface $evenements,
        private readonly AgendaDuRendezVous $agenda,
        #[Autowire('%booking.professionnel_nom%')]
        private readonly string $professionnelNom,
        #[Autowire('%booking.professionnel_email%')]
        private readonly string $professionnelEmail,
    ) {
    }

    #[Route('/rendez-vous', name: 'booking_reserver', methods: ['POST'])]
    public function reserver(Request $request): JsonResponse
    {
        try {
            $donnees = json_decode($request->getContent(), true, 8, JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            return new JsonResponse(['erreurs' => ['corps' => 'JSON invalide.']], Response::HTTP_BAD_REQUEST);
        }
        if (!is_array($donnees)) {
            return new JsonResponse(['erreurs' => ['corps' => 'Objet JSON attendu.']], Response::HTTP_BAD_REQUEST);
        }

        try {
            $rendezVous = ($this->reserver)($donnees);
        } catch (DonneesInvalides $e) {
            return new JsonResponse(['erreurs' => $e->erreurs], Response::HTTP_BAD_REQUEST);
        } catch (CreneauIndisponible $e) {
            return new JsonResponse(['erreur' => $e->getMessage()], Response::HTTP_CONFLICT);
        }
        $this->evenements->dispatch(new RendezVousReserve($rendezVous));

        return new JsonResponse(
            [
                'id' => $rendezVous->id,
                'statut' => $rendezVous->statut()->value,
                'jour' => $rendezVous->creneau->jour,
                'creneau' => $rendezVous->creneau->heure,
                'agenda' => $this->agenda->liens($rendezVous),
            ],
            Response::HTTP_CREATED,
        );
    }

    #[Route('/rendez-vous/{id}/agenda.ics', name: 'booking_agenda', methods: ['GET'], requirements: ['id' => '[A-Za-z0-9-]{1,36}'])]
    public function agenda(string $id): Response
    {
        $rendezVous = $this->rendezVous->parId($id);
        if ($rendezVous === null || !$rendezVous->estConfirme()) {
            return new Response('Rendez-vous introuvable.', Response::HTTP_NOT_FOUND, ['Content-Type' => 'text/plain; charset=utf-8']);
        }

        return new Response($this->agenda->ics($rendezVous), Response::HTTP_OK, [
            'Content-Type' => 'text/calendar; charset=utf-8',
            'Content-Disposition' => 'attachment; filename="rendez-vous.ics"',
            'Cache-Control' => 'no-store',
        ]);
    }

    #[Route('/rendez-vous/{jeton}', name: 'booking_gerer', methods: ['GET'], requirements: ['jeton' => '[a-f0-9]{64}'])]
    public function gerer(string $jeton): Response
    {
        $rendezVous = $this->rendezVous->parJeton($jeton);
        if ($rendezVous === null) {
            return $this->page('Lien inconnu', '<p>Ce lien de rendez-vous n’existe pas ou a expiré.</p>', Response::HTTP_NOT_FOUND);
        }
        $quand = $this->e("{$rendezVous->creneau->jour} à {$rendezVous->creneau->heure}");
        if (!$rendezVous->estConfirme()) {
            return $this->page('Rendez-vous annulé', "<p>Votre rendez-vous du {$quand} est déjà annulé.</p>");
        }

        return $this->page(
            'Votre rendez-vous',
            "<p>Rendez-vous du <strong>{$quand}</strong> ({$this->e($rendezVous->lieu->libelle())}).</p>"
            . "<p>Pour le <strong>déplacer</strong>, annulez-le puis reprenez un créneau, ou écrivez à <a href=\"mailto:{$this->e($this->professionnelEmail)}\">{$this->e($this->professionnelEmail)}</a>.</p>"
            . "<form method=\"post\" action=\"/rendez-vous/{$jeton}/annuler\"><button type=\"submit\">Annuler le rendez-vous</button></form>",
        );
    }

    #[Route('/rendez-vous/{jeton}/annuler', name: 'booking_annuler', methods: ['POST'], requirements: ['jeton' => '[a-f0-9]{64}'])]
    public function annuler(string $jeton): Response
    {
        try {
            $rendezVous = ($this->annuler)($jeton);
        } catch (RendezVousIntrouvable) {
            return $this->page('Lien inconnu', '<p>Ce lien de rendez-vous n’existe pas ou a expiré.</p>', Response::HTTP_NOT_FOUND);
        }

        return $this->page('Rendez-vous annulé', "<p>Votre rendez-vous du {$this->e("{$rendezVous->creneau->jour} à {$rendezVous->creneau->heure}")} est annulé. Un e-mail de confirmation vous a été envoyé.</p>");
    }

    private function e(string $texte): string
    {
        return htmlspecialchars($texte, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    }

    private function page(string $titre, string $contenu, int $statut = Response::HTTP_OK): Response
    {
        $nom = $this->e($this->professionnelNom);
        $html = <<<HTML
            <!doctype html>
            <html lang="fr">
            <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>{$titre} – {$nom}</title>
            <style>body{font-family:system-ui,sans-serif;max-width:36rem;margin:3rem auto;padding:0 1rem;line-height:1.6;color:#16213e}button{font:inherit;font-weight:600;padding:.75rem 1.25rem;border:0;border-radius:999px;background:#9e0f38;color:#fff;cursor:pointer}</style>
            </head>
            <body><h1>{$titre}</h1>{$contenu}<p>{$nom}</p></body>
            </html>
            HTML;

        return new Response($html, $statut, ['Content-Type' => 'text/html; charset=utf-8']);
    }
}
