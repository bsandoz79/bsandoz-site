# Correctif CI de l’API

Branche `fix/ci-api-env-test` · 2026-11-05

## Ce qui a été fait
`api/.env.test` versionné (il était ignoré par `.gitignore`).

## À quoi ça sert
Les tests HTTP de l’API échouaient sur GitHub faute de `KERNEL_CLASS`.

## Comment l’utiliser
Rien à faire : la CI relance les tests à chaque push.

## Tests
- **vérification** : Échec reproduit en local sans le fichier, puis tests verts avec.

Lancer : `cd api && docker run --rm -v "$PWD:/app" -w /app -e APP_CACHE_DIR=/tmp/cache composer:2 php bin/phpunit`

## Fichiers principaux
- `api/.env.test`
- `.gitignore`

## Reste ouvert
- Rien.
