<?php

declare(strict_types=1);

namespace App\Prospect\Infrastructure\Imap;

use App\Prospect\Domain\MailRecu;
use ZBateson\MailMimeParser\Header\AddressHeader;
use ZBateson\MailMimeParser\MailMimeParser;

/** Transforme un mail brut en MailRecu : expéditeur, objet, texte (encodages et parties multiples gérés). */
final class LectureMail
{
    public static function depuisBrut(string $uid, string $brut): MailRecu
    {
        $mail = (new MailMimeParser())->parse($brut, false);
        $expediteur = $mail->getHeader('From');
        $idMessage = trim((string) $mail->getHeaderValue('Message-ID'));
        $texte = $mail->getTextContent();
        if ($texte === null) {
            $html = (string) $mail->getHtmlContent();
            $texte = html_entity_decode(strip_tags((string) preg_replace(
                ['#<(script|style)\b[^>]*>.*?</\1>#is', '#<(br|/p|/div)\b[^>]*>#i'],
                ['', "\n"],
                $html,
            )), \ENT_QUOTES | \ENT_HTML5, 'UTF-8');
        }

        return new MailRecu(
            $uid,
            hash('sha256', $idMessage !== '' ? $idMessage : $brut),
            $expediteur instanceof AddressHeader ? (string) $expediteur->getEmail() : '',
            (string) $mail->getHeaderValue('Subject'),
            $texte,
            self::estAutomatique(
                (string) $mail->getHeaderValue('Auto-Submitted'),
                (string) $mail->getHeaderValue('Precedence'),
                $mail->getHeader('X-Autoreply') !== null || $mail->getHeader('X-Autorespond') !== null,
                (string) $mail->getHeaderValue('Return-Path'),
                $mail->getHeader('Return-Path') !== null,
            ),
        );
    }

    private static function estAutomatique(string $soumis, string $priorite, bool $autoReponse, string $retour, bool $aUnRetour): bool
    {
        return ($soumis !== '' && strtolower($soumis) !== 'no')
            || in_array(strtolower($priorite), ['bulk', 'auto_reply', 'junk', 'list'], true)
            || $autoReponse
            || ($aUnRetour && trim($retour, " <>\t") === ''); // Return-Path vide : erreur de distribution.
    }
}
