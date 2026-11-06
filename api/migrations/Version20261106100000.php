<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20261106100000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Module Catalogue : prix modifiés depuis le back-office (catalogue_prix).';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE catalogue_prix (cle VARCHAR(60) NOT NULL, montant INT NOT NULL, PRIMARY KEY (cle)) DEFAULT CHARACTER SET utf8mb4');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE catalogue_prix');
    }
}
