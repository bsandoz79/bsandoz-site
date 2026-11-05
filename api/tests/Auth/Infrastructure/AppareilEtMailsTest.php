<?php

declare(strict_types=1);

namespace App\Tests\Auth\Infrastructure;

use App\Auth\Domain\Compte;
use App\Auth\Domain\UsageLien;
use App\Auth\Infrastructure\Http\Appareil;
use App\Auth\Infrastructure\Mail\NotificationsCompteParMail;
use App\Auth\Infrastructure\Systeme\AleatoireSysteme;
use App\Auth\Infrastructure\Systeme\HacheurNatif;
use App\Tests\Booking\Infrastructure\MailerEnregistreur;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../../Booking/Infrastructure/NotificationsParMailTest.php';

final class AppareilEtMailsTest extends TestCase
{
    /** @return iterable<string, array{string, string}> */
    public static function userAgents(): iterable
    {
        yield 'Firefox Linux' => ['Mozilla/5.0 (X11; Linux x86_64; rv:132.0) Gecko/20100101 Firefox/132.0', 'Firefox sur Linux'];
        yield 'Chrome Windows' => ['Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36', 'Chrome sur Windows'];
        yield 'Edge Windows' => ['Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 Chrome/130.0 Safari/537.36 Edg/130.0', 'Edge sur Windows'];
        yield 'Safari iPhone' => ['Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1', 'Safari sur iPhone'];
        yield 'Safari Mac' => ['Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15', 'Safari sur Mac'];
        yield 'Chrome Android' => ['Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/130.0 Mobile Safari/537.36', 'Chrome sur Android'];
        yield 'inconnu' => ['curl/8.0', 'Navigateur'];
    }

    #[DataProvider('userAgents')]
    public function testNomDeLAppareil(string $userAgent, string $attendu): void
    {
        self::assertSame($attendu, Appareil::depuisUserAgent($userAgent));
    }

    public function testAucunUserAgent(): void
    {
        self::assertSame('Navigateur', Appareil::depuisUserAgent(null));
    }

    public function testHachageNatif(): void
    {
        $hacheur = new HacheurNatif(rapide: true);
        $hache = $hacheur->hacher('une phrase de passe');

        self::assertNotSame('une phrase de passe', $hache);
        self::assertTrue($hacheur->verifier($hache, 'une phrase de passe'));
        self::assertFalse($hacheur->verifier($hache, 'une autre phrase'));
        self::assertNotSame($hache, $hacheur->hacher('une phrase de passe'), 'Chaque hachage est salé.');
    }

    public function testSecretsAleatoires(): void
    {
        $aleatoire = new AleatoireSysteme();

        self::assertMatchesRegularExpression('/^[a-f0-9]{64}$/', $aleatoire->secret());
        self::assertNotSame($aleatoire->secret(), $aleatoire->secret());
        self::assertMatchesRegularExpression('/^[0-9a-f-]{36}$/', $aleatoire->identifiant());
    }

    /** @return iterable<string, array{UsageLien, string, string}> */
    public static function liens(): iterable
    {
        yield 'activation' => [UsageLien::Activation, 'Votre espace client est prêt', 'https://bsandoz.fr/mon-espace/lien?jeton='];
        yield 'connexion' => [UsageLien::Connexion, 'Votre lien de connexion', 'https://bsandoz.fr/mon-espace/lien?jeton='];
        yield 'mot de passe' => [UsageLien::MotDePasse, 'Choisir un nouveau mot de passe', 'https://bsandoz.fr/mon-espace/mot-de-passe?jeton='];
    }

    #[DataProvider('liens')]
    public function testMailDeLien(UsageLien $usage, string $sujet, string $debutDuLien): void
    {
        $mailer = new MailerEnregistreur();
        $mails = new NotificationsCompteParMail($mailer, 'no-reply@exemple.fr', 'Baptiste Sandoz', 'https://bsandoz.fr/');
        $compte = Compte::ouvrir('c1', 'marie@exemple.fr', 'Marie Dupont', new \DateTimeImmutable());

        $mails->lien($compte, $usage, str_repeat('ab', 32));

        self::assertCount(1, $mailer->envoyes);
        $mail = $mailer->envoyes[0];
        self::assertSame($sujet, $mail->getSubject());
        self::assertSame('marie@exemple.fr', $mail->getTo()[0]->getAddress());
        self::assertSame('no-reply@exemple.fr', $mail->getFrom()[0]->getAddress());
        self::assertStringContainsString($debutDuLien . str_repeat('ab', 32), (string) $mail->getTextBody());
        self::assertStringContainsString('Bonjour Marie Dupont,', (string) $mail->getTextBody());
        self::assertStringContainsString("Si vous n'êtes pas à l'origine de cette demande", (string) $mail->getTextBody());
    }

    public function testMailDeMotDePasseModifie(): void
    {
        $mailer = new MailerEnregistreur();
        $mails = new NotificationsCompteParMail($mailer, 'no-reply@exemple.fr', 'Baptiste Sandoz', 'https://bsandoz.fr');

        $mails->motDePasseModifie(Compte::ouvrir('c1', 'marie@exemple.fr', '', new \DateTimeImmutable()));

        self::assertSame('Votre mot de passe a été modifié', $mailer->envoyes[0]->getSubject());
        self::assertStringStartsWith('Bonjour,', (string) $mailer->envoyes[0]->getTextBody());
    }
}
