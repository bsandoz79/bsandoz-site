<?php

declare(strict_types=1);

namespace App\BackOffice;

use App\Catalogue\Application\ModifierLesPrix;
use App\Catalogue\Domain\PrixEnregistres;
use App\Catalogue\Domain\PrixInvalide;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

/** Back-office : modifier les prix affichés sur le site. */
final class PrixController
{
    public function __construct(
        private readonly GardeBackOffice $garde,
        private readonly ModifierLesPrix $modifier,
        private readonly PrixEnregistres $prix,
    ) {
    }

    #[Route('/backoffice/prix', name: 'backoffice_prix', methods: ['POST'])]
    public function modifier(Request $request): JsonResponse
    {
        if ($refus = $this->garde->refus($request)) {
            return $refus;
        }
        $corps = json_decode($request->getContent(), true);
        if (!is_array($corps) || !is_array($corps['prix'] ?? null)) {
            return GardeBackOffice::json(['erreur' => 'Prix attendus.'], Response::HTTP_BAD_REQUEST);
        }
        try {
            ($this->modifier)($corps['prix']);
        } catch (PrixInvalide $e) {
            return GardeBackOffice::json(['erreur' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }

        return GardeBackOffice::json(['prix' => (object) $this->prix->tous()]);
    }
}
