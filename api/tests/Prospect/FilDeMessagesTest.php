<?php

declare(strict_types=1);

namespace App\Tests\Prospect;

use App\Prospect\Application\EcrireMessage;
use App\Prospect\Application\ReleverLesReponses;
use App\Prospect\Domain\AuteurMessage;
use App\Prospect\Domain\Demande;
use App\Prospect\Domain\DemandeIntrouvable;
use App\Prospect\Domain\Demandeur;
use App\Prospect\Domain\DonneesInvalides;
use App\Prospect\Domain\MailRecu;
use App\Prospect\Domain\Message;
use App\Prospect\Domain\OrigineMessage;
use App\Prospect\Domain\TexteDeReponse;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/Doublures.php';

final class FilDeMessagesTest extends TestCase
{
    private DemandesEnMemoire $demandes;
    private MessagesEnMemoire $messages;
    private NotificationsProspectEnregistrees $mails;
    private BoiteEnMemoire $boite;
    private EcrireMessage $ecrire;
    private ReleverLesReponses $relever;
    private Demande $demande;

    protected function setUp(): void
    {
        $this->demandes = new DemandesEnMemoire();
        $this->messages = new MessagesEnMemoire();
        $this->mails = new NotificationsProspectEnregistrees();
        $this->boite = new BoiteEnMemoire();
        $horloge = new HorlogeProspect(new \DateTimeImmutable('2026-11-06 10:00:00'));
        $identifiants = new IdentifiantsProspect();
        $this->ecrire = new EcrireMessage($this->demandes, $this->messages, $this->mails, $horloge, $identifiants);
        $this->relever = new ReleverLesReponses($this->boite, $this->demandes, $this->messages, new ReferenceFactice(), $this->mails, new ProfessionnelFactice(), $horloge, $identifiants);
        $this->demande = Demande::recevoir('d1', '2026-014', Demandeur::depuis('Marie Dupont', 'marie@exemple.fr'), 'Site', 'Un récapitulatif assez long pour passer.', '', new \DateTimeImmutable('2026-11-01'));
        $this->demandes->enregistrer($this->demande);
    }

    private function mail(string $uid, string $expediteur, string $texte, string $sujet = 'Re: Devis [fil:2026-014-valide]', bool $automatique = false): MailRecu
    {
        $recu = new MailRecu($uid, "id-{$uid}", $expediteur, $sujet, $texte, $automatique);
        $this->boite->mails[] = $recu;

        return $recu;
    }

    public function testLeClientEcritEtLeProfessionnelEstPrevenu(): void
    {
        $message = $this->ecrire->parClient('d1', 'MARIE@exemple.fr', "  Bonjour,\r\nune question.  ");

        self::assertSame("Bonjour,\nune question.", $message->corps);
        self::assertSame(AuteurMessage::Client, $message->auteur);
        self::assertSame(['message:client'], $this->mails->envoyees);
    }

    public function testUnAutreClientNePeutPasEcrire(): void
    {
        $this->expectException(DemandeIntrouvable::class);
        $this->ecrire->parClient('d1', 'autre@exemple.fr', 'Intrusion');
    }

    public function testUneNoteDAppelNEnvoieAucunMail(): void
    {
        $note = $this->ecrire->noteDAppel('d1', 'Appel du 6 : préfère une visio.');

        self::assertSame(OrigineMessage::Note, $note->origine);
        self::assertSame([], $this->mails->envoyees);
    }

    public function testMessageVideOuTropLongRefuse(): void
    {
        foreach (['   ', str_repeat('a', Message::TAILLE_MAX + 1)] as $corps) {
            try {
                $this->ecrire->parClient('d1', 'marie@exemple.fr', $corps);
                self::fail('Message accepté.');
            } catch (DonneesInvalides $e) {
                self::assertArrayHasKey('corps', $e->erreurs);
            }
        }
        self::assertSame([], $this->messages->tous);
    }

    public function testLaReponseDuClientEntreDansLeFilEtPrevientLeProfessionnel(): void
    {
        $this->mail('1', 'Marie@Exemple.fr', "Oui, c'est parfait.\n\nLe 5 nov. 2026, Baptiste a écrit :\n> Ça vous va ?");

        self::assertSame(['ajoutes' => 1, 'automatiques' => 0, 'laisses' => 0], ($this->relever)());
        self::assertSame("Oui, c'est parfait.", $this->messages->tous[0]->corps);
        self::assertSame(AuteurMessage::Client, $this->messages->tous[0]->auteur);
        self::assertSame(OrigineMessage::Mail, $this->messages->tous[0]->origine);
        self::assertSame(['1'], $this->boite->lus);
        self::assertSame(['message:client'], $this->mails->envoyees);
    }

    public function testLaReponseDuProfessionnelPrevientLeClient(): void
    {
        $this->mail('1', 'pro@exemple.fr', 'Je vous rappelle demain.');

        ($this->relever)();

        self::assertSame(AuteurMessage::Professionnel, $this->messages->tous[0]->auteur);
        self::assertSame(['message:professionnel'], $this->mails->envoyees);
    }

    public function testUnExpediteurInconnuNEntrePasDansLeFilMemeAvecLaReference(): void
    {
        $this->mail('1', 'pirate@exemple.fr', 'Payez sur ce nouveau compte.');

        self::assertSame(['ajoutes' => 0, 'automatiques' => 0, 'laisses' => 1], ($this->relever)());
        self::assertSame([], $this->messages->tous);
        self::assertSame([], $this->boite->lus, 'Laissé non lu, pour qu’un humain le voie.');
    }

    public function testUneReferenceAbsenteOuFausseLaisseLeMailNonLu(): void
    {
        $this->mail('1', 'marie@exemple.fr', 'Une question', 'Re: Devis 2026-014');
        $this->mail('2', 'marie@exemple.fr', 'Une question', 'Re: Devis [fil:2026-014-fausse]');
        $this->mail('3', 'marie@exemple.fr', 'Une question', 'Re: Devis [fil:2026-999-valide]');

        self::assertSame(['ajoutes' => 0, 'automatiques' => 0, 'laisses' => 3], ($this->relever)());
        self::assertSame([], $this->messages->tous);
    }

    public function testUneReponseAutomatiqueEstIgnoreeSansBoucle(): void
    {
        $this->mail('1', 'marie@exemple.fr', 'Je suis absente.', automatique: true);

        self::assertSame(['ajoutes' => 0, 'automatiques' => 1, 'laisses' => 0], ($this->relever)());
        self::assertSame([], $this->messages->tous);
        self::assertSame([], $this->mails->envoyees);
        self::assertSame(['1'], $this->boite->lus);
    }

    public function testLeMemeMailNEstJamaisAjouteDeuxFois(): void
    {
        $this->mail('1', 'marie@exemple.fr', 'Bonjour');
        ($this->relever)();

        $this->boite->lus = []; // Le mail redevient non lu (webmail, par exemple).
        self::assertSame(['ajoutes' => 0, 'automatiques' => 0, 'laisses' => 0], ($this->relever)());
        self::assertCount(1, $this->messages->tous);
    }

    public function testUneReponseSansTexteEstMarqueeLueSansEntrerDansLeFil(): void
    {
        $this->mail('1', 'marie@exemple.fr', "> Tout est cité\n");

        ($this->relever)();

        self::assertSame([], $this->messages->tous);
        self::assertSame(['1'], $this->boite->lus);
    }

    /** @return iterable<string, array{string, string}> */
    public static function reponses(): iterable
    {
        yield 'citation Gmail' => ["Merci !\n\nLe jeu. 5 nov. 2026 à 10:00, Baptiste <a@b.fr> a écrit :\n> Bonjour", 'Merci !'];
        yield 'citation sur deux lignes' => ["Merci !\n\nLe jeu. 5 nov. 2026 à 10:00, Baptiste Sandoz\n<a@b.fr> a écrit :\n> Bonjour", 'Merci !'];
        yield 'citation anglaise' => ["Thanks\n\nOn Thu, Nov 5, 2026 at 10:00 AM Baptiste wrote:\n> Hello", 'Thanks'];
        yield 'Outlook' => ["D'accord.\n\nDe : Baptiste <a@b.fr>\nEnvoyé : jeudi\nObjet : Devis\n\nBonjour", "D'accord."];
        yield 'signature' => ["Oui.\n-- \nMarie Dupont\n06 12 34 56 78", 'Oui.'];
        yield 'téléphone' => ["Oui.\n\nEnvoyé de mon iPhone", 'Oui.'];
        yield 'citation dans le texte' => ["> Le prix ?\nOui, 989 €.\n> Et le délai ?\nTrois semaines.", "Oui, 989 €.\nTrois semaines."];
        yield 'retours Windows' => ["Ligne 1\r\nLigne 2\r\n", "Ligne 1\nLigne 2"];
        yield 'de : dans une phrase reste' => ['Je vous écris de : Amiens', 'Je vous écris de : Amiens'];
    }

    #[DataProvider('reponses')]
    public function testNettoyageDeLaReponse(string $brut, string $attendu): void
    {
        $nettoye = TexteDeReponse::nettoyer($brut);

        self::assertSame($attendu, $nettoye);
    }
}
