# Données de prix et calculs

Branche `feature/pricing-data` · 2026-11-04

## Ce qui a été fait
Options, listes par métier, précisions, packs offerts, prix du marché ; fonctions pures `calculerEstimation`, `packsActifs`, `suggestions`, `comparaisonMarche`.

## À quoi ça sert
Une seule source de vérité pour les prix, utilisée par l’accueil, Tarifs, le configurateur et le devis.

## Comment l’utiliser
Changer un prix : `src/data/offres.ts`. Les calculs suivent automatiquement.

## Tests
- **unitaires** : `src/data/calculs.test.ts` et `offres.test.ts` : options proposées, packs (option déjà choisie offerte), fourchette, suggestions, marché, cohérence des données.

Lancer : `cd front && npm run test`

## Fichiers principaux
- `src/data/offres.ts`
- `src/data/calculs.ts`

## Reste ouvert
- Rien.
