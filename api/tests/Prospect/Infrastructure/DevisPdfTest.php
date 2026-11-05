<?php

declare(strict_types=1);

namespace App\Tests\Prospect\Infrastructure;

use App\Prospect\Domain\Demande;
use App\Prospect\Domain\Demandeur;
use App\Prospect\Domain\Devis;
use App\Prospect\Domain\LigneDevis;
use App\Prospect\Infrastructure\Mail\NotificationsProspectParMail;
use App\Prospect\Infrastructure\Pdf\DevisPdf;
use PHPUnit\Framework\TestCase;

final class DevisPdfTest extends TestCase
{
    /** @return array{Demande, Devis} */
    private static function exemple(string $nom = 'Marie Dupont'): array
    {
        $demande = Demande::recevoir('d1', '2026-014', Demandeur::depuis($nom, 'marie@exemple.fr', '06 12 34 56 78', 'Dupont Jardins'), 'Site avec prise de rendez-vous', str_repeat('r', 20), '', new \DateTimeImmutable('2026-11-02'));
        $devis = Devis::etablir('v1', $demande, [LigneDevis::depuis('Site fonctionnel', 989), LigneDevis::depuis('Rendez-vous en ligne', 400)], new \DateTimeImmutable('2026-11-04'));

        return [$demande, $devis];
    }

    public function testLeHtmlDuDevis(): void
    {
        [$demande, $devis] = self::exemple();
        $html = (new DevisPdf('Baptiste Sandoz', 'contact@bsandoz.fr', ''))->html($demande, $devis);

        self::assertStringContainsString('Devis n° 2026-014', $html);
        self::assertStringContainsString('Établi le 04/11/2026', $html);
        self::assertStringContainsString('Rendez-vous en ligne', $html);
        self::assertStringContainsString(htmlspecialchars(NotificationsProspectParMail::euros(1389)), $html);
        self::assertStringContainsString('TVA non applicable, art. 293 B du CGI', $html);
        self::assertStringContainsString('SIRET : [à compléter]', $html, 'Rien n’est inventé.');
        self::assertStringNotContainsString('Devis accepté', $html);
    }

    public function testToutEstEchappe(): void
    {
        [$demande, $devis] = self::exemple('<script>alert(1)</script>');
        $html = (new DevisPdf('Baptiste Sandoz', 'contact@bsandoz.fr', '123 456 789 00012'))->html($demande, $devis);

        self::assertStringNotContainsString('<script>', $html);
        self::assertStringContainsString('&lt;script&gt;', $html);
        self::assertStringContainsString('SIRET : 123 456 789 00012', $html);
    }

    public function testUnVraiPdfAvecLaMentionDAcceptation(): void
    {
        [$demande, $devis] = self::exemple();
        $devis->accepter(new \DateTimeImmutable('2026-11-08'));
        $pdf = new DevisPdf('Baptiste Sandoz', 'contact@bsandoz.fr', '');

        self::assertStringContainsString('Devis accepté le 08/11/2026.', $pdf->html($demande, $devis));
        self::assertStringStartsWith('%PDF-', $pdf->generer($demande, $devis));
    }

    public function testMontantEnEuros(): void
    {
        self::assertSame("1\u{202F}639\u{00A0}€", NotificationsProspectParMail::euros(1639));
        self::assertSame("99\u{00A0}€", NotificationsProspectParMail::euros(99));
    }
}
