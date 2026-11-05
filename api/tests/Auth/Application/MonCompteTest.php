<?php

declare(strict_types=1);

namespace App\Tests\Auth\Application;

use App\Auth\Application\DemanderLien;
use App\Auth\Application\MonCompte;
use App\Auth\Application\OuvrirCompte;
use App\Auth\Application\Outils;
use App\Auth\Application\UtiliserLien;
use App\Auth\Domain\Compte;
use App\Auth\Domain\DonneesInvalides;
use App\Auth\Domain\Lien;
use App\Auth\Domain\LienInvalide;
use App\Auth\Domain\UsageLien;
use App\Tests\Auth\AleatoirePrevisible;
use App\Tests\Auth\ComptesEnMemoire;
use App\Tests\Auth\HorlogeReglable;
use App\Tests\Auth\LiensEnMemoire;
use App\Tests\Auth\MailsEnregistres;
use App\Tests\Auth\SessionsEnMemoire;
use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../Doublures.php';

final class MonCompteTest extends TestCase
{
    private ComptesEnMemoire $comptes;
    private MailsEnregistres $mails;
    private HorlogeReglable $horloge;
    private MonCompte $monCompte;
    private UtiliserLien $utiliser;
    private DemanderLien $demander;
    private Compte $marie;

    protected function setUp(): void
    {
        $this->comptes = new ComptesEnMemoire();
        $liens = new LiensEnMemoire();
        $this->mails = new MailsEnregistres();
        $this->horloge = new HorlogeReglable(new \DateTimeImmutable('2026-11-05 10:00'));
        $aleatoire = new AleatoirePrevisible();
        $outils = new Outils($liens, new SessionsEnMemoire(), $this->mails, $this->horloge, $aleatoire);
        $this->monCompte = new MonCompte($this->comptes, $liens, $outils, $this->mails, $this->horloge);
        $this->utiliser = new UtiliserLien($liens, $this->comptes, $outils, $this->horloge);
        $this->demander = new DemanderLien($this->comptes, $outils);
        $this->marie = (new OuvrirCompte($this->comptes, $outils, $this->horloge, $aleatoire))('marie@exemple.fr', 'Marie Dupont');
        $this->mails->envoyes = [];
    }

    public function testModifierLesCoordonneesEtPreferences(): void
    {
        $this->monCompte->modifierProfil($this->marie, ' Marie Durand ', 'Dupont Jardins', '06 12 34 56 78', '12 rue des Lilas, Abbeville', false);

        self::assertSame('Marie Durand', $this->marie->nom());
        self::assertSame('Dupont Jardins', $this->marie->entreprise());
        self::assertSame('06 12 34 56 78', $this->marie->telephone());
        self::assertSame('12 rue des Lilas, Abbeville', $this->marie->adresse());
        self::assertFalse($this->marie->notificationsParMail());
    }

    public function testCoordonneesInvalides(): void
    {
        try {
            $this->monCompte->modifierProfil($this->marie, '', str_repeat('x', 121), 'abc', str_repeat('y', 301), true);
            self::fail('Coordonnées invalides acceptées.');
        } catch (DonneesInvalides $e) {
            self::assertSame(['nom', 'entreprise', 'telephone', 'adresse'], array_keys($e->erreurs));
        }
        self::assertSame('Marie Dupont', $this->marie->nom(), 'Rien n’est modifié.');
    }

    public function testLeChangementDEmailPasseParLaNouvelleAdresse(): void
    {
        $this->monCompte->demanderChangementEmail($this->marie, ' Marie@Nouvelle.fr ');

        self::assertSame('marie@exemple.fr', $this->marie->email(), 'Rien ne change avant la confirmation.');
        self::assertSame(['type' => 'changement_email', 'email' => 'marie@nouvelle.fr'], array_intersect_key($this->mails->envoyes[0], ['type' => 1, 'email' => 1]));

        $compte = $this->monCompte->confirmerChangementEmail($this->mails->dernierSecret(UsageLien::ChangementEmail));

        self::assertSame('marie@nouvelle.fr', $compte->email());
        self::assertSame(['type' => 'email_modifie', 'email' => 'marie@exemple.fr'], array_intersect_key(end($this->mails->envoyes), ['type' => 1, 'email' => 1]), 'L’ancienne adresse est prévenue.');
        self::assertSame($compte, $this->comptes->parEmail('marie@nouvelle.fr'));
    }

    public function testChangementDEmailRefuse(): void
    {
        $this->comptes->enregistrer(Compte::ouvrir('paul', 'paul@exemple.fr', 'Paul', $this->horloge->maintenant()));
        foreach (['marie@exemple.fr' => 'déjà l’adresse', 'paul@exemple.fr' => 'déjà utilisée', 'pas-une-adresse' => 'invalide'] as $email => $motif) {
            try {
                $this->monCompte->demanderChangementEmail($this->marie, $email);
                self::fail("Changement accepté à tort ({$motif}).");
            } catch (DonneesInvalides $e) {
                self::assertArrayHasKey('email', $e->erreurs);
            }
        }
        self::assertSame([], $this->mails->envoyes);
    }

    public function testLAdressePriseEntreTempsEstRefuseeALaConfirmation(): void
    {
        $this->monCompte->demanderChangementEmail($this->marie, 'marie@nouvelle.fr');
        $this->comptes->enregistrer(Compte::ouvrir('autre', 'marie@nouvelle.fr', 'Autre', $this->horloge->maintenant()));

        $this->expectException(DonneesInvalides::class);
        $this->monCompte->confirmerChangementEmail($this->mails->dernierSecret(UsageLien::ChangementEmail));
    }

    public function testLeLienDeChangementDEmailNOuvrePasDeSessionEtExpire(): void
    {
        $this->monCompte->demanderChangementEmail($this->marie, 'marie@nouvelle.fr');
        $secret = $this->mails->dernierSecret(UsageLien::ChangementEmail);

        try {
            ($this->utiliser)($secret, 'Firefox');
            self::fail('Un lien de changement d’e-mail ne doit pas ouvrir de session.');
        } catch (LienInvalide) {
        }
        $this->horloge->avancer('PT61M');
        $this->expectException(LienInvalide::class);
        $this->monCompte->confirmerChangementEmail($secret);
    }

    public function testCesUsagesNeSeDemandentPasSansEtreConnecte(): void
    {
        foreach ([UsageLien::ChangementEmail, UsageLien::Suppression] as $usage) {
            try {
                ($this->demander)('marie@exemple.fr', $usage);
                self::fail("{$usage->value} demandé sans connexion.");
            } catch (DonneesInvalides) {
            }
        }
        self::assertSame([], $this->mails->envoyes);
    }

    public function testSuppressionConfirmeeParMail(): void
    {
        $this->monCompte->demanderSuppression($this->marie);
        self::assertNotNull($this->comptes->parId($this->marie->id), 'Rien n’est supprimé avant la confirmation.');

        $supprime = $this->monCompte->confirmerSuppression($this->mails->dernierSecret(UsageLien::Suppression));

        self::assertSame(['email' => 'marie@exemple.fr', 'nom' => 'Marie Dupont'], $supprime);
        self::assertNull($this->comptes->parId($this->marie->id));
        self::assertSame('compte_supprime', end($this->mails->envoyes)['type']);
    }

    public function testUnLienDeSuppressionNeSertPasAChangerDEmail(): void
    {
        $this->monCompte->demanderSuppression($this->marie);

        $this->expectException(LienInvalide::class);
        $this->monCompte->confirmerChangementEmail($this->mails->dernierSecret(UsageLien::Suppression));
    }

    public function testSeulUnLienDeChangementDEmailPorteUneAdresse(): void
    {
        $maintenant = $this->horloge->maintenant();
        self::assertSame('a@b.fr', Lien::creer('l', 'c', UsageLien::ChangementEmail, 's', $maintenant, 'a@b.fr')->nouvelEmail);

        $this->expectException(\LogicException::class);
        Lien::creer('l', 'c', UsageLien::Connexion, 's', $maintenant, 'a@b.fr');
    }
}
