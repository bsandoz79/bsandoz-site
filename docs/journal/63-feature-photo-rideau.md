# Photo en ouverture de rideau

Branche `feature/photo-rideau` · 2026-11-06

## Ce qui a été fait
- **Composant `Rideau`** (`components/Rideau`) : la première fois que la photo arrive à l'écran (visible à 35 %), deux panneaux, en dégradé bleu nuit vers rose avec un liseré rose, s'écartent vers les côtés en 1 s. La photo se pose en même temps avec un léger zoom.
- **Où** : la photo de Baptiste dans « Pourquoi moi » (accueil) et sur la page À propos.
- **Accessibilité** : avec les animations réduites, pas de panneaux, la photo est visible tout de suite. C'est aussi le cas sans IntersectionObserver.
- **Animation** : `anim-rideau` dans `styles/animations.css` (documentée dans `docs/styles.md`).

## Tests
- `Rideau.test.tsx` :
  - fermé hors de l'écran ;
  - ouvert à l'arrivée, une seule fois (observateur arrêté) ;
  - ouvert tout de suite sans IntersectionObserver.
- Lancer : `npm run test -w front -- Rideau`.
- Manuel : captures à mi-ouverture et à la fin, sur l'accueil.

## Reste ouvert
- Cette fiche et la section de `docs/fonctionnalites/pages-de-contenu.md` ont été ajoutées dans un second push de la branche, parce que le script de doc avait échoué au premier.
