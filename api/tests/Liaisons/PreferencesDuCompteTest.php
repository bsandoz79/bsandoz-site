<?php

declare(strict_types=1);

namespace App\Tests\Liaisons;

use App\Auth\Application\OuvrirCompte;
use App\Auth\Domain\Comptes;
use App\Tests\AvecBaseDeDonnees;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\Console\Tester\CommandTester;
use Symfony\Component\Mime\Email;

/** La case « Rappels et notifications par mail » de l'espace client agit vraiment, de bout en bout sur MySQL. */
final class PreferencesDuCompteTest extends WebTestCase
{
    use AvecBaseDeDonnees;

    private KernelBrowser $client;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->preparerLaBase();
    }

    private function json(string $chemin, array $corps): void
    {
        $this->client->request('POST', $chemin, server: ['CONTENT_TYPE' => 'application/json'], content: json_encode($corps, \JSON_THROW_ON_ERROR));
    }

    private function jeton(): string
    {
        $mails = array_values(array_filter(self::getMailerMessages(), static fn ($m) => $m instanceof Email));
        preg_match('/jeton=([a-f0-9]{64})/', (string) end($mails)->getTextBody(), $trouve);

        return $trouve[1];
    }

    private function seConnecter(string $email): void
    {
        $this->json('/auth/lien', ['email' => $email, 'usage' => 'connexion']);
        self::assertResponseStatusCodeSame(202);
        $this->json('/auth/lien/utiliser', ['jeton' => $this->jeton()]);
        self::assertResponseIsSuccessful();
    }

    private function refuserLesNotifications(): void
    {
        $this->seConnecter('marie@exemple.fr');
        $this->json('/auth/compte', ['nom' => 'Marie Dupont', 'entreprise' => '', 'telephone' => '', 'adresse' => '', 'notifications' => false]);
        self::assertResponseIsSuccessful();
        $compte = static::getContainer()->get(Comptes::class);
        \assert($compte instanceof Comptes);
        self::assertFalse($compte->parEmail('marie@exemple.fr')?->notificationsParMail());
    }

    private function reserverDemain(string $heure = '09:00'): void
    {
        // Demain doit être un jour travaillé : la règle de disponibilité est réglée pour tous les jours.
        $regle = ['joursTravailles' => [0, 1, 2, 3, 4, 5, 6], 'creneaux' => ['09:00', '10:30'], 'joursFermes' => []];
        $reglages = static::getContainer()->get(\App\Booking\Application\ModifierDisponibilites::class);
        \assert($reglages instanceof \App\Booking\Application\ModifierDisponibilites);
        $reglages($regle['joursTravailles'], $regle['creneaux'], $regle['joursFermes']);
        $jour = (new \DateTimeImmutable('tomorrow', new \DateTimeZone('Europe/Paris')))->format('Y-m-d');
        $this->json('/rendez-vous', ['lieu' => 'visio', 'adresse' => '', 'jour' => $jour, 'creneau' => $heure, 'nom' => 'Marie Dupont', 'email' => 'marie@exemple.fr', 'telephone' => '0612345678', 'activite' => 'Paysagiste', 'message' => '']);
        self::assertResponseStatusCodeSame(201);
    }

    private function rappels(): CommandTester
    {
        $testeur = new CommandTester((new Application(self::$kernel))->find('booking:envoyer-rappels'));
        self::assertSame(0, $testeur->execute([]));

        return $testeur;
    }

    public function testLeRappelPartEtContientLeLienPourAnnuler(): void
    {
        $this->reserverDemain();
        $testeur = $this->rappels();

        self::assertStringContainsString('1 rappel(s) envoyé(s)', $testeur->getDisplay());
        $mails = array_values(array_filter(self::getMailerMessages(), static fn ($m) => $m instanceof Email));
        $rappel = end($mails);
        self::assertSame('marie@exemple.fr', $rappel->getTo()[0]->getAddress());
        self::assertStringContainsString('demain', (string) $rappel->getSubject());
        self::assertMatchesRegularExpression('#/rendez-vous/[a-f0-9]{64}#', (string) $rappel->getTextBody());

        self::assertStringContainsString('0 rappel(s) envoyé(s)', $this->rappels()->getDisplay(), 'Pas deux fois.');
    }

    public function testCaseDecocheePasDeRappel(): void
    {
        $this->reserverDemain();
        $this->refuserLesNotifications();

        self::assertStringContainsString('0 rappel(s) envoyé(s), 1 refusé(s)', $this->rappels()->getDisplay());
    }

    public function testCaseDecocheePasDeMailDeMessageMaisLeFilResteAJour(): void
    {
        $this->client->request('POST', '/demandes', ['nom' => 'Marie Dupont', 'email' => 'marie@exemple.fr', 'telephone' => '', 'entreprise' => '', 'titre' => 'Site', 'recapitulatif' => 'Un récapitulatif assez long pour passer.', 'predevis' => '', 'site_web' => '']);
        self::assertResponseIsSuccessful();
        $this->refuserLesNotifications();
        $this->client->request('GET', '/espace/demandes');
        $id = json_decode((string) $this->client->getResponse()->getContent(), true)['demandes'][0]['id'];

        // Le professionnel écrit : le client ne reçoit pas de mail, mais voit le message dans son espace.
        $this->client->getCookieJar()->clear();
        $ouvrir = static::getContainer()->get(OuvrirCompte::class);
        \assert($ouvrir instanceof OuvrirCompte);
        $ouvrir('admin@exemple.fr', 'Admin');
        $this->json('/auth/lien/utiliser', ['jeton' => $this->jeton()]);
        self::assertResponseIsSuccessful();
        $this->json("/backoffice/demandes/{$id}/messages", ['corps' => 'Bonjour Marie']);
        self::assertResponseIsSuccessful();
        self::assertEmailCount(0);
        self::assertCount(1, json_decode((string) $this->client->getResponse()->getContent(), true)['demande']['messages']);

        // Le client écrit : le professionnel, lui, est toujours prévenu.
        $this->client->getCookieJar()->clear();
        $this->seConnecter('marie@exemple.fr');
        $this->json("/espace/demandes/{$id}/messages", ['corps' => 'Merci']);
        self::assertResponseStatusCodeSame(201);
        self::assertEmailCount(1);
    }
}
