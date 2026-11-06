<?php

declare(strict_types=1);

namespace App\BackOffice;

use App\Booking\Application\ModifierDisponibilites;
use App\Booking\Domain\DonneesInvalides;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

/** Back-office : jours travaillés, créneaux, jours fermés. */
final class DisponibilitesController
{
    public function __construct(
        private readonly GardeBackOffice $garde,
        private readonly ModifierDisponibilites $modifier,
    ) {
    }

    #[Route('/backoffice/disponibilites', name: 'backoffice_disponibilites', methods: ['POST'])]
    public function modifier(Request $request): JsonResponse
    {
        if ($refus = $this->garde->refus($request)) {
            return $refus;
        }
        $corps = json_decode($request->getContent(), true);
        $liste = static fn (string $cle): array => is_array($corps) && is_array($corps[$cle] ?? null) ? $corps[$cle] : [];
        try {
            $reglees = ($this->modifier)($liste('joursTravailles'), $liste('creneaux'), $liste('joursFermes'));
        } catch (DonneesInvalides $e) {
            return GardeBackOffice::json(['erreurs' => $e->erreurs], Response::HTTP_BAD_REQUEST);
        }

        return GardeBackOffice::json([
            'joursTravailles' => $reglees->joursTravailles,
            'creneaux' => $reglees->creneaux,
            'joursFermes' => $reglees->joursFermes,
        ]);
    }
}
