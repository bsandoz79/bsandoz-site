<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20261106130000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Module Booking : frais kilométriques estimés (km facturés aller-retour, montant en centimes).';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE booking_rendez_vous ADD km_factures INT DEFAULT NULL, ADD frais_centimes INT DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE booking_rendez_vous DROP km_factures, DROP frais_centimes');
    }
}
