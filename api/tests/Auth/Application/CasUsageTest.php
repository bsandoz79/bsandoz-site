<?php

declare(strict_types=1);

namespace App\Tests\Auth\Application;

use App\Auth\Application\DefinirMotDePasse;
use App\Auth\Application\DemanderLien;
use App\Auth\Application\OuvrirCompte;
use App\Auth\Application\Outils;
use App\Auth\Application\SeConnecter;
use App\Auth\Application\Sessions;
use App\Auth\Application\UtiliserLien;
use App\Auth\Domain\DonneesInvalides;
use App\Auth\Domain\IdentifiantsIncorrects;
use App\Auth\Domain\LienInvalide;
use App\Auth\Domain\StatutCompte;
use App\Auth\Domain\UsageLien;
use App\Tests\Auth\AleatoirePrevisible;
use App\Tests\Auth\ComptesEnMemoire;
use App\Tests\Auth\HacheurDeTest;
use App\Tests\Auth\HorlogeReglable;
use App\Tests\Auth\LiensEnMemoire;
use App\Tests\Auth\MailsEnregistres;
use App\Tests\Auth\SessionsEnMemoire;
use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../Doublures.php';

final class CasUsageTest extends TestCase
{
    private ComptesEnMemoire $comptes;
    private LiensEnMemoire $liens;
    private SessionsEnMemoire $sessions;
    private HorlogeReglable $horloge;
    private HacheurDeTest $hacheur;
    private MailsEnregistres $mails;
    private OuvrirCompte $ouvrir;
    private DemanderLien $demander;
    private UtiliserLien $utiliser;
    private SeConnecter $connecter;
    private DefinirMotDePasse $definir;
    private Sessions $gestion;

    protected function setUp(): void
    {
        $this->comptes = new ComptesEnMemoire();
        $this->liens = new LiensEnMemoire();
        $this->sessions = new SessionsEnMemoire();
        $this->horloge = new HorlogeReglable(new \DateTimeImmutable('2026-11-05 10:00', new \DateTimeZone('Europe/Paris')));
        $this->hacheur = new HacheurDeTest();
        $this->mails = new MailsEnregistres();
        $aleatoire = new AleatoirePrevisible();
        $outils = new Outils($this->liens, $this->sessions, $this->mails, $this->horloge, $aleatoire);

        $this->ouvrir = new OuvrirCompte($this->comptes, $outils, $this->horloge, $aleatoire);
        $this->demander = new DemanderLien($this->comptes, $outils);
        $this->utiliser = new UtiliserLien($this->liens, $this->comptes, $outils, $this->horloge);
        $this->connecter = new SeConnecter($this->comptes, $this->hacheur, $outils);
        $this->definir = new DefinirMotDePasse($this->liens, $this->comptes, $this->sessions, $this->hacheur, $this->mails, $this->horloge);
        $this->gestion = new Sessions($this->sessions, $this->comptes, $this->horloge);
    }

    /** Compte actif avec un mot de passe, comme après le parcours complet. */
    private function compteAvecMotDePasse(string $motDePasse = 'une phrase de passe'): void
    {
        ($this->ouvrir)('marie@exemple.fr', 'Marie Dupont');
        ($this->demander)('marie@exemple.fr', UsageLien::MotDePasse);
        ($this->definir)($this->mails->dernierSecret(UsageLien::MotDePasse), $motDePasse);
    }

    public function testOuvrirUnCompteEnvoieUnLienDActivation(): void
    {
        $compte = ($this->ouvrir)('Marie@Exemple.fr', 'Marie Dupont');

        self::assertSame(StatutCompte::EnAttente, $compte->statut());
        self::assertCount(1, $this->mails->envoyes);
        self::assertSame(['type' => 'activation', 'email' => 'marie@exemple.fr'], array_intersect_key($this->mails->envoyes[0], ['type' => 1, 'email' => 1]));
        // Le secret n'est jamais stocké : seule son empreinte l'est.
        $lien = array_values($this->liens->tous)[0];
        self::assertNotSame($this->mails->envoyes[0]['secret'], $lien->empreinte);
    }

    public function testOuvrirUnCompteExistantNeChangeRienEtNEnvoieRien(): void
    {
        $premier = ($this->ouvrir)('marie@exemple.fr', 'Marie Dupont');
        $second = ($this->ouvrir)(' MARIE@exemple.fr', 'Autre nom');

        self::assertSame($premier, $second);
        self::assertSame('Marie Dupont', $second->nom());
        self::assertCount(1, $this->comptes->tous);
        self::assertCount(1, $this->mails->envoyes);
    }

    public function testLeLienDActivationActiveLeCompteEtOuvreUneSession(): void
    {
        ($this->ouvrir)('marie@exemple.fr', 'Marie Dupont');

        $ouverte = ($this->utiliser)($this->mails->dernierSecret(UsageLien::Activation), 'Firefox sur Linux');

        self::assertTrue($ouverte->compte->estActif());
        self::assertSame('Firefox sur Linux', $ouverte->session->appareil);
        self::assertSame($ouverte->compte, $this->gestion->courante($ouverte->secret)?->compte);
    }

    public function testUnLienNeSertQuUneFois(): void
    {
        ($this->ouvrir)('marie@exemple.fr', 'Marie Dupont');
        $secret = $this->mails->dernierSecret(UsageLien::Activation);
        ($this->utiliser)($secret, 'Firefox');

        $this->expectException(LienInvalide::class);
        ($this->utiliser)($secret, 'Firefox');
    }

    public function testUnLienDeConnexionExpireApres15Minutes(): void
    {
        ($this->ouvrir)('marie@exemple.fr', 'Marie Dupont');
        ($this->demander)('marie@exemple.fr', UsageLien::Connexion);
        $this->horloge->avancer('PT16M');

        $this->expectException(LienInvalide::class);
        ($this->utiliser)($this->mails->dernierSecret(UsageLien::Connexion), 'Firefox');
    }

    public function testUnNouveauLienRemplaceLePrecedent(): void
    {
        ($this->ouvrir)('marie@exemple.fr', 'Marie Dupont');
        ($this->demander)('marie@exemple.fr', UsageLien::Connexion);
        $ancien = $this->mails->dernierSecret(UsageLien::Connexion);
        ($this->demander)('marie@exemple.fr', UsageLien::Connexion);

        ($this->utiliser)($this->mails->dernierSecret(UsageLien::Connexion), 'Firefox');
        $this->expectException(LienInvalide::class);
        ($this->utiliser)($ancien, 'Firefox');
    }

    public function testLeLienDeConnexionActiveAussiUnCompteEnAttente(): void
    {
        ($this->ouvrir)('marie@exemple.fr', 'Marie Dupont');
        ($this->demander)('marie@exemple.fr', UsageLien::Connexion);

        $ouverte = ($this->utiliser)($this->mails->dernierSecret(UsageLien::Connexion), 'Firefox');

        self::assertTrue($ouverte->compte->estActif());
    }

    public function testDemanderUnLienPourUneAdresseInconnueNeRevelerien(): void
    {
        ($this->demander)('inconnu@exemple.fr', UsageLien::Connexion);
        ($this->demander)('inconnu@exemple.fr', UsageLien::MotDePasse);

        self::assertSame([], $this->mails->envoyes);
    }

    public function testOnNePeutPasDemanderUnLienDActivation(): void
    {
        $this->expectException(DonneesInvalides::class);
        ($this->demander)('marie@exemple.fr', UsageLien::Activation);
    }

    public function testLeLienDuMotDePasseNOuvrePasDeSession(): void
    {
        ($this->ouvrir)('marie@exemple.fr', 'Marie Dupont');
        ($this->demander)('marie@exemple.fr', UsageLien::MotDePasse);

        $this->expectException(LienInvalide::class);
        ($this->utiliser)($this->mails->dernierSecret(UsageLien::MotDePasse), 'Firefox');
    }

    public function testDefinirLeMotDePasseFermeLesSessionsEtPrevient(): void
    {
        ($this->ouvrir)('marie@exemple.fr', 'Marie Dupont');
        $ouverte = ($this->utiliser)($this->mails->dernierSecret(UsageLien::Activation), 'Ancien appareil');
        ($this->demander)('marie@exemple.fr', UsageLien::MotDePasse);

        ($this->definir)($this->mails->dernierSecret(UsageLien::MotDePasse), 'une phrase de passe');

        self::assertNull($this->gestion->courante($ouverte->secret), 'Les sessions ouvertes sont fermées.');
        self::assertSame('mot_de_passe_modifie', end($this->mails->envoyes)['type']);
        self::assertSame('Marie Dupont', ($this->connecter)('marie@exemple.fr', 'une phrase de passe', 'Firefox')->compte->nom());
    }

    public function testUnMotDePasseTropCourtNeConsommePasLeLien(): void
    {
        ($this->ouvrir)('marie@exemple.fr', 'Marie Dupont');
        ($this->demander)('marie@exemple.fr', UsageLien::MotDePasse);
        $secret = $this->mails->dernierSecret(UsageLien::MotDePasse);

        try {
            ($this->definir)($secret, 'court');
            self::fail('Mot de passe trop court accepté.');
        } catch (DonneesInvalides $e) {
            self::assertArrayHasKey('motDePasse', $e->erreurs);
        }
        ($this->definir)($secret, 'une phrase de passe');
        self::assertTrue(array_values($this->comptes->tous)[0]->aUnMotDePasse());
    }

    public function testLeLienDuMotDePasseExpireApresUneHeure(): void
    {
        ($this->ouvrir)('marie@exemple.fr', 'Marie Dupont');
        ($this->demander)('marie@exemple.fr', UsageLien::MotDePasse);
        $this->horloge->avancer('PT61M');

        $this->expectException(LienInvalide::class);
        ($this->definir)($this->mails->dernierSecret(UsageLien::MotDePasse), 'une phrase de passe');
    }

    public function testSeConnecterAvecLeBonMotDePasse(): void
    {
        $this->compteAvecMotDePasse();

        $ouverte = ($this->connecter)(' Marie@Exemple.fr ', 'une phrase de passe', 'Safari sur iPhone');

        self::assertSame('Safari sur iPhone', $ouverte->session->appareil);
    }

    public function testMauvaisMotDePasseAdresseInconnueOuSansMotDePasse(): void
    {
        $this->compteAvecMotDePasse();
        ($this->ouvrir)('paul@exemple.fr', 'Paul');
        $essais = [
            ['marie@exemple.fr', 'mauvais mot de passe'],
            ['inconnu@exemple.fr', 'une phrase de passe'],
            ['paul@exemple.fr', 'une phrase de passe'],
            ['pas-une-adresse', 'une phrase de passe'],
        ];

        foreach ($essais as [$email, $motDePasse]) {
            $avant = $this->hacheur->verifications;
            try {
                ($this->connecter)($email, $motDePasse, 'Firefox');
                self::fail("Connexion acceptée à tort pour {$email}");
            } catch (IdentifiantsIncorrects $e) {
                self::assertSame('E-mail ou mot de passe incorrect.', $e->getMessage());
            }
            self::assertSame($avant + 1, $this->hacheur->verifications, 'Un mot de passe est toujours vérifié (même durée de réponse).');
        }
    }

    public function testDeconnexion(): void
    {
        $this->compteAvecMotDePasse();
        $ouverte = ($this->connecter)('marie@exemple.fr', 'une phrase de passe', 'Firefox');

        $this->gestion->deconnecter($ouverte->secret);

        self::assertNull($this->gestion->courante($ouverte->secret));
        $this->gestion->deconnecter('secret-inconnu'); // sans effet ni erreur
    }

    public function testAppareilsConnectesEtDeconnexionDesAutres(): void
    {
        $this->compteAvecMotDePasse();
        $ordinateur = ($this->connecter)('marie@exemple.fr', 'une phrase de passe', 'Firefox sur Linux');
        $telephone = ($this->connecter)('marie@exemple.fr', 'une phrase de passe', 'Chrome sur Android');

        self::assertCount(2, $this->gestion->appareils($ordinateur->compte->id));
        self::assertSame(1, $this->gestion->deconnecterLesAutres($ordinateur));
        self::assertNotNull($this->gestion->courante($ordinateur->secret));
        self::assertNull($this->gestion->courante($telephone->secret));
    }

    public function testUneSessionExpireeNEstPlusReconnue(): void
    {
        $this->compteAvecMotDePasse();
        $ouverte = ($this->connecter)('marie@exemple.fr', 'une phrase de passe', 'Firefox');
        $this->horloge->avancer('P31D');

        self::assertNull($this->gestion->courante($ouverte->secret));
        self::assertNull($this->gestion->courante(''));
    }
}
