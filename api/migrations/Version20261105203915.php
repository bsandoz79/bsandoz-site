<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Module Prospect : tables des demandes de devis et des devis.
 */
final class Version20261105203915 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Module Prospect : demandes de devis et devis.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE prospect_demande (numero VARCHAR(12) NOT NULL, titre VARCHAR(160) NOT NULL, recapitulatif LONGTEXT NOT NULL, predevis LONGTEXT NOT NULL, statut VARCHAR(20) NOT NULL, cree_le DATETIME NOT NULL, statut_modifie_le DATETIME NOT NULL, id VARCHAR(36) NOT NULL, demandeur_nom VARCHAR(120) NOT NULL, demandeur_email VARCHAR(200) NOT NULL, demandeur_telephone VARCHAR(20) NOT NULL, demandeur_entreprise VARCHAR(120) NOT NULL, INDEX idx_prospect_demande_email (demandeur_email), UNIQUE INDEX uniq_prospect_demande_numero (numero), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE prospect_devis (demande_id VARCHAR(36) NOT NULL, numero VARCHAR(12) NOT NULL, lignes JSON NOT NULL, total INT NOT NULL, statut VARCHAR(20) NOT NULL, envoye_le DATETIME NOT NULL, accepte_le DATETIME DEFAULT NULL, id VARCHAR(36) NOT NULL, UNIQUE INDEX uniq_prospect_devis_demande (demande_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE prospect_demande');
        $this->addSql('DROP TABLE prospect_devis');
    }
}
