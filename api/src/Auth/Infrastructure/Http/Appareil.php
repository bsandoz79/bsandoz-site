<?php

declare(strict_types=1);

namespace App\Auth\Infrastructure\Http;

/** Nom lisible d'un appareil (« Firefox sur Windows ») d'après l'en-tête User-Agent, pour la liste des appareils connectés. */
final class Appareil
{
    public static function depuisUserAgent(?string $userAgent): string
    {
        $ua = (string) $userAgent;
        $navigateur = match (true) {
            str_contains($ua, 'Edg/') => 'Edge',
            str_contains($ua, 'OPR/'), str_contains($ua, 'Opera') => 'Opera',
            str_contains($ua, 'Firefox/'), str_contains($ua, 'FxiOS/') => 'Firefox',
            str_contains($ua, 'Chrome/'), str_contains($ua, 'CriOS/') => 'Chrome',
            str_contains($ua, 'Safari/') => 'Safari',
            default => 'Navigateur',
        };
        $systeme = match (true) {
            str_contains($ua, 'iPhone') => 'iPhone',
            str_contains($ua, 'iPad') => 'iPad',
            str_contains($ua, 'Android') => 'Android',
            str_contains($ua, 'Windows') => 'Windows',
            str_contains($ua, 'Mac OS X'), str_contains($ua, 'Macintosh') => 'Mac',
            str_contains($ua, 'Linux') => 'Linux',
            default => null,
        };

        return $systeme !== null ? "{$navigateur} sur {$systeme}" : $navigateur;
    }
}
