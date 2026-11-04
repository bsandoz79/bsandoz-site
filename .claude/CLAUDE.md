# Règles du projet bsandoz-site

À relire avant chaque tâche.

## Méthode de travail
1. Une fonctionnalité = une branche : `feature/<nom>`, `fix/<nom>`, `chore/<nom>`, partant de `main` à jour.
2. Un ajout = un commit, petit et lisible, au format Conventional Commits en français :
   - `feat: ajout du bloc Calendrier`
   - `test: tests unitaires du bloc Calendrier`
   - `style: styles du bloc Calendrier`
   - `docs: documentation du bloc Calendrier`
   - `fix:`, `refactor:`, `chore:`, `ci:`
3. Avant CHAQUE commit : mettre à jour la documentation concernée (`docs/`) et `docs/CHANGELOG.md`.
4. Avant de pousser : `npm run lint`, `npm run test`, `npm run build` doivent passer.
5. Une fois la fonctionnalité et ses tests verts : push de la branche, fusion dans `main`, puis nouvelle branche pour la suite.
6. Jamais de secret dans le code : clés, mots de passe et accès vont dans les secrets GitHub ou un `.env` non versionné.

## Architecture
- `front/` : React + Vite + TypeScript.
  - `src/blocks/` : blocs RÉUTILISABLES, sans rien de propre à bsandoz.fr (calendrier, boutons, cartes, sélecteur d'options…). Chaque bloc a son dossier : `Bloc.tsx`, `Bloc.module.css`, `Bloc.test.tsx`, `index.ts`, `README.md`.
  - `src/components/` : composants propres à ce site (en-tête, pied de page…), construits avec les blocs.
  - `src/pages/` : une page = un dossier.
  - `src/data/` : contenus et prix (jamais en dur dans les composants).
  - `src/styles/` : CSS global segmenté (tokens, base, mise en page, animations).
- `api/` (plus tard) : Symfony, monolithe modulaire, cœur hexagonal.

## CSS
- Variables de design dans `src/styles/tokens.css` uniquement (couleurs, typo, espacements, rayons, ombres).
- Chaque composant ou bloc a son propre `*.module.css`, qui n'utilise que les variables.
- Animations dans `src/styles/animations.css`, toujours désactivées si `prefers-reduced-motion`.

## Qualité
- Accessibilité : vrais `<button>`, `<a>`, `<label>` ; contraste AA ; navigation clavier.
- Mobile d'abord.
- Textes en français, vouvoiement.
