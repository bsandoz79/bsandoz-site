<?php

declare(strict_types=1);

namespace App\BackOffice;

use App\Booking\Application\AnnulerRendezVous;
use App\Booking\Domain\DonneesInvalides;
use App\Booking\Domain\RegleDisponibilite;
use App\Booking\Domain\RendezVous;
use App\Booking\Domain\RendezVousIntrouvable;
use App\Booking\Domain\RendezVousRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

/** Planning du professionnel : ses rendez-vous, sur une période. */
final class RendezVousController
{
    private const PERIODE_MAX_JOURS = 400;

    public function __construct(
        private readonly GardeBackOffice $garde,
        private readonly RendezVousRepository $rendezVous,
        private readonly AnnulerRendezVous $annuler,
        private readonly RegleDisponibilite $regle,
    ) {
    }

    #[Route('/backoffice/rendez-vous', name: 'backoffice_rendez_vous', methods: ['GET'])]
    public function lister(Request $request): JsonResponse
    {
        if ($refus = $this->garde->refus($request)) {
            return $refus;
        }
        $du = self::date($request->query->getString('du'));
        $au = self::date($request->query->getString('au'));
        if ($du === null || $au === null || $au < $du || $du->diff($au)->days > self::PERIODE_MAX_JOURS) {
            return GardeBackOffice::json(['erreur' => 'Période invalide (du et au, au format AAAA-MM-JJ).'], Response::HTTP_BAD_REQUEST);
        }

        return GardeBackOffice::json(['rendezVous' => array_map(
            $this->detail(...),
            $this->rendezVous->entre($du->format('Y-m-d'), $au->format('Y-m-d')),
        )]);
    }

    #[Route('/backoffice/rendez-vous/{id}/annuler', name: 'backoffice_rendez_vous_annuler', methods: ['POST'])]
    public function annuler(Request $request, string $id): JsonResponse
    {
        if ($refus = $this->garde->refus($request)) {
            return $refus;
        }
        $corps = json_decode($request->getContent(), true);
        $corps = is_array($corps) ? $corps : [];
        try {
            $rendezVous = $this->annuler->parProfessionnel(
                $id,
                is_string($corps['message'] ?? null) ? $corps['message'] : '',
                is_string($corps['lien'] ?? null) ? $corps['lien'] : '',
            );
        } catch (RendezVousIntrouvable) {
            return GardeBackOffice::json(['erreur' => 'Rendez-vous introuvable.'], Response::HTTP_NOT_FOUND);
        } catch (DonneesInvalides $e) {
            return GardeBackOffice::json(['erreurs' => $e->erreurs], Response::HTTP_BAD_REQUEST);
        }

        return GardeBackOffice::json(['rendezVous' => $this->detail($rendezVous)]);
    }

    /** @return array<string, mixed> Jamais le jeton : il ne sert qu'au lien envoyé au client. */
    private function detail(RendezVous $r): array
    {
        return [
            'id' => $r->id,
            'jour' => $r->creneau->jour,
            'heure' => $r->creneau->heure,
            'fin' => $r->creneau->fin($this->regle->fuseau, $this->regle->dureeMinutes)->format('H:i'),
            'lieu' => $r->lieu->value,
            'lieuLibelle' => $r->lieu->libelle(),
            'adresse' => $r->adresse,
            'nom' => $r->contact->nom,
            'email' => $r->contact->email,
            'telephone' => $r->contact->telephone,
            'activite' => $r->activite,
            'message' => $r->message,
            'statut' => $r->statut()->value,
            'kmFactures' => $r->kmFactures,
            'frais' => $r->fraisLisibles(),
        ];
    }

    private static function date(string $texte): ?\DateTimeImmutable
    {
        $date = \DateTimeImmutable::createFromFormat('!Y-m-d', $texte);

        return $date !== false && $date->format('Y-m-d') === $texte ? $date : null;
    }
}
