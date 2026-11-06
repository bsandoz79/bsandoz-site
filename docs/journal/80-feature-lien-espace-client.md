# Espace client dans l'en-tête

Branche `feature/lien-espace-client` · 2026-11-06

## Ce qui a été fait
- Le lien « Espace client » n'était que dans le pied de page. Il est maintenant **dans la barre de l'en-tête**, à côté du bouton de thème : icône de personne, avec le texte à partir de 1 200 px, et en toutes lettres dans le menu du téléphone.
- Défauts trouvés sur les captures et corrigés :
  - entre 960 et 1 099 px, le nom et « À propos » passaient sur deux lignes : les libellés restent sur une ligne, et le nom est masqué à l'écran (le logo reste) ;
  - sur téléphone, les boutons tombaient sous le logo : ils passent à 2,5 rem, et le nom est un peu plus petit sous 380 px.

## Tests
- `Header.test.tsx` : deux liens « Espace client » (barre et menu), vers `/mon-espace`.
- Lancer : `npm run test -w front -- Header`.
- Manuel, avec Chrome : captures à 1 280, 1 100, 1 000, 960, 390 et 360 px, sans débordement.

## Reste ouvert
Rien.
