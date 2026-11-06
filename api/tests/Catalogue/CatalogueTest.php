<?php

declare(strict_types=1);

namespace App\Tests\Catalogue;

use App\Catalogue\Application\ModifierLesPrix;
use App\Catalogue\Domain\PrixEnregistres;
use App\Catalogue\Domain\PrixInvalide;
use App\Catalogue\Domain\PrixPersonnalise;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

final class CatalogueTest extends TestCase
{
    /** @return array{ModifierLesPrix, PrixEnregistres} */
    private function outils(): array
    {
        $prix = new class implements PrixEnregistres {
            /** @var array<string, int> */
            public array $valeurs = ['formule.vitrine' => 50];

            public function tous(): array
            {
                return $this->valeurs;
            }

            public function remplacer(array $prix): void
            {
                $this->valeurs = [];
                foreach ($prix as $p) {
                    $this->valeurs[$p->cle] = $p->montant;
                }
            }
        };

        return [new ModifierLesPrix($prix), $prix];
    }

    public function testRemplaceTousLesPrix(): void
    {
        [$modifier, $prix] = $this->outils();

        $modifier(['formule.fonctionnel' => 1200, 'option.rdv' => 0]);

        self::assertSame(['formule.fonctionnel' => 1200, 'option.rdv' => 0], $prix->tous());
    }

    public function testUneListeVideRendLesPrixDuCode(): void
    {
        [$modifier, $prix] = $this->outils();

        $modifier([]);

        self::assertSame([], $prix->tous());
    }

    /** @return iterable<string, array{array<mixed>}> */
    public static function invalides(): iterable
    {
        yield 'clé inconnue' => [['formule.vitrine' => 10, 'autre.chose' => 10]];
        yield 'clé avec du code' => [['option.<script>' => 10]];
        yield 'négatif' => [['formule.vitrine' => -1]];
        yield 'trop grand' => [['formule.vitrine' => 1_000_001]];
        yield 'décimal' => [['formule.vitrine' => 12.5]];
        yield 'texte' => [['formule.vitrine' => '12']];
        yield 'liste' => [[12]];
    }

    /** @param array<mixed> $saisis */
    #[DataProvider('invalides')]
    public function testToutOuRien(array $saisis): void
    {
        [$modifier, $prix] = $this->outils();

        try {
            $modifier($saisis);
            self::fail('Prix accepté.');
        } catch (PrixInvalide) {
            self::assertSame(['formule.vitrine' => 50], $prix->tous());
        }
    }

    public function testUnPrixValide(): void
    {
        self::assertSame(0, PrixPersonnalise::depuis('option.logo', 0)->montant);
    }
}
