<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Module Booking : création de la table des rendez-vous.
 */
final class Version20261105185043 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Module Booking : table des rendez-vous (booking_rendez_vous).';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE booking_rendez_vous (lieu VARCHAR(20) NOT NULL, adresse VARCHAR(300) DEFAULT NULL, activite VARCHAR(120) NOT NULL, message LONGTEXT NOT NULL, jeton VARCHAR(64) NOT NULL, statut VARCHAR(20) NOT NULL, cree_le DATETIME NOT NULL, id VARCHAR(36) NOT NULL, creneau_jour VARCHAR(10) NOT NULL, creneau_heure VARCHAR(5) NOT NULL, contact_nom VARCHAR(120) NOT NULL, contact_email VARCHAR(200) NOT NULL, contact_telephone VARCHAR(20) NOT NULL, INDEX idx_booking_creneau (creneau_jour, creneau_heure, statut), UNIQUE INDEX uniq_booking_jeton (jeton), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE booking_rendez_vous');
    }
}
