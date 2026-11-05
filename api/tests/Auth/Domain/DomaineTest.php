<?php

declare(strict_types=1);

namespace App\Tests\Auth\Domain;

use App\Auth\Domain\Compte;
use App\Auth\Domain\DonneesInvalides;
use App\Auth\Domain\Email;
use App\Auth\Domain\Lien;
use App\Auth\Domain\LienInvalide;
use App\Auth\Domain\PolitiqueMotDePasse;
use App\Auth\Domain\Secret;
use App\Auth\Domain\Session;
use App\Auth\Domain\StatutCompte;
use App\Auth\Domain\UsageLien;
use PHPUnit\Framework\TestCase;

final class DomaineTest extends TestCase
{
    private static function maintenant(): \DateTimeImmutable
    {
        return new \DateTimeImmutable('2026-11-05 10:00:00', new \DateTimeZone('Europe/Paris'));
    }

    public function testNormaliseLAdresseEmail(): void
    {
        self::assertSame('marie@exemple.fr', Email::normaliser('  Marie@Exemple.FR '));
    }

    public function testRefuseUneAdresseInvalide(): void
    {
        $this->expectException(DonneesInvalides::class);
        Email::normaliser('pas-une-adresse');
    }

    public function testUnCompteNaitEnAttenteSansMotDePasse(): void
    {
        $compte = Compte::ouvrir('c1', 'Marie@Exemple.fr', ' Marie Dupont ', self::maintenant());

        self::assertSame('marie@exemple.fr', $compte->email);
        self::assertSame('Marie Dupont', $compte->nom());
        self::assertSame(StatutCompte::EnAttente, $compte->statut());
        self::assertFalse($compte->aUnMotDePasse());
    }

    public function testActiverUneSeuleFois(): void
    {
        $compte = Compte::ouvrir('c1', 'marie@exemple.fr', 'Marie', self::maintenant());

        self::assertTrue($compte->activer(self::maintenant()));
        self::assertFalse($compte->activer(self::maintenant()->modify('+1 day')));
        self::assertEquals(self::maintenant(), $compte->activeLe());
    }

    public function testDefinirUnMotDePasseActiveLeCompte(): void
    {
        $compte = Compte::ouvrir('c1', 'marie@exemple.fr', 'Marie', self::maintenant());
        $compte->definirMotDePasse('hache', self::maintenant());

        self::assertTrue($compte->estActif());
        self::assertSame('hache', $compte->motDePasseHache());
        self::assertEquals(self::maintenant(), $compte->motDePasseModifieLe());
    }

    public function testPolitiqueDuMotDePasse(): void
    {
        PolitiqueMotDePasse::verifier('une phrase de passe');
        PolitiqueMotDePasse::verifier(str_repeat('é', 12));

        foreach (['court', str_repeat(' ', 20), str_repeat('a', 201)] as $refuse) {
            try {
                PolitiqueMotDePasse::verifier($refuse);
                self::fail("Mot de passe accepté à tort : « {$refuse} »");
            } catch (DonneesInvalides $e) {
                self::assertArrayHasKey('motDePasse', $e->erreurs);
            }
        }
    }

    public function testLeLienNeGardeQueLEmpreinteDuSecret(): void
    {
        $lien = Lien::creer('l1', 'c1', UsageLien::Connexion, 'secret', self::maintenant());

        self::assertSame(Secret::empreinte('secret'), $lien->empreinte);
        self::assertNotSame('secret', $lien->empreinte);
        self::assertSame(64, strlen($lien->empreinte));
    }

    public function testDureeDeVieDesLiens(): void
    {
        $maintenant = self::maintenant();
        $attendues = [
            [UsageLien::Connexion, '+15 minutes'],
            [UsageLien::MotDePasse, '+1 hour'],
            [UsageLien::Activation, '+7 days'],
        ];
        foreach ($attendues as [$usage, $duree]) {
            $lien = Lien::creer('l', 'c', $usage, 's', $maintenant);
            $fin = $maintenant->modify($duree);
            self::assertTrue($lien->estValide($fin->modify('-1 second')), "{$usage->value} encore valable juste avant {$duree}");
            self::assertFalse($lien->estValide($fin), "{$usage->value} expiré après {$duree}");
        }
    }

    public function testUnLienNeSertQuUneFois(): void
    {
        $lien = Lien::creer('l1', 'c1', UsageLien::Connexion, 's', self::maintenant());
        $lien->utiliser(self::maintenant());

        self::assertFalse($lien->estValide(self::maintenant()));
        $this->expectException(LienInvalide::class);
        $lien->utiliser(self::maintenant());
    }

    public function testUnLienAnnuleNeSertPlus(): void
    {
        $lien = Lien::creer('l1', 'c1', UsageLien::MotDePasse, 's', self::maintenant());
        $lien->annuler(self::maintenant());

        self::assertFalse($lien->estValide(self::maintenant()));
    }

    public function testLaSessionExpireApres30JoursSansActivite(): void
    {
        $session = Session::ouvrir('s1', 'c1', 'secret', 'Firefox sur Linux', self::maintenant());

        self::assertTrue($session->estActive(self::maintenant()->modify('+29 days')));
        self::assertFalse($session->estActive(self::maintenant()->modify('+30 days')));
    }

    public function testLActiviteProlongeLaSessionAuPlusUneFoisParHeure(): void
    {
        $session = Session::ouvrir('s1', 'c1', 'secret', 'Firefox', self::maintenant());

        self::assertFalse($session->noterActivite(self::maintenant()->modify('+30 minutes')));
        self::assertTrue($session->noterActivite(self::maintenant()->modify('+20 days')));
        self::assertTrue($session->estActive(self::maintenant()->modify('+45 days')));
    }

    public function testUneSessionFermeeNEstPlusActive(): void
    {
        $session = Session::ouvrir('s1', 'c1', 'secret', 'Firefox', self::maintenant());
        $session->fermer(self::maintenant());

        self::assertFalse($session->estActive(self::maintenant()));
    }

    public function testLeNomDeLAppareilEstBorne(): void
    {
        $session = Session::ouvrir('s1', 'c1', 'secret', str_repeat('x', 500), self::maintenant());

        self::assertSame(120, mb_strlen($session->appareil));
    }
}
