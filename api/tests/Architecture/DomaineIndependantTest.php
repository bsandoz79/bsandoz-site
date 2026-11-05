<?php

declare(strict_types=1);

namespace App\Tests\Architecture;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

/**
 * Cœur hexagonal : le domaine de chaque module ne dépend ni du framework, ni de Doctrine,
 * ni de l'infrastructure, ni d'un autre module (seul Shared\Domain est partagé).
 */
final class DomaineIndependantTest extends TestCase
{
    private const SRC = __DIR__ . '/../../src';

    /** @return iterable<string, array{string, string}> */
    public static function fichiersDuDomaine(): iterable
    {
        $fichiers = new \RegexIterator(
            new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator(self::SRC, \FilesystemIterator::SKIP_DOTS)),
            '#/(\w+)/Domain/.+\.php$#',
            \RegexIterator::GET_MATCH,
        );
        $trouve = false;
        foreach ($fichiers as $chemin => $correspondance) {
            $trouve = true;
            yield str_replace(self::SRC . '/', '', (string) $chemin) => [(string) $chemin, $correspondance[1]];
        }
        if (!$trouve) {
            // Aucun domaine écrit pour l'instant : le test reste actif et passera dès le premier fichier.
            yield 'aucun fichier de domaine' => ['', ''];
        }
    }

    #[DataProvider('fichiersDuDomaine')]
    public function testLeDomaineResteIndependant(string $chemin, string $module): void
    {
        if ($chemin === '') {
            self::assertTrue(true);

            return;
        }
        $code = (string) file_get_contents($chemin);
        self::assertMatchesRegularExpression("/^namespace App\\\\{$module}\\\\Domain(\\\\|;)/m", $code, "$chemin n'est pas dans l'espace de noms de son module");
        preg_match_all('/^use\s+([^;]+);/m', $code, $imports);
        foreach ($imports[1] as $import) {
            self::assertDoesNotMatchRegularExpression('/^(Symfony|Doctrine)\\\\/', $import, "$chemin importe $import");
            self::assertStringNotContainsString('\\Infrastructure\\', $import, "$chemin importe l'infrastructure");
            if (str_starts_with($import, 'App\\') && !str_starts_with($import, "App\\$module\\")) {
                self::assertStringStartsWith('App\\Shared\\Domain\\', $import, "$chemin dépend d'un autre module");
            }
        }
    }
}
