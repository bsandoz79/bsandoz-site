# Icône d'onglet : nouveau logo partout

Branche `fix/icone-onglet` · 2026-11-18

## Ce qui a été fait
- Après le nouveau logo (fiche 109), l'onglet montrait encore l'ancienne icône : les navigateurs gardent une icône tant que son adresse ne change pas, et `/favicon.ico` (cherché tout seul par les navigateurs et par Google) n'existait pas.
- **`favicon.ico`** ajouté (16, 32 et 48 px).
- Adresses des icônes suivies de `?v=2` dans `front/index.html` (et donc dans toutes les pages écrites à la construction) : les navigateurs reprennent la nouvelle icône.
- **`favicon.svg`** : l'ancien fichier de Vite restait sur le serveur (le déploiement ne supprime rien) ; il est remplacé par le nouveau logo.

## À quoi ça sert
Voir le même logo dans l'onglet, les favoris, l'écran d'accueil du téléphone et les résultats Google.

## Comment l'utiliser
À chaque nouveau logo : remplacer les fichiers et passer `?v=2` à `?v=3` dans `front/index.html`.

## Tests
- `npm run lint`, `npm run test -w front`, `npm run build -w front` : verts ; les 13 pages construites citent la nouvelle icône.

## Fichiers principaux
- `front/index.html`, `front/public/favicon.ico`, `front/public/favicon.svg`

## Reste ouvert
- Google met à jour l'icône de ses résultats à son rythme (souvent quelques jours ou semaines).
