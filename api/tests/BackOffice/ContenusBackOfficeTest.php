<?php

declare(strict_types=1);

namespace App\Tests\BackOffice;

use App\Auth\Application\OuvrirCompte;
use App\Tests\AvecBaseDeDonnees;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\Mime\Email;

final class ContenusBackOfficeTest extends WebTestCase
{
    use AvecBaseDeDonnees;

    private const PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

    private KernelBrowser $client;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->preparerLaBase();
    }

    private function poster(string $adresse, array $corps): void
    {
        $this->client->request('POST', $adresse, server: ['CONTENT_TYPE' => 'application/json'], content: json_encode($corps, \JSON_THROW_ON_ERROR));
    }

    private function seConnecter(string $email): void
    {
        $ouvrir = static::getContainer()->get(OuvrirCompte::class);
        \assert($ouvrir instanceof OuvrirCompte);
        $ouvrir($email, 'Personne');
        $mail = self::getMailerMessage();
        \assert($mail instanceof Email);
        preg_match('/jeton=([a-f0-9]{64})/', (string) $mail->getTextBody(), $trouve);
        $this->client->request('POST', '/auth/lien/utiliser', server: ['CONTENT_TYPE' => 'application/json'], content: json_encode(['jeton' => $trouve[1]]));
        self::assertResponseIsSuccessful();
    }

    private function contenusPublics(): string
    {
        $this->client->request('GET', '/contenus');
        self::assertResponseIsSuccessful();

        return (string) $this->client->getResponse()->getContent();
    }

    public function testSansModificationRienNEstRemplace(): void
    {
        self::assertSame('{"contenus":{}}', $this->contenusPublics());
    }

    public function testPersonneNeModifieSansDroit(): void
    {
        $this->poster('/backoffice/contenus', ['contenus' => ['a.b' => 'x']]);
        self::assertResponseStatusCodeSame(401);
        $this->poster('/backoffice/images', ['image' => self::PNG]);
        self::assertResponseStatusCodeSame(401);

        $this->seConnecter('marie@exemple.fr');
        $this->poster('/backoffice/contenus', ['contenus' => ['a.b' => 'x']]);
        self::assertResponseStatusCodeSame(403);
        $this->poster('/backoffice/images', ['image' => self::PNG]);
        self::assertResponseStatusCodeSame(403);

        self::assertSame('{"contenus":{}}', $this->contenusPublics());
    }

    public function testUnEnvoiDeFormulaireEstRefuse(): void
    {
        $this->seConnecter('admin@exemple.fr');
        $this->client->request('POST', '/backoffice/images', ['image' => self::PNG]);
        self::assertResponseStatusCodeSame(415);
    }

    public function testModifieSansToucherAuReste(): void
    {
        $this->seConnecter('admin@exemple.fr');
        $this->poster('/backoffice/contenus', ['contenus' => ['a.b' => 'Un', 'c.d' => 'Deux']]);
        self::assertResponseIsSuccessful();

        $this->poster('/backoffice/contenus', ['contenus' => ['a.b' => 'Changé', 'c.d' => null, 'e.f' => '<script>x</script>']]);
        self::assertResponseIsSuccessful();

        self::assertSame(
            ['a.b' => 'Changé', 'e.f' => '<script>x</script>'],
            json_decode($this->contenusPublics(), true, flags: \JSON_THROW_ON_ERROR)['contenus'],
        );
    }

    public function testToutOuRien(): void
    {
        $this->seConnecter('admin@exemple.fr');
        $this->poster('/backoffice/contenus', ['contenus' => ['a.b' => 'ok', 'cle invalide' => 'x']]);
        self::assertResponseStatusCodeSame(400);
        self::assertSame('{"contenus":{}}', $this->contenusPublics());
    }

    public function testEnvoieUneImageEtDonneSonAdresse(): void
    {
        $this->seConnecter('admin@exemple.fr');
        $this->poster('/backoffice/images', ['image' => self::PNG]);
        self::assertResponseIsSuccessful();
        $url = json_decode((string) $this->client->getResponse()->getContent(), true, flags: \JSON_THROW_ON_ERROR)['url'];
        self::assertMatchesRegularExpression('#/medias/[a-f0-9]{32}\.png$#', $url);

        $fichier = static::getContainer()->getParameter('kernel.project_dir') . '/public/medias/' . basename($url);
        self::assertFileExists($fichier);
        unlink($fichier);

        $this->poster('/backoffice/images', ['image' => base64_encode('<?php echo 1;')]);
        self::assertResponseStatusCodeSame(400);
    }
}
