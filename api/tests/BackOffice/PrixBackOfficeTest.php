<?php

declare(strict_types=1);

namespace App\Tests\BackOffice;

use App\Auth\Application\OuvrirCompte;
use App\Tests\AvecBaseDeDonnees;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\Mime\Email;

final class PrixBackOfficeTest extends WebTestCase
{
    use AvecBaseDeDonnees;

    private KernelBrowser $client;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->preparerLaBase();
    }

    private function poster(array $corps): void
    {
        $this->client->request('POST', '/backoffice/prix', server: ['CONTENT_TYPE' => 'application/json'], content: json_encode($corps, \JSON_THROW_ON_ERROR));
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

    private function prixPublics(): string
    {
        $this->client->request('GET', '/prix');
        self::assertResponseIsSuccessful();

        return (string) $this->client->getResponse()->getContent();
    }

    public function testSansModificationRienNEstRemplace(): void
    {
        self::assertSame('{"prix":{}}', $this->prixPublics(), 'Un objet vide, pas une liste : le site garde ses prix.');
        self::assertStringContainsString('max-age=60', (string) $this->client->getResponse()->headers->get('Cache-Control'));
    }

    public function testPersonneNeModifieSansDroit(): void
    {
        $this->poster(['prix' => ['formule.vitrine' => 1]]);
        self::assertResponseStatusCodeSame(401);

        $this->seConnecter('marie@exemple.fr');
        $this->poster(['prix' => ['formule.vitrine' => 1]]);
        self::assertResponseStatusCodeSame(403);

        self::assertSame('{"prix":{}}', $this->prixPublics());
    }

    public function testLeBackOfficeModifieEtRemetLesPrix(): void
    {
        $this->seConnecter('admin@exemple.fr');

        $this->poster(['prix' => ['formule.vitrine' => 120, 'option.rdv' => 450]]);
        self::assertResponseIsSuccessful();
        self::assertSame(['formule.vitrine' => 120, 'option.rdv' => 450], json_decode($this->prixPublics(), true)['prix']);

        $this->poster(['prix' => ['option.rdv' => 400]]);
        self::assertResponseIsSuccessful();
        self::assertSame(['option.rdv' => 400], json_decode($this->prixPublics(), true)['prix'], 'Le prix retiré reprend sa valeur du code.');

        $this->poster(['prix' => []]);
        self::assertResponseIsSuccessful();
        self::assertSame('{"prix":{}}', $this->prixPublics());
    }

    public function testUnPrixInvalideNeChangeRien(): void
    {
        $this->seConnecter('admin@exemple.fr');
        $this->poster(['prix' => ['formule.vitrine' => 120]]);

        foreach ([['prix' => ['formule.vitrine' => 130, 'option.logo' => -5]], ['prix' => 'non'], []] as $corps) {
            $this->poster($corps);
            self::assertResponseStatusCodeSame(400);
        }

        self::assertSame(['formule.vitrine' => 120], json_decode($this->prixPublics(), true)['prix']);
    }
}
