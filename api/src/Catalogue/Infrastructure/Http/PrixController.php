<?php

declare(strict_types=1);

namespace App\Catalogue\Infrastructure\Http;

use App\Catalogue\Domain\PrixEnregistres;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

/** Prix modifiés, publics : le site les lit au chargement, pour remplacer ceux de son code. */
final class PrixController
{
    public function __construct(private readonly PrixEnregistres $prix)
    {
    }

    #[Route('/prix', name: 'catalogue_prix', methods: ['GET'])]
    public function lire(): JsonResponse
    {
        // Objet JSON même vide (un tableau vide PHP donnerait []).
        return new JsonResponse(['prix' => (object) $this->prix->tous()], JsonResponse::HTTP_OK, ['Cache-Control' => 'public, max-age=60']);
    }
}
