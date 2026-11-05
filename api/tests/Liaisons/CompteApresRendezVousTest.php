<?php

declare(strict_types=1);

namespace App\Tests\Liaisons;

use App\Auth\Domain\Comptes;
use App\Auth\Domain\StatutCompte;
use App\Tests\AvecBaseDeDonnees;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\Mime\Email;

/** Au premier rendez-vous, un compte client est ouvert et un lien d'activation part (sur MySQL). */
final class CompteApresRendezVousTest extends WebTestCase
{
    use AvecBaseDeDonnees;

    private KernelBrowser $client;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->preparerLaBase();
    }

    private function reserver(string $creneau, string $email = 'Marie@Exemple.fr'): void
    {
        $jour = new \DateTimeImmutable('today +3 days', new \DateTimeZone('Europe/Paris'));
        while ((int) $jour->format('N') > 5) {
            $jour = $jour->modify('+1 day');
        }
        $this->client->request('POST', '/rendez-vous', server: ['CONTENT_TYPE' => 'application/json'], content: json_encode([
            'lieu' => 'visio', 'adresse' => null, 'jour' => $jour->format('Y-m-d'), 'creneau' => $creneau,
            'nom' => 'Marie Dupont', 'email' => $email, 'telephone' => '06 12 34 56 78', 'activite' => 'Detailing', 'message' => '',
        ], \JSON_THROW_ON_ERROR));
        self::assertResponseStatusCodeSame(201);
    }

    /** @return list<string> */
    private static function sujets(): array
    {
        return array_map(static fn ($m) => $m instanceof Email ? (string) $m->getSubject() : '', self::getMailerMessages());
    }

    public function testLePremierRendezVousOuvreUnCompteEnAttente(): void
    {
        $this->reserver('09:00');

        self::assertEmailCount(3);
        self::assertContains('Votre espace client est prêt', self::sujets());
        $comptes = static::getContainer()->get(Comptes::class);
        \assert($comptes instanceof Comptes);
        $compte = $comptes->parEmail('marie@exemple.fr');
        self::assertNotNull($compte);
        self::assertSame(StatutCompte::EnAttente, $compte->statut());
        self::assertSame('Marie Dupont', $compte->nom());
    }

    public function testUnSecondRendezVousNeRouvrePasDeCompte(): void
    {
        $this->reserver('09:00');
        $this->reserver('14:00', 'marie@exemple.fr');

        self::assertEmailCount(2); // seulement les mails du rendez-vous
        self::assertNotContains('Votre espace client est prêt', self::sujets());
    }
}
