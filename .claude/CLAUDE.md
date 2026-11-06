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
4. Avant de pousser : `npm run lint`, `npm run test`, `npm run build` doivent passer (et, si `api/` a changé, les tests PHPUnit de l'API).
5. **Avant CHAQUE push : une fiche dans `docs/journal/`** (une par branche, modèle dans `docs/journal/README.md`) : ce qui a été fait, à quoi ça sert, comment l'utiliser, les tests ajoutés (unitaires, fonctionnels, architecture…) et comment les lancer, les fichiers principaux, ce qui reste ouvert. La fiche est complétée à chaque nouveau push de la même branche.
   **Et la fiche de la fonctionnalité dans `docs/fonctionnalites/`** (créée ou mise à jour) : à quoi elle sert, le chemin suivi (fichiers et données), comment l'appeler (adresse, composant, fonction, point d'API et paramètres), si elle est réutilisable, un schéma Mermaid, ses tests. Vérifier que le schéma s'affiche.
   **Si la fonctionnalité se copie chez un client** : mettre à jour sa fiche dans `docs/mise-en-place/` (fichiers à copier, réglages, base, mails, domaine, vérifications, les deux façons de livrer).
6. Une fois la fonctionnalité et ses tests verts : push de la branche, fusion dans `main`, puis nouvelle branche pour la suite.
7. Jamais de secret dans le code : clés, mots de passe et accès vont dans les secrets GitHub ou un `.env` non versionné.

## Architecture
- Espace de travail npm à la racine (`package.json`) : `packages/blocs` et `front`. Installer et lancer depuis la racine (`npm ci`, `npm run test`, `npm run test -w front`…).
- `packages/blocs/` : bibliothèque **@bsandoz79/blocs**, blocs RÉUTILISABLES sur plusieurs sites, sans rien de propre à bsandoz.fr (calendrier, boutons, cartes, sélecteur d'options…). Chaque bloc a son dossier `src/<Bloc>/` : `Bloc.tsx`, `Bloc.module.css`, `Bloc.test.tsx`, `index.ts`, `README.md`, et il est exporté par `src/index.ts`. Le site l'importe par `@bsandoz79/blocs` (alias vers les sources). **Par défaut, un site livré à un client lui appartient et ne dépend pas de nous** : on lui livre les blocs par copie (`npm run livrer -- <Blocs> --vers <dossier>`), jamais par un accès privé. **Exception, seulement à sa demande : « je gère pour lui »** : il utilise mes serveurs et dépend de moi, c'est écrit dans un contrat, et il garde une sortie (code, base et réglages remis s'il part). Même alors : une installation par client (sa copie, sa base, son domaine), jamais de base commune. Voir `docs/mise-en-place/README.md`. Publication du paquet (sites gardés) : étiquette `blocs-vX.Y.Z`.
- `front/` : React + Vite + TypeScript.
  - `src/components/` : composants propres à ce site (en-tête, pied de page…), construits avec les blocs.
  - `src/pages/` : une page = un dossier.
  - `src/data/` : contenus et prix (jamais en dur dans les composants).
  - `src/styles/` : CSS global segmenté (tokens, base, mise en page, animations).
- `api/` : Symfony 7.4, monolithe modulaire, cœur hexagonal (voir `docs/api.md`). Tests : PHPUnit via Docker. Chaque module (Booking…) doit pouvoir s'installer seul dans l'API d'un client (son hébergement, sa base).

## CSS
- Variables de design dans `src/styles/tokens.css` uniquement (couleurs, typo, espacements, rayons, ombres).
- Chaque composant ou bloc a son propre `*.module.css`, qui n'utilise que les variables.
- Animations dans `src/styles/animations.css`, toujours désactivées si `prefers-reduced-motion`.

## Qualité
- Accessibilité : vrais `<button>`, `<a>`, `<label>` ; contraste AA ; navigation clavier.
- Mobile d'abord.
- Textes en français, vouvoiement.

## Sources à suivre
- `docs/cahier-des-charges.md` : ce que doit faire le site (pages, prix, configurateur, devis, rendez-vous, espace client, textes, design).
- `docs/plan.md` : l'ordre des branches. Prendre la première case non cochée, la cocher à la fin de la branche.
- `docs/maquette/*.dc.html` : maquette de référence. Ce sont des fichiers HTML avec styles en ligne ; la logique du configurateur est dans la balise `<script type="text/x-dc">` de `Configurateur.dc.html`. Les reproduire en composants React + CSS Modules, sans copier les styles en ligne.

## À chaque session
1. Relire ce fichier, `docs/plan.md` et `docs/CHANGELOG.md`.
2. `git pull`, puis créer la branche de la prochaine case du plan.
3. Travailler en petits commits, docs à jour à chaque commit.
4. Lint + tests + build verts → fiche du journal → push → fusion dans `main` → résumé de ce qui a été fait.
