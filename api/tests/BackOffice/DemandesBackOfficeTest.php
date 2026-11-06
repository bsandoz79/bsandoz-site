<?php

declare(strict_types=1);

namespace App\Tests\BackOffice;

use App\Auth\Application\OuvrirCompte;
use App\Tests\AvecBaseDeDonnees;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\Console\Tester\CommandTester;
use Symfony\Component\Mime\Email;

/** Back-office de bout en bout sur MySQL : droits, statut, devis, messages. BACKOFFICE_EMAILS vaut admin@exemple.fr en test. */
final class DemandesBackOfficeTest extends WebTestCase
{
    use AvecBaseDeDonnees;

    private KernelBrowser $client;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->preparerLaBase();
    }

    /** @param array<string, mixed> $corps */
    private function poster(string $chemin, array $corps = []): void
    {
        $this->client->request('POST', $chemin, server: ['CONTENT_TYPE' => 'application/json'], content: json_encode($corps, \JSON_THROW_ON_ERROR));
    }

    /** @return array<string, mixed> */
    private function reponse(): array
    {
        return json_decode((string) $this->client->getResponse()->getContent(), true, 16, \JSON_THROW_ON_ERROR);
    }

    private function seConnecter(string $email): void
    {
        $ouvrir = static::getContainer()->get(OuvrirCompte::class);
        \assert($ouvrir instanceof OuvrirCompte);
        $ouvrir($email, 'Personne');
        $mails = array_filter(self::getMailerMessages(), static fn ($m) => $m instanceof Email && $m->getTo()[0]->getAddress() === $email);
        self::assertNotEmpty($mails);
        $dernier = end($mails);
        \assert($dernier instanceof Email);
        preg_match('/jeton=([a-f0-9]{64})/', (string) $dernier->getTextBody(), $trouve);
        $this->poster('/auth/lien/utiliser', ['jeton' => $trouve[1]]);
        self::assertResponseIsSuccessful();
    }

    /** Une demande reçue, et l'administrateur connecté. */
    private function demandeEtAdmin(): string
    {
        $this->client->request('POST', '/demandes', [
            'nom' => 'Marie Dupont',
            'email' => 'marie@exemple.fr',
            'telephone' => '06 12 34 56 78',
            'entreprise' => 'Dupont Jardins',
            'titre' => 'Site Fonctionnel',
            'recapitulatif' => "Activité : Paysagiste\nBesoins : Prendre des rendez-vous",
            'predevis' => 'Prix estimé : 1 320 € à 1 530 €',
            'site_web' => '',
        ]);
        self::assertResponseIsSuccessful();
        $this->seConnecter('admin@exemple.fr');
        $this->client->request('GET', '/backoffice/demandes');
        self::assertResponseIsSuccessful();

        return $this->reponse()['demandes'][0]['id'];
    }

    private function etablirDevis(string $id): void
    {
        $this->poster("/backoffice/demandes/{$id}/devis", ['lignes' => [['libelle' => 'Site fonctionnel', 'prix' => 989], ['libelle' => 'Rendez-vous', 'prix' => 400]]]);
        self::assertResponseIsSuccessful();
    }

    /** @return iterable<string, array{string, string}> */
    public static function adresses(): iterable
    {
        yield 'liste' => ['GET', '/backoffice/demandes'];
        yield 'détail' => ['GET', '/backoffice/demandes/x'];
        yield 'statut' => ['POST', '/backoffice/demandes/x/statut'];
        yield 'devis' => ['POST', '/backoffice/demandes/x/devis'];
        yield 'message' => ['POST', '/backoffice/demandes/x/messages'];
    }

    #[\PHPUnit\Framework\Attributes\DataProvider('adresses')]
    public function testSansSessionPersonneNEntre(string $methode, string $chemin): void
    {
        $this->client->request($methode, $chemin, server: ['CONTENT_TYPE' => 'application/json'], content: '{}');

        self::assertResponseStatusCodeSame(401);
    }

    #[\PHPUnit\Framework\Attributes\DataProvider('adresses')]
    public function testUnClientConnecteNEntrePas(string $methode, string $chemin): void
    {
        $this->seConnecter('marie@exemple.fr');

        $this->client->request($methode, $chemin, server: ['CONTENT_TYPE' => 'application/json'], content: '{}');

        self::assertResponseStatusCodeSame(403);
    }

    public function testModifierExigeUnCorpsJson(): void
    {
        $id = $this->demandeEtAdmin();

        $this->client->request('POST', "/backoffice/demandes/{$id}/statut", ['statut' => 'en_etude']);

        self::assertResponseStatusCodeSame(415);
    }

    public function testVoirLaListeEtLeDetail(): void
    {
        $id = $this->demandeEtAdmin();

        $this->client->request('GET', '/backoffice/demandes');
        $ligne = $this->reponse()['demandes'][0];
        self::assertSame('Marie Dupont', $ligne['nom']);
        self::assertSame('Reçue', $ligne['statutLibelle']);

        $this->client->request('GET', "/backoffice/demandes/{$id}");
        $demande = $this->reponse()['demande'];
        self::assertSame('marie@exemple.fr', $demande['demandeur']['email']);
        self::assertStringContainsString('Paysagiste', $demande['recapitulatif']);
        self::assertSame('Prix estimé : 1 320 € à 1 530 €', $demande['predevis']);
        self::assertCount(6, $demande['statuts']);

        $this->client->request('GET', '/backoffice/demandes/inconnue');
        self::assertResponseStatusCodeSame(404);
    }

    public function testLesReglesDuStatut(): void
    {
        $id = $this->demandeEtAdmin();

        $this->poster("/backoffice/demandes/{$id}/statut", ['statut' => 'en_etude']);
        self::assertResponseIsSuccessful();
        self::assertSame('en_etude', $this->reponse()['demande']['statut']);

        $this->poster("/backoffice/demandes/{$id}/statut", ['statut' => 'nimporte_quoi']);
        self::assertResponseStatusCodeSame(400);

        $this->poster("/backoffice/demandes/{$id}/statut", ['statut' => 'devis_envoye']);
        self::assertResponseStatusCodeSame(409, 'Pas de « Devis envoyé » sans devis.');

        $this->etablirDevis($id);
        $this->poster("/backoffice/demandes/{$id}/statut", ['statut' => 'en_cours']);
        self::assertResponseStatusCodeSame(409, 'Pas « En cours » sans acceptation du client.');
    }

    public function testDuDevisALaLivraison(): void
    {
        $id = $this->demandeEtAdmin();

        $this->etablirDevis($id);
        $demande = $this->reponse()['demande'];
        self::assertSame('devis_envoye', $demande['statut']);
        self::assertSame(1389, $demande['devis']['total']);
        $mails = array_values(array_filter(self::getMailerMessages(), static fn ($m) => $m instanceof Email));
        self::assertStringContainsString('est prêt', (string) end($mails)->getSubject());
        self::assertSame('marie@exemple.fr', end($mails)->getTo()[0]->getAddress());

        $this->poster("/backoffice/demandes/{$id}/devis", ['lignes' => [['libelle' => 'Autre', 'prix' => 1]]]);
        self::assertResponseStatusCodeSame(409, 'Un seul devis par demande.');

        // Le client accepte depuis son espace.
        $this->client->getCookieJar()->clear();
        $this->seConnecterParLien('marie@exemple.fr');
        $this->poster("/espace/demandes/{$id}/devis/accepter");
        self::assertResponseIsSuccessful();

        $this->client->getCookieJar()->clear();
        $this->seConnecterParLien('admin@exemple.fr');
        $this->poster("/backoffice/demandes/{$id}/statut", ['statut' => 'en_etude']);
        self::assertResponseStatusCodeSame(409, 'Une acceptation ne s’efface pas.');
        $this->poster("/backoffice/demandes/{$id}/statut", ['statut' => 'livree']);
        self::assertResponseIsSuccessful();
        self::assertSame('livree', $this->reponse()['demande']['statut']);
    }

    private function seConnecterParLien(string $email): void
    {
        $this->poster('/auth/lien', ['email' => $email, 'usage' => 'connexion']);
        $mails = array_values(array_filter(self::getMailerMessages(), static fn ($m) => $m instanceof Email));
        preg_match('/jeton=([a-f0-9]{64})/', (string) end($mails)->getTextBody(), $trouve);
        $this->poster('/auth/lien/utiliser', ['jeton' => $trouve[1]]);
        self::assertResponseIsSuccessful();
    }

    public function testDevisInvalideRefuse(): void
    {
        $id = $this->demandeEtAdmin();

        foreach ([['lignes' => []], ['lignes' => [['libelle' => '', 'prix' => 10]]], ['lignes' => [['libelle' => 'A', 'prix' => 'cher']]], ['lignes' => [['libelle' => 'A', 'prix' => -1]]], []] as $corps) {
            $this->poster("/backoffice/demandes/{$id}/devis", $corps);
            self::assertResponseStatusCodeSame(400);
        }
        $this->poster('/backoffice/demandes/inconnue/devis', ['lignes' => [['libelle' => 'A', 'prix' => 1]]]);
        self::assertResponseStatusCodeSame(404);
    }

    public function testRepondreEtNoterUnAppel(): void
    {
        $id = $this->demandeEtAdmin();

        $this->poster("/backoffice/demandes/{$id}/messages", ['corps' => 'Bonjour Marie, je vous rappelle demain.']);
        self::assertResponseIsSuccessful();
        self::assertEmailCount(1);
        $mail = self::getMailerMessage();
        self::assertInstanceOf(Email::class, $mail);
        self::assertSame('marie@exemple.fr', $mail->getTo()[0]->getAddress());

        $this->poster("/backoffice/demandes/{$id}/messages", ['corps' => 'Appel : préfère une visio.', 'note' => true]);
        self::assertResponseIsSuccessful();
        self::assertEmailCount(0);
        $messages = $this->reponse()['demande']['messages'];
        self::assertSame(['site', 'note'], array_column($messages, 'origine'));
        self::assertSame(['professionnel', 'professionnel'], array_column($messages, 'auteur'));

        $this->poster("/backoffice/demandes/{$id}/messages", ['corps' => '  ']);
        self::assertResponseStatusCodeSame(400);
    }

    public function testOuvrirUnAccesSeulementPourUneAdresseAutorisee(): void
    {
        $commande = (new Application(self::$kernel))->find('backoffice:ouvrir-acces');
        $testeur = new CommandTester($commande);

        self::assertSame(1, $testeur->execute(['email' => 'pirate@exemple.fr', 'nom' => 'Pirate']));
        self::assertEmailCount(0);

        self::assertSame(0, $testeur->execute(['email' => 'ADMIN@exemple.fr', 'nom' => 'Baptiste Sandoz']));
        self::assertEmailCount(1);
    }
}
