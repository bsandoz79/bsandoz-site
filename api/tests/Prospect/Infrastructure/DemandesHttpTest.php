<?php

declare(strict_types=1);

namespace App\Tests\Prospect\Infrastructure;

use App\Auth\Domain\Comptes;
use App\Prospect\Application\EtablirDevis;
use App\Prospect\Domain\Demandes;
use App\Tests\AvecBaseDeDonnees;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Mime\Email;

/**
 * Module Prospect sur MySQL : réception d'une demande (même contrat que devis.php), compte ouvert,
 * puis « Mes demandes » dans l'espace client : suivi, devis accepté, PDF.
 */
final class DemandesHttpTest extends WebTestCase
{
    use AvecBaseDeDonnees;

    private const PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    private KernelBrowser $client;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->preparerLaBase();
    }

    /** @param array<string, string> $champs */
    private function envoyerDemande(array $champs = [], array $fichiers = []): void
    {
        $this->client->request('POST', '/demandes', $champs + [
            'nom' => 'Marie Dupont',
            'email' => 'marie@exemple.fr',
            'telephone' => '06 12 34 56 78',
            'entreprise' => 'Dupont Jardins',
            'titre' => 'Site Fonctionnel · Rendez-vous en ligne',
            'recapitulatif' => "Activité : Paysagiste\nBesoins : Prendre des rendez-vous",
            'predevis' => "Première estimation (indicative)\nPrix estimé : 1 320 € à 1 530 €",
            'site_web' => '',
        ], ['photos' => $fichiers]);
    }

    private function photo(string $contenu, string $nom = 'jardin.png'): UploadedFile
    {
        $chemin = tempnam(sys_get_temp_dir(), 'photo');
        file_put_contents($chemin, $contenu);

        return new UploadedFile($chemin, $nom, null, null, true);
    }

    /** @return array<string, mixed> */
    private function reponse(): array
    {
        return json_decode((string) $this->client->getResponse()->getContent(), true, 16, \JSON_THROW_ON_ERROR);
    }

    /** @return list<Email> */
    private static function mails(): array
    {
        return array_values(array_filter(self::getMailerMessages(), static fn ($m) => $m instanceof Email));
    }

    private function seConnecterAvecLeLienDActivation(): void
    {
        foreach (self::mails() as $mail) {
            if (preg_match('/jeton=([a-f0-9]{64})/', (string) $mail->getTextBody(), $trouve)) {
                $this->client->request('POST', '/auth/lien/utiliser', server: ['CONTENT_TYPE' => 'application/json'], content: json_encode(['jeton' => $trouve[1]]));
                self::assertResponseIsSuccessful();

                return;
            }
        }
        self::fail('Aucun lien d’activation.');
    }

    public function testRecevoirUneDemandeAvecPhoto(): void
    {
        $this->envoyerDemande([], [$this->photo((string) base64_decode(self::PNG))]);

        self::assertResponseIsSuccessful();
        self::assertSame(['ok' => true, 'numero' => date('Y') . '-001'], $this->reponse());

        $mails = self::mails();
        self::assertCount(3, $mails, 'Accusé de réception, demande au professionnel, lien d’activation du compte.');
        [$client, $pro, $activation] = $mails;
        self::assertSame('Votre demande n° ' . date('Y') . '-001 et une première estimation', $client->getSubject());
        self::assertStringContainsString('Prix estimé : 1 320 € à 1 530 €', (string) $client->getTextBody());
        self::assertStringContainsString('http://localhost:5173/mon-espace', (string) $client->getTextBody());
        self::assertSame('contact@bsandoz.fr', $pro->getTo()[0]->getAddress());
        self::assertSame('marie@exemple.fr', $pro->getReplyTo()[0]->getAddress());
        self::assertSame('photo-1.png', $pro->getAttachments()[0]->getFilename());
        self::assertSame('Votre espace client est prêt', $activation->getSubject());

        $comptes = static::getContainer()->get(Comptes::class);
        \assert($comptes instanceof Comptes);
        self::assertNotNull($comptes->parEmail('marie@exemple.fr'), 'Le compte est ouvert à la première demande.');
    }

    public function testLePiegeAntiRobotsNeLaissePasser(): void
    {
        $this->envoyerDemande(['site_web' => 'https://spam.example']);

        self::assertSame(['ok' => true], $this->reponse(), 'Le robot croit avoir réussi…');
        self::assertEmailCount(0);
        $demandes = static::getContainer()->get(Demandes::class);
        \assert($demandes instanceof Demandes);
        self::assertSame(0, $demandes->nombreRecuesEn((int) date('Y')), '… mais rien n’est enregistré.');
    }

    public function testDemandeInvalideEtPhotoRefusee(): void
    {
        $this->envoyerDemande(['email' => 'pas-une-adresse', 'recapitulatif' => 'court']);
        self::assertResponseStatusCodeSame(400);
        self::assertSame(['email', 'recapitulatif'], array_keys($this->reponse()['erreurs']));

        $this->envoyerDemande([], [$this->photo('<?php echo "pas une image";', 'photo.jpg')]);
        self::assertResponseStatusCodeSame(400);
        self::assertArrayHasKey('photos', $this->reponse()['erreurs']);
    }

    public function testTroisDemandesParHeureEtParAdresseIp(): void
    {
        $this->client->disableReboot();
        for ($i = 1; $i <= 3; ++$i) {
            $this->envoyerDemande(['email' => "personne{$i}@exemple.fr"]);
            self::assertResponseIsSuccessful();
        }
        $this->envoyerDemande(['email' => 'personne4@exemple.fr']);
        self::assertResponseStatusCodeSame(429);
    }

    public function testMesDemandesDevisAccepteEtPdf(): void
    {
        $this->envoyerDemande();
        $numero = (string) $this->reponse()['numero'];
        $this->seConnecterAvecLeLienDActivation();

        $this->client->request('GET', '/espace/demandes');
        $demande = $this->reponse()['demandes'][0];
        self::assertSame([$numero, 'Site Fonctionnel · Rendez-vous en ligne', 'recue', null], [$demande['numero'], $demande['titre'], $demande['statut'], $demande['devis']]);
        self::assertSame([true, false, false, false, false, false], array_column($demande['etapes'], 'atteinte'));

        $etablir = static::getContainer()->get(EtablirDevis::class);
        \assert($etablir instanceof EtablirDevis);
        $etablir($demande['id'], [['libelle' => 'Site fonctionnel', 'prix' => 989], ['libelle' => 'Rendez-vous en ligne', 'prix' => 400], ['libelle' => 'Calculateur de prix', 'prix' => 250]]);

        $this->client->request('GET', '/espace/demandes');
        $demande = $this->reponse()['demandes'][0];
        self::assertSame(['devis_envoye', 1639, 'envoye'], [$demande['statut'], $demande['devis']['total'], $demande['devis']['statut']]);

        $this->client->request('GET', "/espace/demandes/{$demande['id']}/devis.pdf");
        self::assertResponseIsSuccessful();
        self::assertResponseHeaderSame('content-type', 'application/pdf');
        self::assertStringStartsWith('%PDF', (string) $this->client->getResponse()->getContent());

        $this->client->request('POST', "/espace/demandes/{$demande['id']}/devis/accepter", server: ['CONTENT_TYPE' => 'application/json'], content: '{}');
        self::assertResponseIsSuccessful();
        self::assertSame(['acceptee', 'accepte'], [$this->reponse()['demande']['statut'], $this->reponse()['demande']['devis']['statut']]);
        self::assertEmailCount(2); // professionnel prévenu, confirmation au client

        $this->client->request('POST', "/espace/demandes/{$demande['id']}/devis/accepter", server: ['CONTENT_TYPE' => 'application/json'], content: '{}');
        self::assertResponseStatusCodeSame(409);
    }

    public function testLaDemandeDUneAutrePersonneEstIntrouvable(): void
    {
        $this->envoyerDemande(['email' => 'paul@exemple.fr', 'nom' => 'Paul']);
        $demandes = static::getContainer()->get(Demandes::class);
        \assert($demandes instanceof Demandes);
        $idDePaul = $demandes->parEmail('paul@exemple.fr')[0]->id;
        $etablir = static::getContainer()->get(EtablirDevis::class);
        \assert($etablir instanceof EtablirDevis);
        $etablir($idDePaul, [['libelle' => 'Site vitrine', 'prix' => 99]]);

        $this->envoyerDemande();
        $this->seConnecterAvecLeLienDActivation();

        $this->client->request('GET', '/espace/demandes');
        self::assertCount(1, $this->reponse()['demandes'], 'Seules ses propres demandes.');
        $this->client->request('GET', "/espace/demandes/{$idDePaul}/devis.pdf");
        self::assertResponseStatusCodeSame(404);
        $this->client->request('POST', "/espace/demandes/{$idDePaul}/devis/accepter", server: ['CONTENT_TYPE' => 'application/json'], content: '{}');
        self::assertResponseStatusCodeSame(404);
    }

    public function testNonConnecte(): void
    {
        $this->client->request('GET', '/espace/demandes');
        self::assertResponseStatusCodeSame(401);
    }

    public function testSupprimerLeCompteEffaceLesDemandesEtLExportLesContient(): void
    {
        $this->envoyerDemande();
        $this->seConnecterAvecLeLienDActivation();

        $this->client->request('GET', '/espace/donnees');
        $export = json_decode((string) $this->client->getResponse()->getContent(), true, 16, \JSON_THROW_ON_ERROR);
        self::assertSame('Site Fonctionnel · Rendez-vous en ligne', $export['demandes'][0]['titre']);

        $this->client->request('POST', '/auth/suppression', server: ['CONTENT_TYPE' => 'application/json'], content: '{}');
        preg_match('/jeton=([a-f0-9]{64})/', (string) self::mails()[0]->getTextBody(), $trouve);
        $this->client->request('POST', '/auth/suppression/confirmer', server: ['CONTENT_TYPE' => 'application/json'], content: json_encode(['jeton' => $trouve[1]]));
        self::assertResponseStatusCodeSame(204);

        $demandes = static::getContainer()->get(Demandes::class);
        \assert($demandes instanceof Demandes);
        self::assertSame([], $demandes->parEmail('marie@exemple.fr'));
    }
}
