<?php

declare(strict_types=1);

namespace App\Tests\Booking\Infrastructure;

use App\Booking\Domain\Contact;
use App\Booking\Domain\Creneau;
use App\Booking\Domain\Lieu;
use App\Booking\Domain\RendezVous;
use App\Booking\Infrastructure\Mail\NotificationsParMail;
use App\Tests\Booking\Regles;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Mailer\Envelope;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mime\RawMessage;

require_once __DIR__ . '/../Doublures.php';

/** Faux mailer : garde les messages au lieu de les envoyer. */
final class MailerEnregistreur implements MailerInterface
{
    /** @var list<Email> */
    public array $envoyes = [];

    public function send(RawMessage $message, ?Envelope $envelope = null): void
    {
        \assert($message instanceof Email);
        $this->envoyes[] = $message;
    }
}

final class NotificationsParMailTest extends TestCase
{
    private MailerEnregistreur $mailer;
    private NotificationsParMail $notifications;

    protected function setUp(): void
    {
        $this->mailer = new MailerEnregistreur();
        $this->notifications = new NotificationsParMail(
            $this->mailer,
            Regles::parDefaut(),
            'no-reply@exemple.fr',
            'Atelier Test',
            'pro@exemple.fr',
            'https://api.exemple.fr/',
        );
    }

    private function rendezVous(Lieu $lieu = Lieu::ChezLeClient): RendezVous
    {
        return RendezVous::reserver(
            'rdv-1',
            $lieu,
            $lieu === Lieu::ChezLeClient ? '12 rue des Lilas, Amiens' : null,
            Creneau::depuis('2026-11-17', '14:00'),
            Contact::depuis('Marie Dupont', 'marie@exemple.fr', '06 12 34 56 78'),
            'Detailing',
            'Un site avec réservation.',
            str_repeat('b', 64),
            Regles::maintenant(),
        );
    }

    /** @return list<string> */
    private static function destinataires(Email $email): array
    {
        return array_map(static fn ($a) => $a->getAddress(), $email->getTo());
    }

    public function testConfirmationALaPersonneEtAuProfessionnel(): void
    {
        $this->notifications->rendezVousConfirme($this->rendezVous());

        self::assertCount(2, $this->mailer->envoyes);
        [$client, $pro] = $this->mailer->envoyes;

        self::assertSame(['marie@exemple.fr'], self::destinataires($client));
        self::assertSame('no-reply@exemple.fr', $client->getFrom()[0]->getAddress());
        self::assertSame('Atelier Test', $client->getFrom()[0]->getName());
        self::assertStringContainsString('14:00', (string) $client->getSubject());
        self::assertStringContainsString('chez vous, 12 rue des Lilas, Amiens', (string) $client->getTextBody());
        // Lien pour déplacer ou annuler, sans double barre oblique.
        self::assertStringContainsString('https://api.exemple.fr/rendez-vous/' . str_repeat('b', 64), (string) $client->getTextBody());

        self::assertSame(['pro@exemple.fr'], self::destinataires($pro));
        self::assertSame('marie@exemple.fr', $pro->getReplyTo()[0]->getAddress());
        self::assertStringContainsString('06 12 34 56 78', (string) $pro->getTextBody());
        self::assertStringContainsString('Un site avec réservation.', (string) $pro->getTextBody());
    }

    public function testJointUnFichierIcs(): void
    {
        $this->notifications->rendezVousConfirme($this->rendezVous(Lieu::Visio));

        foreach ($this->mailer->envoyes as $email) {
            $pieces = $email->getAttachments();
            self::assertCount(1, $pieces);
            self::assertSame('rendez-vous.ics', $pieces[0]->getFilename());
            self::assertStringContainsString('METHOD:REQUEST', $pieces[0]->getBody());
        }
        self::assertStringContainsString('en visio', (string) $this->mailer->envoyes[0]->getTextBody());
    }

    public function testAnnulationAvecIcsDAnnulation(): void
    {
        $this->notifications->rendezVousAnnule($this->rendezVous());

        self::assertCount(2, $this->mailer->envoyes);
        [$client, $pro] = $this->mailer->envoyes;
        self::assertSame(['marie@exemple.fr'], self::destinataires($client));
        self::assertSame(['pro@exemple.fr'], self::destinataires($pro));
        self::assertStringContainsString('annulé', (string) $client->getSubject());
        foreach ($this->mailer->envoyes as $email) {
            self::assertSame('annulation.ics', $email->getAttachments()[0]->getFilename());
            self::assertStringContainsString('METHOD:CANCEL', $email->getAttachments()[0]->getBody());
        }
    }

    public function testIndiqueLesFraisDeDeplacementDansLesDeuxMails(): void
    {
        $rdv = RendezVous::reserver(
            'rdv-2',
            Lieu::ChezLeClient,
            'Grand-Place, Lille',
            Creneau::depuis('2026-11-17', '14:00'),
            Contact::depuis('Marie Dupont', 'marie@exemple.fr', '06 12 34 56 78'),
            'Detailing',
            '',
            str_repeat('c', 64),
            Regles::maintenant(),
            96,
            1800,
        );
        $this->notifications->rendezVousConfirme($rdv);
        [$client, $pro] = $this->mailer->envoyes;

        $texte = (string) $client->getTextBody();
        self::assertStringContainsString('Frais de déplacement : 18,00 € (96 km aller-retour', $texte);
        self::assertStringContainsString("restent dus même si aucun devis n'est accepté", $texte);
        self::assertStringNotContainsString('gratuit et sans engagement', $texte);
        self::assertStringContainsString('Frais de déplacement : 18,00 € (96 km aller-retour facturés)', (string) $pro->getTextBody());
    }

    public function testSansFraisLeRendezVousResteAnnonceGratuit(): void
    {
        $this->notifications->rendezVousConfirme($this->rendezVous());
        [$client, $pro] = $this->mailer->envoyes;
        self::assertStringContainsString('gratuit et sans engagement', (string) $client->getTextBody());
        self::assertStringNotContainsString('Frais de déplacement', (string) $pro->getTextBody());
    }
}
