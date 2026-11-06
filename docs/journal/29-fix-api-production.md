# API en production

Branche `fix/api-production` · 2026-11-06

## Ce qui a été fait
Deux défauts bloquants trouvés en essayant l'API comme sur un vrai hébergement (Apache, mode production, sans dépendances de développement) :
- `php bin/console cache:clear` échouait (« Cannot generate lazy ghost : class … is final ») : les 6 entités du domaine (`Compte`, `Lien`, `Session`, `RendezVous`, `Demande`, `Devis`) ne sont plus `final` ;
- `api/public/.htaccess` n'existait pas : Apache répondait 404 sur toutes les adresses de l'API.

## À quoi ça sert
Sans ces corrections, l'API ne pouvait pas se mettre en ligne correctement, ni sur `api.bsandoz.fr` ni chez un client. Les tests ne le voyaient pas : ils tournent en environnement de test, et sans Apache.

## Comment l'utiliser
Dossier public du domaine de l'API : `api/public`. Après chaque envoi sur le serveur : `php bin/console cache:clear`. Voir `docs/deploiement.md`.

## Tests
- **CI** : nouvelle étape « Cache de production » (`cache:clear` avec `APP_ENV=prod`).
- **manuel** : conteneur `php:8.3-apache`, MariaDB 10.11, sans dépendances de développement : `/sante` répond 404 sans le `.htaccess` et 200 avec ; `cache:clear` réussit après le retrait de `final`.
- **unitaires et fonctionnels** : API 185 tests verts, sur MySQL 8.0 et sur MariaDB 10.11.

Lancer : voir `docs/api.md`.

## Fichiers principaux
- `api/public/.htaccess`, `api/src/*/Domain/` (les 6 entités), `.github/workflows/ci.yml`, `docs/deploiement.md`

## Reste ouvert
- L'envoi réel des mails n'est toujours pas testé sur o2switch.
- La redirection HTTP vers HTTPS de l'API n'est pas dans ce `.htaccess` : à vérifier à la mise en ligne.
