# L'informatique à domicile, une page à part

Branche `style/informatique-a-part` · 2026-11-19

## Ce qui a été fait
Après la revue « patron de kebab » : l'onglet « Informatique sur place » en haut de chaque page faisait se demander si Baptiste est développeur ou réparateur de PC.
- La barre d'onglets « Sites & applis / Informatique sur place » est retirée de l'en-tête : il ne reste que la barre principale (plus simple aussi au défilement).
- La page `/informatique` reste en ligne et dans le plan du site, liée en pied de page sous « Dépannage informatique à domicile ».

## À quoi ça sert
Un message clair : création de sites et d'applis. Le dépannage reste trouvable pour ceux qui le cherchent.

## Comment l'utiliser
Rien à faire.

## Tests
- `Header.test.tsx` : plus d'onglets de catégories. `Informatique.test.tsx` : la page s'affiche toujours.

Lancer : `npm run test -w front -- Header Informatique`

## Fichiers principaux
- `front/src/components/Header/Header.tsx`, `Header.module.css`, `front/src/data/navigation.ts`

## Reste ouvert
- Rien.
