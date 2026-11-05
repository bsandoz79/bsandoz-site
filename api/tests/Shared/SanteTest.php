<?php

declare(strict_types=1);

namespace App\Tests\Shared;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

final class SanteTest extends WebTestCase
{
    public function testLApiRepond(): void
    {
        $client = static::createClient();
        $client->request('GET', '/sante');

        self::assertResponseIsSuccessful();
        self::assertResponseHeaderSame('content-type', 'application/json');
        self::assertSame(['statut' => 'ok'], json_decode((string) $client->getResponse()->getContent(), true));
    }

    public function testRefuseLesAutresMethodes(): void
    {
        $client = static::createClient();
        $client->request('POST', '/sante');

        self::assertResponseStatusCodeSame(405);
    }
}
