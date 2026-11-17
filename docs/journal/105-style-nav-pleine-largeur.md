# Barre de navigation pleine largeur

Branche `style/nav-pleine-largeur` · 2026-11-17

## Ce qui a été fait
- Baptiste voulait que la barre de navigation prenne toute la largeur de l'écran.
- Bloc `Container` (`packages/blocs`) : nouvelle taille `full` (pas de largeur maximale, marges latérales gardées), documentée dans son README.
- En-tête : la barre principale et les onglets « Sites & applis / Informatique sur place » utilisent `size="full"`. Sur grand écran, le logo est contre le bord gauche, l'espace client et le thème contre le bord droit.

## À quoi ça sert
Une barre plus aérée sur grand écran, alignée sur les bords.

## Comment l'utiliser
`<Container size="full">` pour tout bandeau qui doit occuper la largeur de l'écran.

## Tests
- **unitaires** : `Container.test.tsx` vérifie la classe `full`.
- **manuel** : vérifié dans Chrome à 1 600 px de large.

Lancer : `npm run test -w packages/blocs -- Container`

## Fichiers principaux
- `packages/blocs/src/Container/`
- `front/src/components/Header/Header.tsx`

## Reste ouvert
- Rien.
