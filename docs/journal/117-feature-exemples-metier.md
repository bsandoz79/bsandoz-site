# Réalisations filtrées par métier

Branche `feature/exemples-metier` · 2026-11-18

## Ce qui a été fait
Idée reprise de Roselyn Pro (exemples par métier) : la page Réalisations a un second filtre, **par métier** : Artisans et services, Commerce et restauration, Entreprises, Photographes, Projets personnels.
- Un métier choisi montre ses réalisations **et** les exemples d'outils de ce secteur (maquettes, toujours marquées « Exemple »).
- Les deux filtres se combinent (ex. Commerce et restauration + Sites web) et restent dans l'adresse (`?type=site&metier=commerce`), pour partager un lien.
- Sans métier choisi, la page est comme avant (réalisations seules).

## À quoi ça sert
Qu'un restaurateur ou un artisan voie tout de suite ce qui ressemble à son activité.

## Comment l'utiliser
Métier de chaque carte dans `front/src/data/secteurs.ts` (`secteurDe`) ; un test vérifie que chaque réalisation et chaque exemple en a un.

## Tests
- `Realisations.test.tsx` : filtre par métier, exemples marqués « Exemple », combinaison avec le type, métier repris de l'adresse, chaque carte a un métier.

Lancer : `npm run test -w front -- Realisations`

## Fichiers principaux
- `front/src/data/secteurs.ts`, `front/src/pages/Realisations/Realisations.tsx`

## Reste ouvert
- Version ordinateur et téléphone côte à côte sur chaque carte : il faudra des captures téléphone de chaque projet.
