<?php

declare(strict_types=1);

namespace App\Tests\Auth\Infrastructure;

use App\Auth\Application\OuvrirCompte;
use App\Tests\AvecBaseDeDonnees;
use Psr\Cache\CacheItemPoolInterface;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\BrowserKit\Cookie;
use Symfony\Component\Mime\Email;

/**
 * Tests fonctionnels du module Auth : HTTP → cas d'usage → MySQL → mails, avec le vrai cookie de session.
 * Ignorés si aucune base MySQL n'est joignable.
 */
final class AuthHttpTest extends WebTestCase
{
    use AvecBaseDeDonnees;

    private const COOKIE = 'bsandoz_session';
    private const FIREFOX = 'Mozilla/5.0 (X11; Linux x86_64; rv:132.0) Gecko/20100101 Firefox/132.0';

    private KernelBrowser $client;

    protected function setUp(): void
    {
        $this->client = static::createClient([], ['HTTP_USER_AGENT' => self::FIREFOX]);
        $this->preparerLaBase();
        // Compteurs d'essais remis à zéro : chaque test part d'un état propre.
        $compteurs = static::getContainer()->get('cache.rate_limiter');
        \assert($compteurs instanceof CacheItemPoolInterface);
        $compteurs->clear();
    }

    /** @param array<string, mixed> $corps */
    private function post(string $url, array $corps = []): void
    {
        $this->client->request('POST', $url, server: ['CONTENT_TYPE' => 'application/json'], content: json_encode($corps, \JSON_THROW_ON_ERROR));
    }

    /** @return array<string, mixed> */
    private function reponse(): array
    {
        return json_decode((string) $this->client->getResponse()->getContent(), true, 8, \JSON_THROW_ON_ERROR);
    }

    /** Secret du lien contenu dans le dernier mail envoyé pendant la dernière requête. */
    private function jetonDuMail(): string
    {
        $mails = self::getMailerMessages();
        self::assertNotEmpty($mails, 'Un mail aurait dû partir.');
        $dernier = end($mails);
        \assert($dernier instanceof Email);
        self::assertSame(1, preg_match('/jeton=([a-f0-9]{64})/', (string) $dernier->getTextBody(), $trouve), 'Le mail doit contenir un lien.');

        return $trouve[1];
    }

    private function ouvrirCompte(string $email = 'marie@exemple.fr'): void
    {
        $ouvrir = static::getContainer()->get(OuvrirCompte::class);
        \assert($ouvrir instanceof OuvrirCompte);
        $ouvrir($email, 'Marie Dupont');
    }

    /** Compte activé avec un mot de passe ; le navigateur de test reste déconnecté. */
    private function compteAvecMotDePasse(string $motDePasse = 'une phrase de passe'): void
    {
        $this->ouvrirCompte();
        $this->post('/auth/lien', ['email' => 'marie@exemple.fr', 'usage' => 'mot_de_passe']);
        $this->post('/auth/mot-de-passe', ['jeton' => $this->jetonDuMail(), 'motDePasse' => $motDePasse]);
        self::assertResponseStatusCodeSame(204);
        $this->client->getCookieJar()->clear();
    }

    private function cookieDeSession(): ?Cookie
    {
        return $this->client->getCookieJar()->get(self::COOKIE);
    }

    public function testParcoursDActivationPuisSessionOuverte(): void
    {
        $this->ouvrirCompte();
        $jeton = $this->jetonDuMail();

        $this->post('/auth/lien/utiliser', ['jeton' => $jeton]);

        self::assertResponseIsSuccessful();
        self::assertSame('actif', $this->reponse()['compte']['statut']);
        self::assertResponseHeaderSame('cache-control', 'no-store, private');
        $cookie = $this->client->getResponse()->headers->getCookies()[0];
        self::assertSame(self::COOKIE, $cookie->getName());
        self::assertTrue($cookie->isHttpOnly());
        self::assertSame('lax', $cookie->getSameSite());
        self::assertSame(64, strlen((string) $cookie->getValue()));

        $this->client->request('GET', '/auth/moi');
        self::assertResponseIsSuccessful();
        self::assertSame(['id', 'email', 'nom', 'statut', 'motDePasse', 'motDePasseModifieLe'], array_keys($this->reponse()['compte']));
        self::assertSame('marie@exemple.fr', $this->reponse()['compte']['email']);
    }

    public function testLeMailDActivationMeneAuSite(): void
    {
        $this->ouvrirCompte();

        $mail = self::getMailerMessage();
        \assert($mail instanceof Email);
        self::assertSame('Votre espace client est prêt', $mail->getSubject());
        self::assertStringContainsString('http://localhost:5173/mon-espace/lien?jeton=', (string) $mail->getTextBody());
    }

    public function testNonConnecte(): void
    {
        $this->client->request('GET', '/auth/moi');
        self::assertResponseStatusCodeSame(401);

        $this->client->getCookieJar()->set(new Cookie(self::COOKIE, str_repeat('a', 64)));
        $this->client->request('GET', '/auth/moi');
        self::assertResponseStatusCodeSame(401);
    }

    public function testUnLienNeSertQuUneFoisEtUnLienInconnuEstRefuse(): void
    {
        $this->ouvrirCompte();
        $jeton = $this->jetonDuMail();
        $this->post('/auth/lien/utiliser', ['jeton' => $jeton]);
        self::assertResponseIsSuccessful();

        $this->post('/auth/lien/utiliser', ['jeton' => $jeton]);
        self::assertResponseStatusCodeSame(410);
        $this->post('/auth/lien/utiliser', ['jeton' => str_repeat('0', 64)]);
        self::assertResponseStatusCodeSame(410);
    }

    public function testDemanderUnLienNeRevelePasSiLAdresseAUnCompte(): void
    {
        $this->ouvrirCompte();
        // Une requête neutre : la suivante repart d'un noyau neuf, sans le mail d'activation déjà envoyé.
        $this->client->request('GET', '/sante');

        $this->post('/auth/lien', ['email' => 'inconnu@exemple.fr', 'usage' => 'connexion']);
        self::assertResponseStatusCodeSame(202);
        self::assertEmailCount(0);

        $this->post('/auth/lien', ['email' => 'Marie@Exemple.fr', 'usage' => 'connexion']);
        self::assertResponseStatusCodeSame(202);
        self::assertEmailCount(1);
        self::assertSame($this->reponse(), ['ok' => true]);
    }

    public function testUsageDeLienInconnu(): void
    {
        $this->post('/auth/lien', ['email' => 'marie@exemple.fr', 'usage' => 'activation']);
        self::assertResponseStatusCodeSame(400);
        $this->post('/auth/lien', ['email' => 'pas-une-adresse', 'usage' => 'connexion']);
        self::assertResponseStatusCodeSame(400);
        self::assertArrayHasKey('email', $this->reponse()['erreurs']);
    }

    public function testMotDePasseConnexionEtMailDeConfirmation(): void
    {
        $this->ouvrirCompte();
        $this->post('/auth/lien', ['email' => 'marie@exemple.fr', 'usage' => 'mot_de_passe']);
        $jeton = $this->jetonDuMail();

        $this->post('/auth/mot-de-passe', ['jeton' => $jeton, 'motDePasse' => 'court']);
        self::assertResponseStatusCodeSame(400);
        self::assertArrayHasKey('motDePasse', $this->reponse()['erreurs']);

        $this->post('/auth/mot-de-passe', ['jeton' => $jeton, 'motDePasse' => 'une phrase de passe']);
        self::assertResponseStatusCodeSame(204);
        $mail = self::getMailerMessage();
        \assert($mail instanceof Email);
        self::assertSame('Votre mot de passe a été modifié', $mail->getSubject());

        $this->post('/auth/connexion', ['email' => 'marie@exemple.fr', 'motDePasse' => 'mauvais mot de passe']);
        self::assertResponseStatusCodeSame(401);
        self::assertSame('E-mail ou mot de passe incorrect.', $this->reponse()['erreur']);

        $this->post('/auth/connexion', ['email' => 'marie@exemple.fr', 'motDePasse' => 'une phrase de passe']);
        self::assertResponseIsSuccessful();
        self::assertTrue($this->reponse()['compte']['motDePasse']);
        self::assertNotNull($this->cookieDeSession());
    }

    public function testTropDEssaisDeConnexion(): void
    {
        $this->compteAvecMotDePasse();
        $this->client->disableReboot(); // garde le compteur d'essais en mémoire entre les requêtes

        for ($i = 0; $i < 5; ++$i) {
            $this->post('/auth/connexion', ['email' => 'marie@exemple.fr', 'motDePasse' => "essai {$i} raté"]);
            self::assertResponseStatusCodeSame(401);
        }
        $this->post('/auth/connexion', ['email' => 'marie@exemple.fr', 'motDePasse' => 'une phrase de passe']);
        self::assertResponseStatusCodeSame(429);
    }

    public function testCorpsJsonExige(): void
    {
        $this->client->request('POST', '/auth/connexion', ['email' => 'marie@exemple.fr', 'motDePasse' => 'x']);
        self::assertResponseStatusCodeSame(415);
        $this->client->request('POST', '/auth/deconnexion');
        self::assertResponseStatusCodeSame(415);
    }

    public function testAppareilsConnectesEtDeconnexionDesAutres(): void
    {
        $this->compteAvecMotDePasse();
        $this->post('/auth/connexion', ['email' => 'marie@exemple.fr', 'motDePasse' => 'une phrase de passe']);
        $autreAppareil = $this->cookieDeSession();
        \assert($autreAppareil instanceof Cookie);
        $this->client->getCookieJar()->clear();
        $this->client->setServerParameter('HTTP_USER_AGENT', 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/130.0 Mobile Safari/537.36');
        $this->post('/auth/connexion', ['email' => 'marie@exemple.fr', 'motDePasse' => 'une phrase de passe']);

        $this->client->request('GET', '/auth/appareils');
        $appareils = $this->reponse()['appareils'];
        self::assertCount(2, $appareils);
        $noms = array_column($appareils, 'appareil');
        sort($noms);
        self::assertSame(['Chrome sur Android', 'Firefox sur Linux'], $noms);
        self::assertSame([true], array_values(array_filter(array_column($appareils, 'courant'))));

        $this->post('/auth/appareils/deconnecter-les-autres');
        self::assertSame(['deconnectes' => 1], $this->reponse());
        $this->client->request('GET', '/auth/moi');
        self::assertResponseIsSuccessful();

        $this->client->getCookieJar()->set($autreAppareil);
        $this->client->request('GET', '/auth/moi');
        self::assertResponseStatusCodeSame(401);
    }

    public function testDeconnexion(): void
    {
        $this->compteAvecMotDePasse();
        $this->post('/auth/connexion', ['email' => 'marie@exemple.fr', 'motDePasse' => 'une phrase de passe']);
        $cookie = $this->cookieDeSession();
        \assert($cookie instanceof Cookie);

        $this->post('/auth/deconnexion');
        self::assertResponseStatusCodeSame(204);
        self::assertNull($this->cookieDeSession(), 'Le cookie est effacé.');

        // Même en renvoyant l'ancien cookie, la session est fermée côté serveur.
        $this->client->getCookieJar()->set($cookie);
        $this->client->request('GET', '/auth/moi');
        self::assertResponseStatusCodeSame(401);
    }

    public function testChangerLeMotDePasseDeconnecteTousLesAppareils(): void
    {
        $this->compteAvecMotDePasse();
        $this->post('/auth/connexion', ['email' => 'marie@exemple.fr', 'motDePasse' => 'une phrase de passe']);
        $cookie = $this->cookieDeSession();
        \assert($cookie instanceof Cookie);

        $this->post('/auth/lien', ['email' => 'marie@exemple.fr', 'usage' => 'mot_de_passe']);
        $this->post('/auth/mot-de-passe', ['jeton' => $this->jetonDuMail(), 'motDePasse' => 'une autre phrase de passe']);

        $this->client->getCookieJar()->set($cookie);
        $this->client->request('GET', '/auth/moi');
        self::assertResponseStatusCodeSame(401);
    }

    public function testCorsAvecCookiesPourLeSiteSeulement(): void
    {
        $this->client->request('OPTIONS', '/auth/connexion', server: [
            'HTTP_ORIGIN' => 'http://localhost:5173',
            'HTTP_ACCESS_CONTROL_REQUEST_METHOD' => 'POST',
            'HTTP_ACCESS_CONTROL_REQUEST_HEADERS' => 'content-type',
        ]);
        self::assertResponseHeaderSame('access-control-allow-origin', 'http://localhost:5173');
        self::assertResponseHeaderSame('access-control-allow-credentials', 'true');

        $this->client->request('OPTIONS', '/auth/connexion', server: [
            'HTTP_ORIGIN' => 'https://site-malveillant.example',
            'HTTP_ACCESS_CONTROL_REQUEST_METHOD' => 'POST',
            'HTTP_ACCESS_CONTROL_REQUEST_HEADERS' => 'content-type',
        ]);
        self::assertResponseNotHasHeader('access-control-allow-origin');
    }
}
