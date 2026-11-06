<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20261106120000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Module Booking : date du rappel envoyé la veille.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE booking_rendez_vous ADD rappel_envoye_le DATETIME DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE booking_rendez_vous DROP rappel_envoye_le');
    }
}
