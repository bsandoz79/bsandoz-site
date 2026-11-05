<?php

declare(strict_types=1);

namespace App\Shared\Infrastructure\Http;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Point de contrôle : l'API répond. Utilisé par la surveillance et après chaque déploiement.
 */
final class SanteController
{
    #[Route('/sante', name: 'sante', methods: ['GET'])]
    public function __invoke(): JsonResponse
    {
        return new JsonResponse(['statut' => 'ok']);
    }
}
