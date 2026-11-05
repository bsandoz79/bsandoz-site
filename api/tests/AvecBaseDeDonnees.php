<?php

declare(strict_types=1);

namespace App\Tests;

use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Tools\SchemaTool;

/**
 * Pour les tests fonctionnels sur MySQL : recrée le schéma avant chaque test.
 * Le test est ignoré si aucune base n'est joignable (la CI en fournit une).
 */
trait AvecBaseDeDonnees
{
    private function preparerLaBase(): void
    {
        $em = static::getContainer()->get(EntityManagerInterface::class);
        \assert($em instanceof EntityManagerInterface);

        try {
            $em->getConnection()->executeQuery('SELECT 1');
        } catch (\Throwable $e) {
            self::markTestSkipped('Base MySQL de test indisponible : ' . $e->getMessage());
        }

        $schema = new SchemaTool($em);
        $metadonnees = $em->getMetadataFactory()->getAllMetadata();
        $schema->dropSchema($metadonnees);
        $schema->createSchema($metadonnees);
    }
}
