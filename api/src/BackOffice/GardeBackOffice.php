<?php

declare(strict_types=1);

namespace App\BackOffice;

use App\Auth\Infrastructure\Http\SessionDeLaRequete;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Qui peut entrer dans le back-office : une personne connectée dont l'adresse figure dans BACKOFFICE_EMAILS.
 * Liste vide : personne. Une adresse de compte est toujours confirmée par mail, elle ne peut pas être usurpée.
 */
final class GardeBackOffice
{
    /** @var list<string> */
    private readonly array $autorisees;

    public function __construct(
        private readonly SessionDeLaRequete $session,
        #[Autowire('%env(BACKOFFICE_EMAILS)%')]
        string $emails,
    ) {
        $this->autorisees = self::lister($emails);
    }

    /** @return list<string> */
    public static function lister(string $emails): array
    {
        return array_values(array_filter(array_map(static fn (string $e) => mb_strtolower(trim($e)), explode(',', $emails))));
    }

    /** @return list<string> */
    public function autorisees(): array
    {
        return $this->autorisees;
    }

    /** Réponse de refus (401, 403, 415), ou null si la requête peut continuer. */
    public function refus(Request $request): ?JsonResponse
    {
        // Comme le reste de l'API : pour modifier, un corps JSON est exigé, ce qu'un autre site ne peut pas envoyer sans permission CORS.
        if ($request->isMethod('POST') && $request->getContentTypeFormat() !== 'json') {
            return self::json(['erreur' => 'Corps JSON attendu (Content-Type: application/json).'], Response::HTTP_UNSUPPORTED_MEDIA_TYPE);
        }
        $courante = $this->session->courante($request);
        if ($courante === null) {
            return self::json(['erreur' => 'Non connecté.'], Response::HTTP_UNAUTHORIZED);
        }
        if (!in_array(mb_strtolower($courante->compte->email()), $this->autorisees, true)) {
            return self::json(['erreur' => 'Accès réservé.'], Response::HTTP_FORBIDDEN);
        }

        return null;
    }

    /** @param array<string, mixed> $corps */
    public static function json(array $corps, int $statut = Response::HTTP_OK): JsonResponse
    {
        return new JsonResponse($corps, $statut, ['Cache-Control' => 'no-store']);
    }
}
