# API (V2)

API Symfony 7.4 (version à support long), dans `api/`. Elle servira la prise de rendez-vous, les demandes et devis, puis l'espace client (V3). Hébergement prévu : `api.bsandoz.fr` sur o2switch.

## Outils
- PHP 8.3 visé en production : `composer.json` fixe `config.platform.php` à 8.3.0 pour que les dépendances restent compatibles avec o2switch.
- PHP et Composer ne sont pas nécessaires sur le poste : tout tourne dans Docker.

```sh
# depuis api/
docker run --rm -v "$PWD:/app" -w /app composer:2 composer install   # dépendances
docker run --rm -v "$PWD:/app" -w /app composer:2 php bin/phpunit      # tests
```

Sous Git Bash (Windows), préfixer par `MSYS_NO_PATHCONV=1` et utiliser `$(pwd -W)` à la place de `$PWD`.

## Configuration
- `api/.env.dist` : valeurs de développement, sans secret (versionné). Symfony le lit quand `api/.env` n'existe pas.
- `api/.env.local` (non versionné) : valeurs réelles du poste ou du serveur (base de données, `APP_SECRET`…).

## Base de données
MySQL (cahier des charges). En développement, `api/compose.yaml` lance MySQL 8.0 dans Docker (identifiants de développement `app` / `app`, base `bsandoz`) :

```sh
# depuis api/
docker compose up -d database
```

`DATABASE_URL` (dans `.env.dist`) pointe sur cette base. Sur o2switch, la vraie valeur va dans `api/.env.local` ; ajuster `serverVersion` à la version réelle du serveur (MySQL ou MariaDB).

Doctrine : pas d'entités Doctrine dans le domaine. Chaque module déclare sa correspondance en XML dans `Infrastructure/Doctrine`, ajoutée sous `doctrine.orm.mappings` (`config/packages/doctrine.yaml`).

Sous Windows avec Docker, placer le cache hors du dossier partagé : `-e APP_CACHE_DIR=/tmp/cache`.

## Structure : monolithe modulaire, cœur hexagonal
```
api/src/
  Shared/        commun à tous les modules (Domain partagé, Infrastructure : route /sante)
  Auth/          connexion (V3)
  Prospect/      demandes, devis, messages
  Booking/       rendez-vous
  Notification/  e-mails, rappels, .ics
```
Chaque module a trois couches : `Domain/` (métier pur), `Application/` (cas d'usage), `Infrastructure/` (HTTP, Doctrine, mails). Son `README.md` décrit son rôle.

Règle vérifiée par `tests/Architecture/DomaineIndependantTest.php` : un fichier de `Domain/` n'importe ni Symfony, ni Doctrine, ni une `Infrastructure`, ni le domaine d'un autre module (sauf `Shared\Domain`).

Les routes se déclarent par attribut `#[Route]` sur les contrôleurs de `Infrastructure/Http`.

## Points d'entrée
| Méthode | Adresse | Rôle |
| --- | --- | --- |
| GET | `/sante` | l'API répond : `{"statut":"ok"}` |

## Fichiers d'environnement versionnés
- `.env.dist` : valeurs de développement.
- `.env.test` : `KERNEL_CLASS` pour PHPUnit et une `APP_SECRET` factice propre aux tests. Sans lui, les tests HTTP échouent (« You must set the KERNEL_CLASS environment variable »).
Les secrets réels restent dans `.env` / `.env.local`, jamais versionnés.
