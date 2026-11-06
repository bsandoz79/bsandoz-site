<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20261106110000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Module Booking : disponibilités réglées depuis le back-office (booking_disponibilites).';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE booking_disponibilites (id VARCHAR(10) NOT NULL, jours_travailles JSON NOT NULL, creneaux JSON NOT NULL, jours_fermes JSON NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE booking_disponibilites');
    }
}
