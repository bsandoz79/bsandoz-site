# Réalisations en grille

Branche `feature/realisations-grille` · 2026-11-17

## Ce qui a été fait
- Baptiste trouvait pénible la bande « Mes réalisations » qui défilait toute seule : il fallait attendre qu'un projet passe pour le choisir.
- La bande (bloc `Showcase`) est remplacée par une grille : les réalisations puis les exemples d'outils, toutes les cartes visibles d'un coup. 1 colonne sur téléphone, jusqu'à 3 sur grand écran (`.grilleRealisations`).
- Les textes « Mettre en pause » et « Relancer le défilement » sont retirés des données de l'accueil.

## À quoi ça sert
Voir tous les projets d'un coup d'œil et cliquer directement sur celui qui intéresse.

## Comment l'utiliser
Rien à faire : la grille reprend les données de `data/realisations.ts` et `data/exemples.ts`.

## Tests
- **fonctionnels** : `Home.test.tsx` vérifie que toutes les réalisations et tous les exemples sont affichés, qu'il n'y a plus de bouton de pause, et le lien vers toutes les réalisations.
- **manuel** : vérifié dans Chrome sur ordinateur.

Lancer : `npm run test -w front -- Home`

## Fichiers principaux
- `front/src/pages/Home/sections/Realisations.tsx`
- `front/src/pages/Home/sections/Sections.module.css`

## Reste ouvert
- Le bloc `Showcase` reste dans la bibliothèque `@bsandoz79/blocs` pour d'autres sites.
