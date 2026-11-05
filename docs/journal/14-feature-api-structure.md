# API Symfony

Branche `feature/api-structure` · 2026-11-05

## Ce qui a été fait
Squelette Symfony 7.4 dans `api/`, base MySQL, modules Shared / Auth / Prospect / Booking / Notification à cœur hexagonal, route `/sante`, CI de l’API.

## À quoi ça sert
La base technique de la V2 : rendez-vous, devis, puis espace client.

## Comment l’utiliser
Voir `docs/api.md` (Docker, base de développement, structure).

## Tests
- **fonctionnels** : `tests/Shared/SanteTest.php` : `/sante` répond, autres méthodes refusées.
- **architecture** : `tests/Architecture/DomaineIndependantTest.php` : le domaine ne dépend ni de Symfony, ni de Doctrine, ni d’un autre module.
- **CI** : Job `api` : conteneur, YAML, connexion MySQL, Doctrine, PHPUnit.

Lancer : `cd api && docker run --rm -v "$PWD:/app" -w /app -e APP_CACHE_DIR=/tmp/cache composer:2 php bin/phpunit`

## Fichiers principaux
- `api/`

## Reste ouvert
- Ajuster `serverVersion` à la base réelle d’o2switch (MySQL ou MariaDB).
