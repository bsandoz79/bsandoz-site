<?php

declare(strict_types=1);

namespace App\Tests\Booking\Application;

use App\Booking\Application\AnnulerRendezVous;
use App\Booking\Application\ReserverRendezVous;
use App\Booking\Domain\CreneauIndisponible;
use App\Booking\Domain\DonneesInvalides;
use App\Booking\Domain\RendezVousIntrouvable;
use App\Tests\Booking\HorlogeFixe;
use App\Tests\Booking\IdentifiantsPrevisibles;
use App\Tests\Booking\NotificationsEnregistrees;
use App\Tests\Booking\Regles;
use App\Tests\Booking\RendezVousEnMemoire;
use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../Doublures.php';

final class CasUsageTest extends TestCase
{
    private RendezVousEnMemoire $depot;
    private NotificationsEnregistrees $notifications;
    private ReserverRendezVous $reserver;
    private AnnulerRendezVous $annuler;

    protected function setUp(): void
    {
        $this->depot = new RendezVousEnMemoire();
        $this->notifications = new NotificationsEnregistrees();
        $this->reserver = new ReserverRendezVous($this->depot, $this->notifications, Regles::parDefaut(), new HorlogeFixe(Regles::maintenant()), new IdentifiantsPrevisibles());
        $this->annuler = new AnnulerRendezVous($this->depot, $this->notifications);
    }

    /** @return array<string, mixed> */
    private function demande(array $changements = []): array
    {
        return $changements + [
            'lieu' => 'visio',
            'adresse' => null,
            'jour' => '2026-11-17',
            'creneau' => '14:00',
            'nom' => 'Marie Dupont',
            'email' => 'marie@exemple.fr',
            'telephone' => '06 12 34 56 78',
            'activite' => 'Detailing',
            'message' => 'Un site avec réservation.',
        ];
    }

    public function testReserveEnregistreEtPrevient(): void
    {
        $rdv = ($this->reserver)($this->demande());
        self::assertSame('rdv-1', $rdv->id);
        self::assertSame('jeton-1', $rdv->jeton);
        self::assertArrayHasKey('rdv-1', $this->depot->tous);
        self::assertSame(['confirme:rdv-1'], $this->notifications->envoyees);
    }

    public function testRefuseUnCreneauDejaPris(): void
    {
        ($this->reserver)($this->demande());
        $this->expectException(CreneauIndisponible::class);
        ($this->reserver)($this->demande(['email' => 'autre@exemple.fr']));
    }

    public function testRefuseUnCreneauNonReservable(): void
    {
        $this->expectException(CreneauIndisponible::class);
        ($this->reserver)($this->demande(['jour' => '2026-11-07'])); // samedi
    }

    public function testRegroupeToutesLesErreursDeSaisie(): void
    {
        try {
            ($this->reserver)(['lieu' => 'lune', 'jour' => 'demain', 'creneau' => '14h', 'nom' => '', 'email' => 'x', 'telephone' => '1']);
            self::fail('Demande invalide acceptée');
        } catch (DonneesInvalides $e) {
            self::assertEqualsCanonicalizing(['lieu', 'jour', 'nom', 'email', 'telephone'], array_keys($e->erreurs));
        }
        self::assertSame([], $this->notifications->envoyees);
    }

    public function testAnnulerLibereLeCreneauEtNePrevientQuUneFois(): void
    {
        ($this->reserver)($this->demande());
        ($this->annuler)('jeton-1');
        ($this->annuler)('jeton-1');
        self::assertSame(['confirme:rdv-1', 'annule:rdv-1'], $this->notifications->envoyees);

        $nouveau = ($this->reserver)($this->demande(['email' => 'autre@exemple.fr']));
        self::assertSame('rdv-2', $nouveau->id);
    }

    public function testAnnulerAvecUnLienInconnu(): void
    {
        $this->expectException(RendezVousIntrouvable::class);
        ($this->annuler)('inconnu');
    }
}
