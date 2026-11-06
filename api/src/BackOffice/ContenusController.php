<?php

declare(strict_types=1);

namespace App\BackOffice;

use App\Contenu\Application\EnregistrerImage;
use App\Contenu\Application\ModifierLesContenus;
use App\Contenu\Domain\ContenuInvalide;
use App\Contenu\Domain\ContenusEnregistres;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

/** Modifier textes et images depuis les pages du site (crayon sur chaque bloc). */
final class ContenusController
{
    public function __construct(
        private readonly GardeBackOffice $garde,
        private readonly ModifierLesContenus $modifier,
        private readonly EnregistrerImage $enregistrerImage,
        private readonly ContenusEnregistres $contenus,
    ) {
    }

    #[Route('/backoffice/contenus', name: 'backoffice_contenus', methods: ['POST'])]
    public function modifier(Request $request): JsonResponse
    {
        if ($refus = $this->garde->refus($request)) {
            return $refus;
        }
        $corps = json_decode($request->getContent(), true);
        if (!is_array($corps) || !is_array($corps['contenus'] ?? null)) {
            return GardeBackOffice::json(['erreur' => 'Contenus attendus.'], Response::HTTP_BAD_REQUEST);
        }
        try {
            ($this->modifier)($corps['contenus']);
        } catch (ContenuInvalide $e) {
            return GardeBackOffice::json(['erreur' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }

        return GardeBackOffice::json(['contenus' => (object) $this->contenus->tous()]);
    }

    /** L'image arrive en base64 dans un corps JSON : comme tout le back-office, un autre site ne peut pas l'envoyer. */
    #[Route('/backoffice/images', name: 'backoffice_images', methods: ['POST'])]
    public function image(Request $request): JsonResponse
    {
        if ($refus = $this->garde->refus($request)) {
            return $refus;
        }
        $corps = json_decode($request->getContent(), true);
        if (!is_array($corps) || !is_string($corps['image'] ?? null)) {
            return GardeBackOffice::json(['erreur' => 'Image attendue.'], Response::HTTP_BAD_REQUEST);
        }
        try {
            $nom = ($this->enregistrerImage)($corps['image']);
        } catch (ContenuInvalide $e) {
            return GardeBackOffice::json(['erreur' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }

        return GardeBackOffice::json(['url' => $request->getSchemeAndHttpHost() . '/medias/' . $nom]);
    }
}
