<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20261106090000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Module Prospect : fil de messages des demandes (prospect_message).';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE prospect_message (id VARCHAR(36) NOT NULL, demande_id VARCHAR(36) NOT NULL, auteur VARCHAR(20) NOT NULL, origine VARCHAR(10) NOT NULL, corps LONGTEXT NOT NULL, cree_le DATETIME NOT NULL, id_mail VARCHAR(64) DEFAULT NULL, INDEX idx_prospect_message_demande (demande_id, cree_le), UNIQUE INDEX uniq_prospect_message_mail (id_mail), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE prospect_message');
    }
}
