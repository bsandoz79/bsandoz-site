# Styles

Le CSS est découpé ainsi :

| Fichier | Rôle |
| --- | --- |
| `src/styles/tokens.css` | variables : couleurs, typo, espacements, rayons, ombres |
| `src/styles/base.css` | bases communes (corps, titres, liens, focus) |
| `src/styles/layout.css` | conteneur et sections |
| `src/styles/animations.css` | animations partagées, coupées si « réduire les animations » |
| `Bloc.module.css` | styles d'un bloc ou composant, uniquement avec les variables |

Polices : Plus Jakarta Sans (titres) et Inter (texte), chargées depuis Google Fonts dans `index.html`.

Animations partagées : `anim-appear`, `anim-float` (flottement), `anim-pulse` (halo autour du bouton principal), et l'animation `marquee` utilisée par le bloc `Marquee`.

Couleurs : bleu marine `--color-navy` et rose `--color-rose` (logo SB).
