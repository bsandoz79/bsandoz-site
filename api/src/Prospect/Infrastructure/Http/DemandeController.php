<?php

declare(strict_types=1);

namespace App\Prospect\Infrastructure\Http;

use App\Prospect\Application\EnregistrerDemande;
use App\Prospect\Domain\DonneesInvalides;
use App\Prospect\Domain\PieceJointe;
use App\Prospect\Infrastructure\Evenement\DemandeEnregistree;
use Psr\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\RateLimiter\RateLimiterFactory;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Réception d'une demande de devis : même contrat que l'ancien script `devis.php` (formulaire multipart),
 * pour que le site passe de l'un à l'autre en changeant seulement l'adresse d'envoi.
 *
 * Champs : nom, email, telephone, entreprise, titre, recapitulatif, predevis, site_web (piège, vide), photos[] (3 au plus).
 * Réponses : 200 { ok, numero } · 400 { ok: false, erreurs } · 429 · 500.
 */
final class DemandeController
{
    public const MAX_PHOTOS = 3;
    public const TAILLE_MAX_PHOTO = 5 * 1024 * 1024;
    private const TYPES_PHOTOS = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];

    public function __construct(
        private readonly EnregistrerDemande $enregistrer,
        private readonly EventDispatcherInterface $evenements,
        #[Autowire(service: 'limiter.prospect_demande')]
        private readonly RateLimiterFactory $limite,
    ) {
    }

    #[Route('/demandes', name: 'prospect_demande', methods: ['POST'])]
    public function recevoir(Request $request): JsonResponse
    {
        // Champ piège rempli : c'est un robot. On répond « ok » sans rien enregistrer ni envoyer.
        if ($request->request->getString('site_web') !== '') {
            return self::reponse(['ok' => true]);
        }
        if (!$this->limite->create((string) $request->getClientIp())->consume()->isAccepted()) {
            return self::reponse(['ok' => false, 'erreur' => 'Trop d’envois. Réessayez plus tard.'], Response::HTTP_TOO_MANY_REQUESTS);
        }

        $photos = [];
        $fichiers = $request->files->all('photos');
        foreach (array_slice(is_array($fichiers) ? $fichiers : [], 0, self::MAX_PHOTOS) as $i => $fichier) {
            if (!$fichier instanceof UploadedFile || !$fichier->isValid()) {
                continue;
            }
            $type = (string) (new \finfo(\FILEINFO_MIME_TYPE))->file($fichier->getPathname());
            if (!isset(self::TYPES_PHOTOS[$type]) || $fichier->getSize() > self::TAILLE_MAX_PHOTO) {
                return self::reponse(['ok' => false, 'erreurs' => ['photos' => 'Photos JPEG, PNG ou WebP de 5 Mo au plus.']], Response::HTTP_BAD_REQUEST);
            }
            $photos[] = new PieceJointe('photo-' . ($i + 1) . '.' . self::TYPES_PHOTOS[$type], $type, (string) file_get_contents($fichier->getPathname()));
        }

        $champs = [];
        foreach (['nom', 'email', 'telephone', 'entreprise', 'titre', 'recapitulatif', 'predevis'] as $cle) {
            $champs[$cle] = $request->request->getString($cle);
        }
        try {
            $demande = ($this->enregistrer)($champs, $photos);
        } catch (DonneesInvalides $e) {
            return self::reponse(['ok' => false, 'erreurs' => $e->erreurs], Response::HTTP_BAD_REQUEST);
        }
        $this->evenements->dispatch(new DemandeEnregistree($demande));

        return self::reponse(['ok' => true, 'numero' => $demande->numero]);
    }

    /** @param array<string, mixed> $corps */
    private static function reponse(array $corps, int $statut = Response::HTTP_OK): JsonResponse
    {
        return new JsonResponse($corps, $statut, ['Cache-Control' => 'no-store']);
    }
}
