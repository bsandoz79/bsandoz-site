<?php

declare(strict_types=1);

namespace App\Tests\Prospect;

use App\Prospect\Application\AccepterDevis;
use App\Prospect\Application\EnregistrerDemande;
use App\Prospect\Application\EtablirDevis;
use App\Prospect\Domain\ActionImpossible;
use App\Prospect\Domain\Demande;
use App\Prospect\Domain\DemandeIntrouvable;
use App\Prospect\Domain\Demandeur;
use App\Prospect\Domain\DonneesInvalides;
use App\Prospect\Domain\LigneDevis;
use App\Prospect\Domain\PieceJointe;
use App\Prospect\Domain\StatutDemande;
use App\Prospect\Domain\StatutDevis;
use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/Doublures.php';

/** Domaine et cas d'usage du module Prospect (demandes et devis), sans base ni mails. */
final class ProspectTest extends TestCase
{
    private DemandesEnMemoire $demandes;
    private DevisEnMemoire $devis;
    private NotificationsProspectEnregistrees $mails;
    private HorlogeProspect $horloge;
    private EnregistrerDemande $enregistrer;
    private EtablirDevis $etablir;
    private AccepterDevis $accepter;

    protected function setUp(): void
    {
        $this->demandes = new DemandesEnMemoire();
        $this->devis = new DevisEnMemoire();
        $this->mails = new NotificationsProspectEnregistrees();
        $this->horloge = new HorlogeProspect(new \DateTimeImmutable('2026-11-05 10:00'));
        $ids = new IdentifiantsProspect();
        $this->enregistrer = new EnregistrerDemande($this->demandes, $this->mails, $this->horloge, $ids);
        $this->etablir = new EtablirDevis($this->demandes, $this->devis, $this->mails, $this->horloge, $ids);
        $this->accepter = new AccepterDevis($this->demandes, $this->devis, $this->mails, $this->horloge);
    }

    /** @return array<string, string> */
    private static function donnees(array $changements = []): array
    {
        return $changements + [
            'nom' => 'Marie Dupont',
            'email' => 'Marie@Exemple.fr',
            'telephone' => '06 12 34 56 78',
            'entreprise' => 'Dupont Jardins',
            'titre' => 'Site avec prise de rendez-vous et devis',
            'recapitulatif' => "Activité : Paysagiste\nBesoins : Prendre des rendez-vous",
            'predevis' => "Première estimation (indicative)\r\nPrix estimé : 1 320 € à 1 530 €",
        ];
    }

    public function testUneDemandeEstNumeroteeParAnnee(): void
    {
        $premiere = ($this->enregistrer)(self::donnees());
        $seconde = ($this->enregistrer)(self::donnees(['email' => 'paul@exemple.fr']));
        $this->horloge->maintenant = new \DateTimeImmutable('2027-01-02 09:00');
        $nouvelleAnnee = ($this->enregistrer)(self::donnees());

        self::assertSame(['2026-001', '2026-002', '2027-001'], [$premiere->numero, $seconde->numero, $nouvelleAnnee->numero]);
    }

    public function testUneDemandeArriveReçueEtPrevient(): void
    {
        $demande = ($this->enregistrer)(self::donnees(), [new PieceJointe('photo-1.jpg', 'image/jpeg', 'x')]);

        self::assertSame(StatutDemande::Recue, $demande->statut());
        self::assertSame('marie@exemple.fr', $demande->demandeur->email);
        self::assertSame("Première estimation (indicative)\nPrix estimé : 1 320 € à 1 530 €", $demande->predevis, 'Retours chariot retirés.');
        self::assertSame(['recue:2026-001:1'], $this->mails->envoyees);
    }

    public function testDemandeInvalide(): void
    {
        try {
            ($this->enregistrer)(self::donnees(['nom' => '', 'email' => 'x', 'recapitulatif' => 'court']));
            self::fail('Demande invalide acceptée.');
        } catch (DonneesInvalides $e) {
            self::assertSame(['nom', 'email', 'recapitulatif'], array_keys($e->erreurs));
        }
        self::assertSame([], $this->demandes->toutes);
        self::assertSame([], $this->mails->envoyees);
    }

    public function testTitreParDefaut(): void
    {
        self::assertSame('Projet de site', ($this->enregistrer)(self::donnees(['titre' => '  ']))->titre);
    }

    public function testEtablirPuisAccepterLeDevis(): void
    {
        $demande = ($this->enregistrer)(self::donnees());

        $devis = ($this->etablir)($demande->id, [['libelle' => 'Site fonctionnel', 'prix' => 989], ['libelle' => 'Rendez-vous en ligne', 'prix' => 400]]);

        self::assertSame([$demande->numero, 1389, StatutDevis::Envoye], [$devis->numero, $devis->total, $devis->statut()]);
        self::assertSame(StatutDemande::DevisEnvoye, $demande->statut());
        self::assertSame('Rendez-vous en ligne', $devis->lignes()[1]->libelle);

        $this->horloge->maintenant = new \DateTimeImmutable('2026-11-08 18:00');
        ($this->accepter)($demande->id, ' MARIE@exemple.fr ');

        self::assertSame(StatutDevis::Accepte, $devis->statut());
        self::assertEquals(new \DateTimeImmutable('2026-11-08 18:00'), $devis->accepteLe());
        self::assertSame(StatutDemande::Acceptee, $demande->statut());
        self::assertSame(['recue:2026-001:0', 'devis:2026-001', 'accepte:2026-001'], $this->mails->envoyees);
    }

    public function testSeuleLaDemandeusePeutAccepter(): void
    {
        $demande = ($this->enregistrer)(self::donnees());
        ($this->etablir)($demande->id, [['libelle' => 'Site vitrine', 'prix' => 99]]);

        $this->expectException(DemandeIntrouvable::class);
        ($this->accepter)($demande->id, 'paul@exemple.fr');
    }

    public function testOnNAccepteNiSansDevisNiDeuxFois(): void
    {
        $demande = ($this->enregistrer)(self::donnees());
        try {
            ($this->accepter)($demande->id, 'marie@exemple.fr');
            self::fail('Accepté sans devis.');
        } catch (ActionImpossible) {
        }
        ($this->etablir)($demande->id, [['libelle' => 'Site vitrine', 'prix' => 99]]);
        ($this->accepter)($demande->id, 'marie@exemple.fr');

        $this->expectException(ActionImpossible::class);
        ($this->accepter)($demande->id, 'marie@exemple.fr');
    }

    public function testUnSeulDevisParDemandeEtAuMoinsUneLigne(): void
    {
        $demande = ($this->enregistrer)(self::donnees());
        try {
            ($this->etablir)($demande->id, []);
            self::fail('Devis vide accepté.');
        } catch (DonneesInvalides) {
        }
        ($this->etablir)($demande->id, [['libelle' => 'Site vitrine', 'prix' => 99]]);

        $this->expectException(ActionImpossible::class);
        ($this->etablir)($demande->id, [['libelle' => 'Autre', 'prix' => 1]]);
    }

    public function testLignesDeDevisInvalides(): void
    {
        foreach ([['', 10], ['Ligne', -1], [str_repeat('x', 161), 10]] as [$libelle, $prix]) {
            try {
                LigneDevis::depuis($libelle, $prix);
                self::fail('Ligne invalide acceptée.');
            } catch (DonneesInvalides $e) {
                self::assertArrayHasKey('lignes', $e->erreurs);
            }
        }
    }

    public function testStatutsDansLOrdre(): void
    {
        self::assertSame(['Reçue', 'En étude', 'Devis envoyé', 'Accepté', 'En cours', 'Livré'], array_map(static fn (StatutDemande $s) => $s->libelle(), StatutDemande::cases()));
        self::assertSame(3, StatutDemande::Acceptee->rang());
    }

    public function testChangerDeStatutNoteLaDate(): void
    {
        $demande = Demande::recevoir('d', '2026-001', Demandeur::depuis('Marie', 'marie@exemple.fr'), 'T', str_repeat('r', 20), '', new \DateTimeImmutable('2026-11-01'));
        $demande->passerA(StatutDemande::Recue, new \DateTimeImmutable('2026-11-03'));
        self::assertEquals(new \DateTimeImmutable('2026-11-01'), $demande->statutModifieLe(), 'Même statut : rien ne change.');

        $demande->passerA(StatutDemande::EnEtude, new \DateTimeImmutable('2026-11-03'));
        self::assertEquals(new \DateTimeImmutable('2026-11-03'), $demande->statutModifieLe());
    }
}
