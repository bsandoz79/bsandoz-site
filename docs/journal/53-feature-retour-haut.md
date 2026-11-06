# Bouton « revenir en haut »

Branche `feature/retour-haut` · 2026-11-06

## Ce qui a été fait
- `components/RetourHaut` : bouton rond et transparent avec une flèche, en bas à droite de toutes les pages.
- **Quand il apparaît** : une fois la page descendue de plus de 600 px (réglage `retourHaut.seuil` dans `data/navigation.ts`). Il apparaît en fondu.
- **Au clic** : il remonte en haut de la page, en douceur, ou d'un coup si le visiteur a réduit les animations.
- **Accessibilité** : c'est un vrai `<button>` avec un nom (« Revenir en haut de la page ») ; caché, il sort du parcours clavier.
- **Sur mobile** : il se place au-dessus de la barre « Estimer » quand elle est affichée. La règle d'affichage de la barre est partagée (`barreMobileVisible`).

## Tests
- `RetourHaut.test.tsx` (fonctionnels) :
  - il est caché et hors du parcours clavier en haut de page ;
  - il apparaît puis disparaît selon le défilement ;
  - il remonte au clic ;
  - il se place au-dessus de la barre mobile seulement là où elle existe.
- Lancer : `npm run test -w front -- RetourHaut`.
- Manuel : captures sur mobile et sur ordinateur, en thème nuit et clair ; après le clic, la page est bien remontée en haut (position 0).

## Reste ouvert
Rien.
