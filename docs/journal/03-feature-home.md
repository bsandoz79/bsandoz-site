# Page d’accueil

Branche `feature/home` · 2026-11-04

## Ce qui a été fait
Blocs `RotatingWords`, `Marquee`, `Card`, `Reveal`, `SectionTitle` ; polices ; données (formules, réalisations, textes) ; carte de réalisation ; accueil complet d’après la maquette.

## À quoi ça sert
La vitrine : présenter l’offre, rassurer, et amener vers le configurateur ou le rendez-vous.

## Comment l’utiliser
Textes dans `src/data/accueil.ts`, prix dans `src/data/offres.ts`, réalisations dans `src/data/realisations.ts`.

## Tests
- **unitaires** : Chaque bloc (animations coupées si « réduire les animations », liste lue une seule fois…) ; formatage des prix.
- **fonctionnels** : `pages/Home/Home.test.tsx` : ordre des sections, formules et prix, liens.

Lancer : `cd front && npm run test`

## Fichiers principaux
- `src/blocks/`
- `src/pages/Home/`
- `src/data/accueil.ts`
- `src/data/offres.ts`

## Reste ouvert
- Photo et captures à fournir ([à compléter]).
