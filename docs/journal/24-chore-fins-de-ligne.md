# Fins de ligne

Branche `chore/fins-de-ligne` · 2026-11-05

## Ce qui a été fait
Ajout de `.gitattributes` : LF partout, images en binaire. Le dépôt était déjà en LF, donc aucun fichier n'a été réécrit.

## À quoi ça sert
Sous Windows, des outils (Symfony, PHPUnit dans Docker) réécrivaient des fichiers en changeant seulement leurs fins de ligne : `git status` les montrait modifiés sans différence réelle, et chaque commit affichait des avertissements CRLF.

## Comment l'utiliser
Rien à faire. En cas de doute : `git add --renormalize .`.

## Tests
- **vérification** : `git add --renormalize .` ne modifie aucun fichier ; lint, tests et build inchangés.

## Fichiers principaux
- `.gitattributes`, `docs/conventions.md`

## Reste ouvert
- Rien.
