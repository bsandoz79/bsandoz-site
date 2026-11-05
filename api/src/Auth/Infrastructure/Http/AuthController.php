<?php

declare(strict_types=1);

namespace App\Auth\Infrastructure\Http;

use App\Auth\Application\DefinirMotDePasse;
use App\Auth\Application\DemanderLien;
use App\Auth\Application\SeConnecter;
use App\Auth\Application\SessionOuverte;
use App\Auth\Application\Sessions;
use App\Auth\Application\UtiliserLien;
use App\Auth\Domain\Compte;
use App\Auth\Domain\DonneesInvalides;
use App\Auth\Domain\IdentifiantsIncorrects;
use App\Auth\Domain\LienInvalide;
use App\Auth\Domain\Session;
use App\Auth\Domain\UsageLien;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\RateLimiter\RateLimiterFactory;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Points d'entrée HTTP du module Auth (JSON). La session tient dans un cookie HttpOnly, SameSite=Lax.
 *
 * Les requêtes qui modifient quelque chose exigent un corps JSON (`Content-Type: application/json`) :
 * depuis un autre site, le navigateur doit alors demander la permission (CORS), qui n'est accordée qu'au site.
 */
final class AuthController
{
    public function __construct(
        private readonly DemanderLien $demanderLien,
        private readonly UtiliserLien $utiliserLien,
        private readonly SeConnecter $seConnecter,
        private readonly DefinirMotDePasse $definirMotDePasse,
        private readonly Sessions $sessions,
        #[Autowire(service: 'limiter.auth_connexion')]
        private readonly RateLimiterFactory $limiteConnexion,
        #[Autowire(service: 'limiter.auth_lien')]
        private readonly RateLimiterFactory $limiteLien,
        #[Autowire('%auth.cookie_nom%')]
        private readonly string $cookieNom,
        #[Autowire('%auth.cookie_securise%')]
        private readonly bool $cookieSecurise,
    ) {
    }

    /** Recevoir par mail un lien de connexion ou de changement de mot de passe. Toujours 202 (on ne révèle pas qui a un compte). */
    #[Route('/auth/lien', name: 'auth_demander_lien', methods: ['POST'])]
    public function demanderLien(Request $request): JsonResponse
    {
        $donnees = $this->json($request);
        if ($donnees instanceof JsonResponse) {
            return $donnees;
        }
        $email = self::texte($donnees, 'email');
        if (!$this->limiteLien->create($request->getClientIp() . '|' . mb_strtolower($email))->consume()->isAccepted()) {
            return self::tropDEssais();
        }
        $usage = UsageLien::tryFrom(self::texte($donnees, 'usage'));
        try {
            ($this->demanderLien)($email, $usage ?? UsageLien::Activation);
        } catch (DonneesInvalides $e) {
            return self::erreurs($e);
        }

        return self::sansCache(new JsonResponse(['ok' => true], Response::HTTP_ACCEPTED));
    }

    /** Ouvrir le lien d'activation ou de connexion : ouvre une session. */
    #[Route('/auth/lien/utiliser', name: 'auth_utiliser_lien', methods: ['POST'])]
    public function utiliserLien(Request $request): JsonResponse
    {
        $donnees = $this->json($request);
        if ($donnees instanceof JsonResponse) {
            return $donnees;
        }
        try {
            $ouverte = ($this->utiliserLien)(self::texte($donnees, 'jeton'), Appareil::depuisUserAgent($request->headers->get('User-Agent')));
        } catch (LienInvalide $e) {
            return self::lienInvalide($e);
        }

        return $this->connecte($ouverte);
    }

    #[Route('/auth/connexion', name: 'auth_connexion', methods: ['POST'])]
    public function connexion(Request $request): JsonResponse
    {
        $donnees = $this->json($request);
        if ($donnees instanceof JsonResponse) {
            return $donnees;
        }
        $email = self::texte($donnees, 'email');
        $limite = $this->limiteConnexion->create($request->getClientIp() . '|' . mb_strtolower(trim($email)));
        if (!$limite->consume()->isAccepted()) {
            return self::tropDEssais();
        }
        try {
            $ouverte = ($this->seConnecter)($email, self::texte($donnees, 'motDePasse'), Appareil::depuisUserAgent($request->headers->get('User-Agent')));
        } catch (IdentifiantsIncorrects $e) {
            return self::sansCache(new JsonResponse(['erreur' => $e->getMessage()], Response::HTTP_UNAUTHORIZED));
        }
        $limite->reset();

        return $this->connecte($ouverte);
    }

    /** Choisir un nouveau mot de passe depuis le lien reçu par mail. */
    #[Route('/auth/mot-de-passe', name: 'auth_mot_de_passe', methods: ['POST'])]
    public function motDePasse(Request $request): Response
    {
        $donnees = $this->json($request);
        if ($donnees instanceof JsonResponse) {
            return $donnees;
        }
        try {
            ($this->definirMotDePasse)(self::texte($donnees, 'jeton'), self::texte($donnees, 'motDePasse'));
        } catch (LienInvalide $e) {
            return self::lienInvalide($e);
        } catch (DonneesInvalides $e) {
            return self::erreurs($e);
        }

        // Toutes les sessions ont été fermées : on efface aussi le cookie de ce navigateur.
        $reponse = new Response(null, Response::HTTP_NO_CONTENT);
        $reponse->headers->clearCookie($this->cookieNom, '/', null, $this->cookieSecurise, true, Cookie::SAMESITE_LAX);

        return self::sansCache($reponse);
    }

    #[Route('/auth/moi', name: 'auth_moi', methods: ['GET'])]
    public function moi(Request $request): JsonResponse
    {
        $courante = $this->sessions->courante((string) $request->cookies->get($this->cookieNom, ''));
        if ($courante === null) {
            return self::nonConnecte();
        }

        return self::sansCache(new JsonResponse(['compte' => self::compte($courante->compte)]));
    }

    #[Route('/auth/deconnexion', name: 'auth_deconnexion', methods: ['POST'])]
    public function deconnexion(Request $request): Response
    {
        $donnees = $this->json($request);
        if ($donnees instanceof JsonResponse) {
            return $donnees;
        }
        $this->sessions->deconnecter((string) $request->cookies->get($this->cookieNom, ''));
        $reponse = new Response(null, Response::HTTP_NO_CONTENT);
        $reponse->headers->clearCookie($this->cookieNom, '/', null, $this->cookieSecurise, true, Cookie::SAMESITE_LAX);

        return self::sansCache($reponse);
    }

    /** Appareils connectés au compte (sessions actives). */
    #[Route('/auth/appareils', name: 'auth_appareils', methods: ['GET'])]
    public function appareils(Request $request): JsonResponse
    {
        $courante = $this->sessions->courante((string) $request->cookies->get($this->cookieNom, ''));
        if ($courante === null) {
            return self::nonConnecte();
        }
        $liste = array_map(static fn (Session $s) => [
            'id' => $s->id,
            'appareil' => $s->appareil,
            'connecteLe' => $s->creeLe->format(\DATE_ATOM),
            'derniereActivite' => $s->derniereActivite()->format(\DATE_ATOM),
            'courant' => $s->id === $courante->session->id,
        ], $this->sessions->appareils($courante->compte->id));

        return self::sansCache(new JsonResponse(['appareils' => $liste]));
    }

    #[Route('/auth/appareils/deconnecter-les-autres', name: 'auth_deconnecter_autres', methods: ['POST'])]
    public function deconnecterLesAutres(Request $request): JsonResponse
    {
        $donnees = $this->json($request);
        if ($donnees instanceof JsonResponse) {
            return $donnees;
        }
        $courante = $this->sessions->courante((string) $request->cookies->get($this->cookieNom, ''));
        if ($courante === null) {
            return self::nonConnecte();
        }

        return self::sansCache(new JsonResponse(['deconnectes' => $this->sessions->deconnecterLesAutres($courante)]));
    }

    private function connecte(SessionOuverte $ouverte): JsonResponse
    {
        $reponse = new JsonResponse(['compte' => self::compte($ouverte->compte)]);
        $reponse->headers->setCookie(Cookie::create($this->cookieNom)
            ->withValue($ouverte->secret)
            ->withExpires($ouverte->session->expireLe())
            ->withPath('/')
            ->withSecure($this->cookieSecurise)
            ->withHttpOnly(true)
            ->withSameSite(Cookie::SAMESITE_LAX));

        return self::sansCache($reponse);
    }

    /** @return array<string, mixed>|JsonResponse corps JSON décodé, ou la réponse d'erreur à renvoyer */
    private function json(Request $request): array|JsonResponse
    {
        if ($request->getContentTypeFormat() !== 'json') {
            return new JsonResponse(['erreur' => 'Corps JSON attendu (Content-Type: application/json).'], Response::HTTP_UNSUPPORTED_MEDIA_TYPE);
        }
        try {
            $donnees = json_decode($request->getContent() ?: '{}', true, 8, \JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            return new JsonResponse(['erreur' => 'JSON invalide.'], Response::HTTP_BAD_REQUEST);
        }

        return is_array($donnees) ? $donnees : new JsonResponse(['erreur' => 'Objet JSON attendu.'], Response::HTTP_BAD_REQUEST);
    }

    /** @param array<string, mixed> $donnees */
    private static function texte(array $donnees, string $cle): string
    {
        return is_string($donnees[$cle] ?? null) ? $donnees[$cle] : '';
    }

    /** @return array<string, mixed> */
    private static function compte(Compte $compte): array
    {
        return CompteJson::depuis($compte);
    }

    private static function erreurs(DonneesInvalides $e): JsonResponse
    {
        return self::sansCache(new JsonResponse(['erreurs' => $e->erreurs], Response::HTTP_BAD_REQUEST));
    }

    private static function lienInvalide(LienInvalide $e): JsonResponse
    {
        return self::sansCache(new JsonResponse(['erreur' => $e->getMessage()], Response::HTTP_GONE));
    }

    private static function nonConnecte(): JsonResponse
    {
        return self::sansCache(new JsonResponse(['erreur' => 'Non connecté.'], Response::HTTP_UNAUTHORIZED));
    }

    private static function tropDEssais(): JsonResponse
    {
        return self::sansCache(new JsonResponse(['erreur' => 'Trop d’essais. Réessayez dans quelques minutes.'], Response::HTTP_TOO_MANY_REQUESTS));
    }

    /** @template T of Response @param T $reponse @return T */
    private static function sansCache(Response $reponse): Response
    {
        $reponse->headers->set('Cache-Control', 'no-store');

        return $reponse;
    }
}
