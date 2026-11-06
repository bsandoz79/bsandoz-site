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

## Effets
- Animations globales (`animations.css`) : `anim-appear`, `anim-float`, `anim-pulse`, `anim-respire`. Toutes coupées si « réduire les animations ».
- Fonds sombres : `--color-navy` / `--color-navy-deep` avec une lueur `--color-rose-glow` ; lignes et voiles : `--color-line-on-dark`, `--color-veil-on-dark`.
- Boutons : soulèvement au survol, halo `--shadow-rose` pour le principal.

## Thèmes
- **Nuit** (par défaut) et **clair** : `:root` porte les valeurs du thème clair, `:root[data-theme='nuit']` celles du thème nuit, dans `tokens.css`. Les composants n'utilisent que les variables : rien à changer pour eux.
- Variables de rôle : `--color-accent-texte` (rose utilisé comme texte), `--color-rose-hover` (fond au survol sous un texte blanc), `--fond-page` (fond de la page : uni en clair, ciel de nuit en sombre).
- Choix : `src/app/theme.ts` (stockage local `bsandoz.theme`), bouton `components/ThemeToggle` dans l'en-tête ; un petit script dans `index.html` applique le thème avant l'affichage.
- Contrastes vérifiés (AA) dans les deux thèmes : texte et texte discret sur fond et surface, accent sur fond, blanc sur le rose et son survol, badges, panneaux sombres.

