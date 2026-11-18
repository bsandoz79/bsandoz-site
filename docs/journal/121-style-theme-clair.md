# Thème clair par défaut

Branche `style/theme-clair` · 2026-11-19

## Ce qui a été fait
Après la revue « patron de kebab » : le fond bleu nuit et le néon faisaient « tech », pas « commerçant ». Le site s'ouvre maintenant en **thème clair** ; le bouton de l'en-tête (lune) passe en thème nuit.
- `THEME_PAR_DEFAUT` = `clair` (`front/src/app/theme.ts`), script de `index.html` et couleur de la barre du téléphone (`#f7f6fa`) alignés.
- Le choix n'est retenu que si le visiteur clique sur le bouton : ceux qui avaient choisi la nuit la gardent.

## À quoi ça sert
Un site plus accueillant pour les artisans, commerçants et restaurateurs.

## Comment l'utiliser
Rien à faire. Pour revenir à la nuit par défaut : `THEME_PAR_DEFAUT` et le script de `index.html`.

## Tests
- `ThemeToggle.test.tsx` : clair par défaut, bascule nuit puis clair, choix retenu, valeur inconnue ignorée, rideau.
- **manuel** : accueil entier vérifié dans Chrome en clair.

Lancer : `npm run test -w front -- ThemeToggle`

## Fichiers principaux
- `front/src/app/theme.ts`, `front/index.html`, `ThemeToggle.test.tsx`

## Reste ouvert
- Rien.
