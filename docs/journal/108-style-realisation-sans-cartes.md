# Page d'une réalisation sans cartes, et réalisation « Cadeaux »

Branche `style/realisation-sans-cartes` · 2026-11-17

## Ce qui a été fait
- Baptiste trouvait que les rubriques d'une réalisation (« Le contexte », « Le besoin », « La solution », « Ce que fait le site ») faisaient « généré » : des cartes avec une barre rose en haut.
- Elles deviennent une suite de rubriques séparées par un simple filet : titre en petites capitales grises, texte en plus grand, largeur de lecture limitée. Sur grand écran, le titre est dans une colonne étroite à gauche ; sur téléphone, au-dessus du texte. La liste des fonctionnalités perd ses coches au profit de puces simples.
- Nouvelle réalisation « Cadeaux » (https://cadeaux.bsandoz.fr), avec 7 captures prises sur des données d'exemple.

## Tests
- **unitaires** : nombre de réalisations et filtre « Applis & plateformes » mis à jour, page Cadeaux (titre, lien vers le site, fonctionnalités, captures), plan du site.
- **manuel** : Chrome à 390 px et 1 280 px.

Lancer : `npm run test -w front -- Realisation`

## Fichiers principaux
- `front/src/pages/Realisation/Realisation.module.css`
- `front/src/data/realisations.ts`, `front/src/data/realisationsIds.ts`
- `front/src/assets/realisations/cadeaux/`

## Reste ouvert
- Rien.
