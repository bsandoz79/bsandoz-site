# Pages métier

Branche `feature/metiers` · 2026-11-04

## Ce qui a été fait
Quatre pages (artisan, commerce, restaurant, santé) sur un seul composant : promesse, fonctions avec prix, exemple de site, réalisation proche.

## À quoi ça sert
Parler à chaque métier avec ses mots et l’amener au configurateur préréglé.

## Comment l’utiliser
Contenus dans `src/data/metiers.ts`.

## Tests
- **fonctionnels** : `Metier.test.tsx` : chaque page, lien vers le configurateur préréglé.
- **unitaires** : `etatDepuisAdresse` dans `stockage.test.ts`.

Lancer : `cd front && npm run test`

## Fichiers principaux
- `src/pages/Metier/`
- `src/data/metiers.ts`

## Reste ouvert
- Rien.
