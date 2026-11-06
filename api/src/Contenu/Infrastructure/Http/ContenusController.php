<?php

declare(strict_types=1);

namespace App\Contenu\Infrastructure\Http;

use App\Contenu\Domain\ContenusEnregistres;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

/** Contenus modifiés, publics : le site les lit au chargement, pour remplacer ceux de son code. */
final class ContenusController
{
    public function __construct(private readonly ContenusEnregistres $contenus)
    {
    }

    #[Route('/contenus', name: 'contenu_lire', methods: ['GET'])]
    public function lire(): JsonResponse
    {
        // Objet JSON même vide (un tableau vide PHP donnerait []).
        return new JsonResponse(['contenus' => (object) $this->contenus->tous()], JsonResponse::HTTP_OK, ['Cache-Control' => 'public, max-age=60']);
    }
}
