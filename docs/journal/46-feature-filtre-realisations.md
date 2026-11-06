# Filtre des réalisations

Branche `feature/filtre-realisations` · 2026-11-06

## Ce qui a été fait
- Au-dessus des projets de la page Réalisations, trois filtres : **Tout**, **Sites web**, **Applis & plateformes**. C'est le bloc `ChoiceChips` : de vrais boutons radio, utilisables au clavier.
- Le nombre de projets affichés est annoncé aux lecteurs d'écran. Si aucun projet ne correspond, un message le dit.
- Le filtre est gardé dans l'adresse (`/realisations?type=site`), pour partager une vue filtrée ; un filtre inconnu revient à « Tout ».
- Chaque projet a un `type` (`site` ou `appli`) dans `data/realisations.ts`. Christophe Poix Moto et la démo detailing sont des sites web, O'RDV une appli ou plateforme.

## Tests
- **fonctionnels** (`Realisations.test.tsx`) : tout par défaut (3 projets), sites web (2), applis (1), retour à tout ; filtre repris de l'adresse ; filtre inconnu ignoré ; chaque projet a un type couvert par un filtre.
- **manuel** : capture sur ordinateur, filtre « Sites web » actif.

Résultats : site 365 et bibliothèque 70 tests verts ; lint et build verts.

## Fichiers principaux
- `front/src/pages/Realisations/`, `front/src/data/realisations.ts`
