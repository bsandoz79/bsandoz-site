<?php

declare(strict_types=1);

namespace App\Booking\Infrastructure\Http;

use App\Booking\Domain\RegleDisponibilite;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

/** Disponibilités en vigueur, publiques : le calendrier du site les lit à l'ouverture de la page. */
final class DisponibilitesController
{
    public function __construct(private readonly RegleDisponibilite $regle)
    {
    }

    #[Route('/rendez-vous/disponibilites', name: 'booking_disponibilites', methods: ['GET'])]
    public function lire(): JsonResponse
    {
        return new JsonResponse([
            'joursTravailles' => $this->regle->joursTravailles,
            'creneaux' => $this->regle->creneaux,
            'dureeMinutes' => $this->regle->dureeMinutes,
            'delaiMinJours' => $this->regle->delaiMinJours,
            'horizonJours' => $this->regle->horizonJours,
            'joursFermes' => $this->regle->joursFermes,
        ], JsonResponse::HTTP_OK, ['Cache-Control' => 'public, max-age=60']);
    }
}
