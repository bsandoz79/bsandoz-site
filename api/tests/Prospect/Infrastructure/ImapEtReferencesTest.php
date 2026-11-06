<?php

declare(strict_types=1);

namespace App\Tests\Prospect\Infrastructure;

use App\Prospect\Domain\Demande;
use App\Prospect\Domain\Demandeur;
use App\Prospect\Infrastructure\Imap\BoiteImap;
use App\Prospect\Infrastructure\Imap\ClientImap;
use App\Prospect\Infrastructure\Imap\LectureMail;
use App\Prospect\Infrastructure\Systeme\ReferencesSignees;
use PHPUnit\Framework\TestCase;

/**
 * Références signées, lecture de vrais mails bruts, et relevé sur un vrai serveur IMAP de test (GreenMail).
 * Le relevé est ignoré si IMAP_TEST_HOTE n'est pas défini (la CI le fournit).
 */
final class ImapEtReferencesTest extends TestCase
{
    private static function demande(string $numero = '2026-014'): Demande
    {
        return Demande::recevoir('d1', $numero, Demandeur::depuis('Marie', 'marie@exemple.fr'), 'Site', 'Un récapitulatif assez long pour passer.', '', new \DateTimeImmutable('2026-11-01'));
    }

    public function testUneReferenceValideDonneLeNumero(): void
    {
        $references = new ReferencesSignees('secret');
        $reference = $references->pour(self::demande());

        self::assertMatchesRegularExpression('/^\[fil:2026-014-[a-f0-9]{16}\]$/', $reference);
        self::assertSame('2026-014', $references->numeroDans("Re: Votre devis {$reference}"));
    }

    public function testUneReferenceFalsifieeEstRefusee(): void
    {
        $references = new ReferencesSignees('secret');
        $signature = substr($references->pour(self::demande()), -17, 16);

        self::assertNull($references->numeroDans('Re: sans référence'));
        self::assertNull($references->numeroDans('[fil:2026-014-0000000000000000]'));
        self::assertNull($references->numeroDans("[fil:2026-015-{$signature}]"), 'La signature d’une demande ne vaut pas pour une autre.');
        self::assertNull((new ReferencesSignees('autre secret'))->numeroDans($references->pour(self::demande())));
    }

    public function testLireUnMailTexteEncode(): void
    {
        $mail = LectureMail::depuisBrut('7', implode("\r\n", [
            'From: =?UTF-8?Q?Marie_Dupr=C3=A9?= <Marie@Exemple.fr>',
            'Subject: =?UTF-8?Q?Re=3A_Votre_devis_pr=C3=AAt?= [fil:2026-014-abcd]',
            'Message-ID: <abc@exemple.fr>',
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=ISO-8859-1',
            'Content-Transfer-Encoding: quoted-printable',
            '',
            "C'est parfait =E0 989 euros ?",
            '',
        ]));

        self::assertSame('7', $mail->uid);
        self::assertSame('Marie@Exemple.fr', $mail->expediteur);
        self::assertSame('Re: Votre devis prêt [fil:2026-014-abcd]', $mail->sujet);
        self::assertStringContainsString("C'est parfait à 989", $mail->texte);
        self::assertSame(64, strlen($mail->idMail));
        self::assertFalse($mail->automatique);
    }

    public function testLireUnMailMultiPartiesAvecPieceJointe(): void
    {
        $mail = LectureMail::depuisBrut('8', implode("\r\n", [
            'From: marie@exemple.fr',
            'Subject: Re: Devis',
            'MIME-Version: 1.0',
            'Content-Type: multipart/mixed; boundary="B"',
            '',
            '--B',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: base64',
            '',
            base64_encode('Voici la photo, très jolie.'),
            '--B',
            'Content-Type: image/png; name="a.png"',
            'Content-Disposition: attachment; filename="a.png"',
            'Content-Transfer-Encoding: base64',
            '',
            'iVBORw0KGgo=',
            '--B--',
            '',
        ]));

        self::assertSame('Voici la photo, très jolie.', trim($mail->texte));
    }

    public function testUnMailHtmlDevientDuTexteSansBalise(): void
    {
        $mail = LectureMail::depuisBrut('9', implode("\r\n", [
            'From: marie@exemple.fr',
            'Subject: Re: Devis',
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset=UTF-8',
            '',
            '<html><head><style>p{color:red}</style></head><body><p>Bonjour&nbsp;&amp; merci</p><script>alert(1)</script><p>À bientôt</p></body></html>',
            '',
        ]));

        self::assertStringNotContainsString('<', $mail->texte);
        self::assertStringNotContainsString('alert', $mail->texte);
        self::assertStringNotContainsString('color', $mail->texte);
        self::assertStringContainsString('merci', $mail->texte);
        self::assertStringContainsString('À bientôt', $mail->texte);
    }

    public function testReconnaitreUneReponseAutomatique(): void
    {
        $brut = static fn (string $entete) => "From: marie@exemple.fr\r\nSubject: Absence\r\n{$entete}\r\n\r\nJe suis absente.\r\n";

        self::assertTrue(LectureMail::depuisBrut('1', $brut('Auto-Submitted: auto-replied'))->automatique);
        self::assertTrue(LectureMail::depuisBrut('1', $brut('Precedence: bulk'))->automatique);
        self::assertTrue(LectureMail::depuisBrut('1', $brut('X-Autoreply: yes'))->automatique);
        self::assertTrue(LectureMail::depuisBrut('1', $brut('Return-Path: <>'))->automatique);
        self::assertFalse(LectureMail::depuisBrut('1', $brut('Auto-Submitted: no'))->automatique);
        self::assertFalse(LectureMail::depuisBrut('1', $brut('Return-Path: <marie@exemple.fr>'))->automatique);
    }

    public function testBoiteNonConfiguree(): void
    {
        self::assertFalse((new BoiteImap('', 993, 'ssl', '', '', 'INBOX'))->estConfiguree());
    }

    public function testRelevePourDeVraiSurUnServeurImap(): void
    {
        $hote = (string) getenv('IMAP_TEST_HOTE');
        if ($hote === '') {
            self::markTestSkipped('Serveur IMAP de test absent (IMAP_TEST_HOTE).');
        }
        $portSmtp = (int) (getenv('IMAP_TEST_PORT_SMTP') ?: 3025);
        $portImap = (int) (getenv('IMAP_TEST_PORT') ?: 3143);
        // Une boîte neuve à chaque passage : GreenMail crée le compte au premier mail reçu.
        $utilisateur = 'reponses' . bin2hex(random_bytes(4));
        $adresse = "{$utilisateur}@exemple.test";

        $this->envoyerParSmtp($hote, $portSmtp, $adresse, implode("\r\n", [
            'From: Marie <marie@exemple.fr>',
            "To: {$adresse}",
            'Subject: Re: Devis [fil:2026-014-abcd]',
            'Message-ID: <reel-1@exemple.fr>',
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit',
            '',
            'Réponse reçue pour de vrai.',
        ]));
        $this->envoyerParSmtp($hote, $portSmtp, $adresse, implode("\r\n", [
            'From: autre@exemple.fr',
            "To: {$adresse}",
            'Subject: Deuxième',
            '',
            'Un mail plus gros : ' . str_repeat('x', 100_000),
        ]));

        // GreenMail : le mot de passe est libre à la création automatique du compte, il prend l'adresse complète comme identifiant.
        $boite = new BoiteImap($hote, $portImap, 'aucun', $adresse, $adresse, 'INBOX');
        $mails = $boite->nonLus(10);

        self::assertCount(2, $mails);
        self::assertSame('marie@exemple.fr', $mails[0]->expediteur);
        self::assertSame('Re: Devis [fil:2026-014-abcd]', $mails[0]->sujet);
        self::assertSame('Réponse reçue pour de vrai.', trim($mails[0]->texte));
        self::assertGreaterThan(100_000, strlen($mails[1]->texte), 'Le contenu annoncé par {n} est lu en entier.');

        // Lire ne marque pas comme lu ; seul marquerLu le fait.
        $relue = new BoiteImap($hote, $portImap, 'aucun', $adresse, $adresse, 'INBOX');
        self::assertCount(2, $relue->nonLus(10));
        $relue->marquerLu($mails[0]);
        self::assertSame('Deuxième', (new BoiteImap($hote, $portImap, 'aucun', $adresse, $adresse, 'INBOX'))->nonLus(10)[0]->sujet);
        self::assertCount(1, (new BoiteImap($hote, $portImap, 'aucun', $adresse, $adresse, 'INBOX'))->nonLus(10));
    }

    public function testMauvaisIdentifiantsSansFuiteDuMotDePasse(): void
    {
        $hote = (string) getenv('IMAP_TEST_HOTE');
        if ($hote === '') {
            self::markTestSkipped('Serveur IMAP de test absent (IMAP_TEST_HOTE).');
        }
        $client = new ClientImap($hote, (int) (getenv('IMAP_TEST_PORT') ?: 3143), 'aucun');
        try {
            $client->ouvrir('inconnu@exemple.test', 'mot-de-passe-secret', 'INBOX');
            self::fail('Connexion acceptée.');
        } catch (\RuntimeException $e) {
            self::assertStringNotContainsString('mot-de-passe-secret', $e->getMessage());
        }
    }

    private function envoyerParSmtp(string $hote, int $port, string $a, string $mail): void
    {
        $flux = stream_socket_client("tcp://{$hote}:{$port}", $code, $erreur, 10);
        self::assertNotFalse($flux, "SMTP de test : {$erreur}");
        $lire = static function () use ($flux): void {
            do {
                $ligne = (string) fgets($flux);
            } while (isset($ligne[3]) && $ligne[3] === '-');
        };
        $lire();
        foreach (['HELO test', 'MAIL FROM:<test@exemple.test>', "RCPT TO:<{$a}>", 'DATA'] as $commande) {
            fwrite($flux, "{$commande}\r\n");
            $lire();
        }
        fwrite($flux, "{$mail}\r\n.\r\n");
        $lire();
        fwrite($flux, "QUIT\r\n");
        fclose($flux);
    }
}
