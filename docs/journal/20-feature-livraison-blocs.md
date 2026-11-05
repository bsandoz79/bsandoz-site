# Livraison de blocs à un client

Branche `feature/livraison-blocs` · 2026-11-05

## Ce qui a été fait
- Commande `npm run livrer` : copie les sources de blocs choisis dans le projet d'un client, avec leurs dépendances (suivies par les imports `../`), les styles de base, un `index.ts` et une note `LIVRAISON.md`. Sans tests par défaut (`--avec-tests`), sans écraser un bloc déjà livré (`--ecraser`).
- CGV : le site est livré complet et autonome ; clause sur les briques génériques réutilisées à compléter (à faire valider).
- Plan : le module Booking devient autonome, installable dans l'API propre de chaque client (au lieu d'un service partagé).
- Règles du projet (`.claude/CLAUDE.md`) : un site livré ne dépend jamais de nous.

## À quoi ça sert
Un site livré appartient au client, qui peut changer d'hébergeur ou de prestataire. Baptiste garde sa boîte à outils, y prend les fonctionnalités utiles, les personnalise et les livre dans le code du client.

## Comment l'utiliser
```sh
npm run livrer -- --liste
npm run livrer -- Calendar OptionCard --vers ../site-detailing/src/blocs
```
Puis, dans le site du client : `import './blocs/styles/base.css'` et `import { Calendar } from './blocs'`. Détails : `packages/blocs/README.md`.

## Tests
- **unitaires** : `packages/blocs/scripts/livraison.test.ts` (8 tests : blocs listés, imports externes, dépendances en chaîne, bloc inconnu refusé, copie sans tests, module partagé copié, tests sur demande, refus d'écraser, note).
- **intégration** : `Calendar`, `OptionCard` et `Reveal` livrés dans un site vierge **sans la bibliothèque installée** : type-check et build réussis.
- **fonctionnels** : `Legal.test.tsx` toujours vert après l'ajout dans les CGV.

Lancer : `npm run test -w packages/blocs`

## Fichiers principaux
- `packages/blocs/scripts/livraison.mjs`, `livrer.mjs`, `livraison.test.ts`
- `package.json` (script `livrer`), `packages/blocs/README.md`
- `front/src/data/legal.ts`, `docs/plan.md`, `docs/fonctionnalites/blocs.md`, `.claude/CLAUDE.md`

## Reste ouvert
- Formulation de la clause CGV à faire valider.
