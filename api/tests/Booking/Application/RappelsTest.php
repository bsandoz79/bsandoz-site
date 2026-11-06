<?php

declare(strict_types=1);

namespace App\Tests\Booking\Application;

use App\Booking\Application\EnvoyerRappels;
use App\Booking\Domain\Contact;
use App\Booking\Domain\Creneau;
use App\Booking\Domain\Lieu;
use App\Booking\Domain\PreferencesRappel;
use App\Booking\Domain\RegleDisponibilite;
use App\Booking\Domain\RendezVous;
use App\Tests\Booking\HorlogeFixe;
use App\Tests\Booking\NotificationsEnregistrees;
use App\Tests\Booking\RendezVousEnMemoire;
use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../Doublures.php';

final class RappelsTest extends TestCase
{
    private RendezVousEnMemoire $tous;
    private NotificationsEnregistrees $mails;
    /** @var list<string> */
    private array $refuses = [];

    protected function setUp(): void
    {
        $this->tous = new RendezVousEnMemoire();
        $this->mails = new NotificationsEnregistrees();
        $this->refuses = [];
    }

    private function envoyer(string $maintenant = '2026-11-10 11:00:00'): array
    {
        $preferences = new class($this->refuses) implements PreferencesRappel {
            /** @param list<string> $refuses */
            public function __construct(private readonly array $refuses)
            {
            }

            public function accepte(string $email): bool
            {
                return !in_array($email, $this->refuses, true);
            }
        };
        $fuseau = new \DateTimeZone('Europe/Paris');
        $regle = new RegleDisponibilite([0, 1, 2, 3, 4], ['09:00'], 60, 1, 60, $fuseau);

        return (new EnvoyerRappels($this->tous, $this->mails, $preferences, $regle, new HorlogeFixe(new \DateTimeImmutable($maintenant, $fuseau))))();
    }

    private function rdv(string $id, string $jour, string $email = 'marie@exemple.fr'): RendezVous
    {
        $rendezVous = RendezVous::reserver($id, Lieu::Visio, null, Creneau::depuis($jour, '09:00'), Contact::depuis('Marie Dupont', $email, '0612345678'), 'Paysagiste', '', str_repeat('a', 64), new \DateTimeImmutable('2026-11-01'));
        $this->tous->enregistrer($rendezVous);

        return $rendezVous;
    }

    public function testRappelleSeulementLesRendezVousDuLendemain(): void
    {
        $this->rdv('aujourdhui', '2026-11-10');
        $this->rdv('demain', '2026-11-11');
        $this->rdv('apres', '2026-11-12');

        self::assertSame(['envoyes' => 1, 'refuses' => 0], $this->envoyer());
        self::assertSame(['rappel:demain'], $this->mails->envoyees);
    }

    public function testUnRendezVousAnnuleNEstPasRappele(): void
    {
        $this->rdv('demain', '2026-11-11')->annuler();

        self::assertSame(['envoyes' => 0, 'refuses' => 0], $this->envoyer());
        self::assertSame([], $this->mails->envoyees);
    }

    public function testRelancerNeRappellePasDeuxFois(): void
    {
        $this->rdv('demain', '2026-11-11');

        $this->envoyer();
        self::assertSame(['envoyes' => 0, 'refuses' => 0], $this->envoyer());
        self::assertSame(['rappel:demain'], $this->mails->envoyees);
    }

    public function testLaPreferenceEstRespectee(): void
    {
        $this->rdv('oui', '2026-11-11');
        $this->rdv('non', '2026-11-11', 'non@exemple.fr');
        $this->refuses = ['non@exemple.fr'];

        self::assertSame(['envoyes' => 1, 'refuses' => 1], $this->envoyer());
        self::assertSame(['rappel:oui'], $this->mails->envoyees);
    }

    public function testDemainSeCalculeDansLeFuseauDuProfessionnel(): void
    {
        $this->rdv('demain', '2026-11-11');

        // 23 h 30 UTC le 9 : déjà le 10 à Paris, donc « demain » est bien le 11.
        $utc = (new \DateTimeImmutable('2026-11-09 23:30:00', new \DateTimeZone('UTC')))->setTimezone(new \DateTimeZone('Europe/Paris'))->format('Y-m-d H:i:s');

        self::assertSame(['envoyes' => 1, 'refuses' => 0], $this->envoyer($utc));
    }
}
