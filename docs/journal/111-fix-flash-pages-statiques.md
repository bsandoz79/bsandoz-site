# Plus d'éclair de page sans mise en forme au chargement

Branche `fix/flash-pages-statiques` · 2026-11-18

## Ce qui a été fait
- Baptiste voyait, à chaque rechargement, la page en texte brut pendant un court instant, puis le site mis en forme.
- Cause : le texte écrit pour Google dans chaque page (fiche 107) s'affichait avant que React ne prenne la place.
- Ce texte est maintenant dans `<div data-statique>`, caché dès que JavaScript tourne (classe `js` posée sur `<html>` par le script du `<head>`, règle dans `base.css`). Google et les navigateurs sans JavaScript le lisent toujours.

## À quoi ça sert
Un chargement propre : fond du site puis page mise en forme, sans passage par du texte brut.

## Comment l'utiliser
Rien à faire.

## Tests
- **unitaire** : `prerendu.test.ts` vérifie que le texte est dans le bloc `data-statique`.
- **manuel (Chrome piloté par Playwright)** : JavaScript actif et site pas encore chargé → texte caché ; sans JavaScript → texte visible ; site chargé → bloc remplacé par React.

Lancer : `npm run test -w front -- prerendu`

## Fichiers principaux
- `front/src/seo/prerendu.ts`, `front/index.html`, `front/src/styles/base.css`

## Reste ouvert
- Rien.
