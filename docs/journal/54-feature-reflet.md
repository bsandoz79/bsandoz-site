# Reflet lumineux

Branche `feature/reflet` · 2026-11-06

## Ce qui a été fait
- Nouvelle classe partagée `anim-reflet` (`src/styles/animations.css`) : une bande lumineuse inclinée, effet verre, traverse l'élément de gauche à droite en environ 0,7 s.
- Rythme : un passage toutes les 2,2 s.
- Placement : la bande passe **sous le texte** et au-dessus du fond, grâce à `isolation: isolate` et `z-index: -1`. Le texte garde donc tout son contraste.
- Intensité : une seule variable, `--reflet` dans `tokens.css`. Elle est forte en thème clair et légère en thème nuit.
- Décalage : la variable `--reflet-delai` fait passer le reflet d'une carte à l'autre, en vague (0 s, 0,25 s, 0,5 s).
- Animations réduites : la bande est retirée.
- Où on le voit :
  - le bouton « Estimer mon projet » du haut de l'accueil ;
  - les trois formules (Vitrine, Vitrine+, Fonctionnel), sur l'accueil et sur la page Tarifs.

## Utilisation
Ajouter la classe `anim-reflet` à un élément qui a un fond. Pour décaler le reflet, ajouter `style={{ '--reflet-delai': '0.3s' }}`.

## Tests
- `Home.test.tsx` et `Tarifs.test.tsx` vérifient que le bouton et les trois formules portent la classe.
- Lancer : `npm run test -w front -- Home Tarifs`.
- Vérification manuelle : captures en thème nuit et en thème clair, avec l'animation figée en plein passage.

## Reste ouvert
- La liste des retours du 2026-11-06 est ajoutée au plan (section V4).
