# Page Tarifs

Branche `feature/tarifs` · 2026-11-04

## Ce qui a été fait
Blocs `ChoiceChips`, `OptionCard`, `PriceSummary` ; page Tarifs avec simulateur du Fonctionnel. Correctifs : workflow de déploiement invalide (ligne 33) et fourchette jamais sous 989 €.

## À quoi ça sert
Montrer les prix clairement et laisser simuler un site fonctionnel.

## Comment l’utiliser
Textes dans `src/data/tarifs.ts`.

## Tests
- **unitaires** : Blocs (vrais boutons radio et cases à cocher, total annoncé aux lecteurs d’écran).
- **fonctionnels** : `pages/Tarifs/Tarifs.test.tsx` : prix en direct, packs, suggestion, options gardées au changement d’activité.

Lancer : `cd front && npm run test`

## Fichiers principaux
- `src/pages/Tarifs/`
- `src/blocks/ChoiceChips/`
- `src/blocks/OptionCard/`
- `src/blocks/PriceSummary/`

## Reste ouvert
- Rien.
