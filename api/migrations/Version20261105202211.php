<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Module Auth : coordonnées et préférences du compte, changement d’e-mail.
 */
final class Version20261105202211 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Module Auth : coordonnées et préférences du compte, nouvelle adresse des liens de changement d’e-mail.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE auth_compte ADD entreprise VARCHAR(120) DEFAULT \'\' NOT NULL, ADD telephone VARCHAR(20) DEFAULT \'\' NOT NULL, ADD adresse VARCHAR(300) DEFAULT \'\' NOT NULL, ADD notifications_par_mail TINYINT DEFAULT 1 NOT NULL');
        $this->addSql('ALTER TABLE auth_lien ADD nouvel_email VARCHAR(200) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE auth_compte DROP entreprise, DROP telephone, DROP adresse, DROP notifications_par_mail');
        $this->addSql('ALTER TABLE auth_lien DROP nouvel_email');
    }
}
