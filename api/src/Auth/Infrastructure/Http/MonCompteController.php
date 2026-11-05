<?php

declare(strict_types=1);

namespace App\Auth\Infrastructure\Http;

use App\Auth\Application\MonCompte;
use App\Auth\Domain\DonneesInvalides;
use App\Auth\Domain\LienInvalide;
use App\Auth\Infrastructure\Evenement\CompteSupprime;
use Psr\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\RateLimiter\RateLimiterFactory;
use Symfony\Component\Routing\Attribute\Route;

/**
 * « Mon compte » : coordonnées et préférences, changement d'e-mail, suppression du compte.
 * Même règles que AuthController : corps JSON obligatoire pour modifier, réponses jamais mises en cache.
 */
final class MonCompteController
{
    public function __construct(
        private readonly MonCompte $monCompte,
        private readonly SessionDeLaRequete $session,
        private readonly EventDispatcherInterface $evenements,
        #[Autowire(service: 'limiter.auth_lien')]
        private readonly RateLimiterFactory $limiteLien,
        #[Autowire('%auth.cookie_nom%')]
        private readonly string $cookieNom,
        #[Autowire('%auth.cookie_securise%')]
        private readonly bool $cookieSecurise,
    ) {
    }

    #[Route('/auth/compte', name: 'auth_compte_modifier', methods: ['POST'])]
    public function modifier(Request $request): JsonResponse
    {
        $donnees = self::json($request);
        if ($donnees instanceof JsonResponse) {
            return $donnees;
        }
        $courante = $this->session->courante($request);
        if ($courante === null) {
            return self::reponse(['erreur' => 'Non connecté.'], Response::HTTP_UNAUTHORIZED);
        }
        try {
            $this->monCompte->modifierProfil(
                $courante->compte,
                self::texte($donnees, 'nom'),
                self::texte($donnees, 'entreprise'),
                self::texte($donnees, 'telephone'),
                self::texte($donnees, 'adresse'),
                ($donnees['notifications'] ?? true) !== false,
            );
        } catch (DonneesInvalides $e) {
            return self::reponse(['erreurs' => $e->erreurs], Response::HTTP_BAD_REQUEST);
        }

        return self::reponse(['compte' => CompteJson::depuis($courante->compte)]);
    }

    /** Envoie un lien de confirmation à la nouvelle adresse. */
    #[Route('/auth/email', name: 'auth_email_demander', methods: ['POST'])]
    public function demanderChangementEmail(Request $request): JsonResponse
    {
        $donnees = self::json($request);
        if ($donnees instanceof JsonResponse) {
            return $donnees;
        }
        $courante = $this->session->courante($request);
        if ($courante === null) {
            return self::reponse(['erreur' => 'Non connecté.'], Response::HTTP_UNAUTHORIZED);
        }
        if (!$this->limiteLien->create($request->getClientIp() . '|' . $courante->compte->id)->consume()->isAccepted()) {
            return self::reponse(['erreur' => 'Trop d’essais. Réessayez dans quelques minutes.'], Response::HTTP_TOO_MANY_REQUESTS);
        }
        try {
            $this->monCompte->demanderChangementEmail($courante->compte, self::texte($donnees, 'email'));
        } catch (DonneesInvalides $e) {
            return self::reponse(['erreurs' => $e->erreurs], Response::HTTP_BAD_REQUEST);
        }

        return self::reponse(['ok' => true], Response::HTTP_ACCEPTED);
    }

    /** Ouvert depuis le lien reçu à la nouvelle adresse (connexion non exigée : le lien suffit). */
    #[Route('/auth/email/confirmer', name: 'auth_email_confirmer', methods: ['POST'])]
    public function confirmerChangementEmail(Request $request): JsonResponse
    {
        $donnees = self::json($request);
        if ($donnees instanceof JsonResponse) {
            return $donnees;
        }
        try {
            $compte = $this->monCompte->confirmerChangementEmail(self::texte($donnees, 'jeton'));
        } catch (LienInvalide $e) {
            return self::reponse(['erreur' => $e->getMessage()], Response::HTTP_GONE);
        } catch (DonneesInvalides $e) {
            return self::reponse(['erreurs' => $e->erreurs], Response::HTTP_BAD_REQUEST);
        }

        return self::reponse(['compte' => CompteJson::depuis($compte)]);
    }

    /** Première étape : un lien de confirmation part par mail. */
    #[Route('/auth/suppression', name: 'auth_suppression_demander', methods: ['POST'])]
    public function demanderSuppression(Request $request): JsonResponse
    {
        $donnees = self::json($request);
        if ($donnees instanceof JsonResponse) {
            return $donnees;
        }
        $courante = $this->session->courante($request);
        if ($courante === null) {
            return self::reponse(['erreur' => 'Non connecté.'], Response::HTTP_UNAUTHORIZED);
        }
        $this->monCompte->demanderSuppression($courante->compte);

        return self::reponse(['ok' => true], Response::HTTP_ACCEPTED);
    }

    /** Seconde étape, depuis le lien du mail : suppression définitive. */
    #[Route('/auth/suppression/confirmer', name: 'auth_suppression_confirmer', methods: ['POST'])]
    public function confirmerSuppression(Request $request): Response
    {
        $donnees = self::json($request);
        if ($donnees instanceof JsonResponse) {
            return $donnees;
        }
        try {
            $supprime = $this->monCompte->confirmerSuppression(self::texte($donnees, 'jeton'));
        } catch (LienInvalide $e) {
            return self::reponse(['erreur' => $e->getMessage()], Response::HTTP_GONE);
        }
        $this->evenements->dispatch(new CompteSupprime($supprime['email'], $supprime['nom']));

        $reponse = new Response(null, Response::HTTP_NO_CONTENT, ['Cache-Control' => 'no-store']);
        $reponse->headers->clearCookie($this->cookieNom, '/', null, $this->cookieSecurise, true, Cookie::SAMESITE_LAX);

        return $reponse;
    }

    /** @return array<string, mixed>|JsonResponse */
    private static function json(Request $request): array|JsonResponse
    {
        if ($request->getContentTypeFormat() !== 'json') {
            return self::reponse(['erreur' => 'Corps JSON attendu (Content-Type: application/json).'], Response::HTTP_UNSUPPORTED_MEDIA_TYPE);
        }
        try {
            $donnees = json_decode($request->getContent() ?: '{}', true, 8, \JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            return self::reponse(['erreur' => 'JSON invalide.'], Response::HTTP_BAD_REQUEST);
        }

        return is_array($donnees) ? $donnees : self::reponse(['erreur' => 'Objet JSON attendu.'], Response::HTTP_BAD_REQUEST);
    }

    /** @param array<string, mixed> $donnees */
    private static function texte(array $donnees, string $cle): string
    {
        return is_string($donnees[$cle] ?? null) ? $donnees[$cle] : '';
    }

    /** @param array<string, mixed> $corps */
    private static function reponse(array $corps, int $statut = Response::HTTP_OK): JsonResponse
    {
        return new JsonResponse($corps, $statut, ['Cache-Control' => 'no-store']);
    }
}
