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
