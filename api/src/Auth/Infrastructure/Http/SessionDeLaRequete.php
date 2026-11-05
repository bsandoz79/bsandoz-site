<?php

declare(strict_types=1);

namespace App\Auth\Infrastructure\Http;

use App\Auth\Application\SessionOuverte;
use App\Auth\Application\Sessions;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\Request;

/**
 * Session de la personne qui fait la requête, lue dans le cookie. Pour protéger d'autres points d'entrée
 * (espace client) sans dupliquer la lecture du cookie.
 */
final class SessionDeLaRequete
{
    public function __construct(
        private readonly Sessions $sessions,
        #[Autowire('%auth.cookie_nom%')]
        private readonly string $cookieNom,
    ) {
    }

    public function courante(Request $request): ?SessionOuverte
    {
        return $this->sessions->courante((string) $request->cookies->get($this->cookieNom, ''));
    }
}
