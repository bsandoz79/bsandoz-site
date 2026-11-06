<?php

declare(strict_types=1);

namespace App\Tests\Contenu;

use App\Contenu\Application\EnregistrerImage;
use App\Contenu\Application\ModifierLesContenus;
use App\Contenu\Domain\ContenuInvalide;
use App\Contenu\Domain\ContenuPersonnalise;
use App\Contenu\Domain\ContenusEnregistres;
use PHPUnit\Framework\TestCase;

final class ContenuTest extends TestCase
{
    /** PNG de 1 pixel. */
    private const PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

    private string $dossier;

    protected function setUp(): void
    {
        $this->dossier = sys_get_temp_dir() . '/medias-' . bin2hex(random_bytes(4));
    }

    protected function tearDown(): void
    {
        foreach (glob($this->dossier . '/*') ?: [] as $fichier) {
            unlink($fichier);
        }
        if (is_dir($this->dossier)) {
            rmdir($this->dossier);
        }
    }

    public function testUneCleEtUnTexteValides(): void
    {
        self::assertSame('Bonjour', ContenuPersonnalise::depuis('accueil.hero.badge', 'Bonjour')->valeur());
    }

    public function testRefuseUneCleInvalide(): void
    {
        $this->expectException(ContenuInvalide::class);
        ContenuPersonnalise::depuis('../etc/passwd', 'x');
    }

    public function testRefuseUnTexteTropLong(): void
    {
        $this->expectException(ContenuInvalide::class);
        ContenuPersonnalise::depuis('accueil.hero.badge', str_repeat('a', 5001));
    }

    public function testToutOuRienSiUneValeurNEstPasUnTexte(): void
    {
        $depot = new class implements ContenusEnregistres {
            public int $appels = 0;

            public function tous(): array
            {
                return [];
            }

            public function appliquer(array $changements): void
            {
                ++$this->appels;
            }
        };
        try {
            (new ModifierLesContenus($depot))(['a.b' => 'ok', 'c.d' => 12]);
            self::fail('Valeur invalide acceptée');
        } catch (ContenuInvalide) {
            self::assertSame(0, $depot->appels);
        }
    }

    public function testEnregistreUneImageSousUnNomAuHasardAvecLExtensionDeSonVraiType(): void
    {
        $nom = (new EnregistrerImage($this->dossier))(self::PNG);
        self::assertMatchesRegularExpression('/^[a-f0-9]{32}\.png$/', $nom);
        self::assertFileExists($this->dossier . '/' . $nom);
    }

    /** @return iterable<string, array{string}> */
    public static function fauxFichiers(): iterable
    {
        yield 'script PHP' => [base64_encode('<?php echo 1;')];
        yield 'SVG' => [base64_encode('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>')];
        yield 'pas du base64' => ['%%%'];
        yield 'vide' => [''];
    }

    #[\PHPUnit\Framework\Attributes\DataProvider('fauxFichiers')]
    public function testRefuseCeQuiNEstPasUneImage(string $envoi): void
    {
        try {
            (new EnregistrerImage($this->dossier))($envoi);
            self::fail('Faux fichier accepté');
        } catch (ContenuInvalide) {
            self::assertSame([], glob($this->dossier . '/*') ?: []);
        }
    }
}
