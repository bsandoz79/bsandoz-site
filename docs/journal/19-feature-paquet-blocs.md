# Bibliothèque de blocs @bsandoz79/blocs

Branche `feature/paquet-blocs` · 2026-11-05

## Ce qui a été fait
- Espace de travail npm à la racine (`package.json`) : `packages/blocs` et `front`, un seul `package-lock.json`.
- Les 15 blocs déplacés de `front/src/blocks/` vers `packages/blocs/src/` (historique git conservé), avec leurs tests et README.
- Bibliothèque autonome : styles de base (variables par défaut sous `:where(:root)`, `.sr-only`) ajoutés en tête de `dist/blocs.css` ; animations de `Marquee` et `SitePreview` déclarées dans leur propre CSS ; classes préfixées `bsb-` ; React non embarqué ; types publiés dans `dist/types/`.
- Le site importe `@bsandoz79/blocs` (alias vers les sources, React dédoublonné).
- CI : job « Bibliothèque de blocs » ; front et déploiement adaptés à l'espace de travail ; workflow de publication sur GitHub Packages (étiquette `blocs-vX.Y.Z`).

## À quoi ça sert
Écrire un bloc une fois et l'utiliser sur bsandoz.fr et sur les sites des clients, chaque site gardant ses couleurs et choisissant sa version.

## Comment l'utiliser
- Dans ce dépôt : `import { Calendar } from '@bsandoz79/blocs'`.
- Dans un site client : voir `packages/blocs/README.md` (`.npmrc`, `npm install @bsandoz79/blocs`, `import '@bsandoz79/blocs/styles.css'`, variables à redéfinir).
- Publier : changer la version de `packages/blocs/package.json`, puis `git tag blocs-v1.1.0 && git push origin blocs-v1.1.0`.

## Tests
- **unitaires** : 62 tests des blocs, inchangés, désormais dans la bibliothèque (`npm run test -w packages/blocs`).
- **fonctionnels** : 206 tests du site, tous verts avec les blocs importés depuis la bibliothèque (`npm run test -w front`).
- **intégration** : paquet construit, empaqueté (`npm pack`) puis installé dans un site client vierge hors du dépôt : type-check et build réussis, styles des blocs et variables par défaut présents. Ce test a révélé un import CSS dans les types publiés, corrigé.
- **visuel** : configurateur capturé après déplacement, rendu identique.
- **CI** : workflows validés (YAML) et commandes rejouées en local depuis la racine.

Lancer tout : `npm run lint && npm run test && npm run build` (à la racine).

## Fichiers principaux
- `package.json` (racine), `package-lock.json`
- `packages/blocs/` (`package.json`, `vite.config.ts`, `tsconfig*.json`, `src/index.ts`, `src/styles/base.css`, `README.md`)
- `front/vite.config.ts`, `front/vitest.config.ts`, `front/tsconfig.app.json`
- `.github/workflows/ci.yml`, `deploy.yml`, `blocs-publication.yml`

## Reste ouvert
- Première publication : pousser l'étiquette `blocs-v1.0.0` quand vous voulez la rendre installable.
- Le serveur `npm run dev` de VS Code a été arrêté pour la réinstallation : le relancer depuis `front/` (`npm run dev`) ou depuis la racine (`npm run dev -w front`).
- Prochaine étape : module Booking multi-sites (un site = une clé), pour que le `Calendar` d'un site client réserve dans l'API.
