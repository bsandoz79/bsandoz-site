<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20261106140000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Module Contenu : textes et images modifiés depuis le site (contenu_personnalise).';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE contenu_personnalise (cle VARCHAR(120) NOT NULL, valeur LONGTEXT NOT NULL, PRIMARY KEY (cle)) DEFAULT CHARACTER SET utf8mb4');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE contenu_personnalise');
    }
}
