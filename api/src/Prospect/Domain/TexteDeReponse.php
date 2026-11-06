<?php

declare(strict_types=1);

namespace App\Prospect\Domain;

/** Ne garde d'un mail de réponse que ce que la personne vient d'écrire : ni citation, ni signature. */
final class TexteDeReponse
{
    /** Lignes où commence le message cité ou la signature : tout ce qui suit est retiré. */
    private const FINS = [
        '/^-- ?$/',                                        // signature
        '/^_{5,}$/',                                       // séparateur d'Outlook
        '/^-{2,}\s*(Message d.origine|Original Message|Message transféré|Forwarded message)/iu',
        '/^(Le|On)\s.+(a écrit|wrote)\s*:\s*$/iu',          // « Le 5 nov. 2026, Baptiste a écrit : »
        '/^(De|From)\s*:\s.+/iu',                           // en-têtes recopiés par Outlook
        '/^Envoyé (de|depuis) mon\b/iu',                    // « Envoyé de mon iPhone »
        '/^Sent from my\b/iu',
    ];

    public static function nettoyer(string $texte): string
    {
        $lignes = explode("\n", str_replace(["\r\n", "\r"], "\n", $texte));
        $gardees = [];
        foreach ($lignes as $i => $ligne) {
            $l = trim($ligne);
            // Certains logiciels coupent « Le … a écrit : » sur deux lignes.
            $surDeux = isset($lignes[$i + 1]) && $l !== '' ? $l . ' ' . trim($lignes[$i + 1]) : $l;
            foreach (self::FINS as $fin) {
                if (preg_match($fin, $l) === 1 || (str_starts_with($fin, '/^(Le|On)') && preg_match($fin, $surDeux) === 1)) {
                    break 2;
                }
            }
            if (!str_starts_with($l, '>')) {
                $gardees[] = rtrim($ligne);
            }
        }

        return mb_substr(trim(implode("\n", $gardees)), 0, Message::TAILLE_MAX);
    }
}
