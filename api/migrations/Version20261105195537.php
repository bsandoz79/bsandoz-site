<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Module Auth : tables des comptes, des liens envoyés par mail et des sessions.
 */
final class Version20261105195537 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Module Auth : comptes, liens envoyés par mail, sessions.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE auth_compte (email VARCHAR(200) NOT NULL, nom VARCHAR(120) NOT NULL, mot_de_passe_hache VARCHAR(255) DEFAULT NULL, statut VARCHAR(20) NOT NULL, cree_le DATETIME NOT NULL, active_le DATETIME DEFAULT NULL, mot_de_passe_modifie_le DATETIME DEFAULT NULL, id VARCHAR(36) NOT NULL, UNIQUE INDEX uniq_auth_compte_email (email), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE auth_lien (compte_id VARCHAR(36) NOT NULL, usage_lien VARCHAR(20) NOT NULL, empreinte VARCHAR(64) NOT NULL, cree_le DATETIME NOT NULL, expire_le DATETIME NOT NULL, utilise_le DATETIME DEFAULT NULL, id VARCHAR(36) NOT NULL, INDEX idx_auth_lien_compte (compte_id, usage_lien), UNIQUE INDEX uniq_auth_lien_empreinte (empreinte), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE auth_session (compte_id VARCHAR(36) NOT NULL, empreinte VARCHAR(64) NOT NULL, appareil VARCHAR(120) NOT NULL, cree_le DATETIME NOT NULL, derniere_activite DATETIME NOT NULL, fermee_le DATETIME DEFAULT NULL, id VARCHAR(36) NOT NULL, INDEX idx_auth_session_compte (compte_id), UNIQUE INDEX uniq_auth_session_empreinte (empreinte), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE auth_compte');
        $this->addSql('DROP TABLE auth_lien');
        $this->addSql('DROP TABLE auth_session');
    }
}
