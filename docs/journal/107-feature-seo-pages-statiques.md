# Pages lisibles par Google sans JavaScript

Branche `feature/seo-pages-statiques` · 2026-11-17

## Ce qui a été fait
- Baptiste ne voyait pas bsandoz.fr en cherchant « site web Amiens » ou « développeur web Amiens ».
- Avant : chaque page envoyait le même HTML vide (`<div id="root"></div>`), avec le même titre ; tout le reste arrivait par JavaScript.
- Maintenant, à la construction (`npm run build`), une page HTML par page publique (18 pages) : titre, description, adresse canonique, Open Graph, données structurées et texte principal (titre, présentation, services, réalisations, FAQ, zone, coordonnées).
- Titres de l'accueil, des pages métier et de l'informatique avec « Amiens ».
- Données de l'entreprise : Abbeville et la Somme dans la zone servie, fondateur, logo.
- `.htaccess` : `/a-propos` sert `a-propos.html`, sans barre finale ; les autres adresses gardent `index.html`.

## À quoi ça sert
Google et les assistants lisent le contenu et les infos locales dès la première visite, sans exécuter le JavaScript. Le visiteur voit le même site : React remplace ce contenu au chargement.

## Comment l'utiliser
Rien à faire : les pages suivent `data/pages.ts`, `data/realisations.ts` et les autres données. Une nouvelle page publique dans `pages` est générée automatiquement.

## Tests
- **unitaires** : `seo/prerendu.test.ts` (mêmes pages que le sitemap, Amiens et coordonnées sur l'accueil, fil d'Ariane, titre et canonique remplacés, échappement).
- **manuel** : HTML de `dist/` vérifié après `npm run build` ; en ligne, vérifié avec l'agent de Googlebot.

Lancer : `npm run test -w front -- seo`

## Fichiers principaux
- `front/src/seo/prerendu.ts`
- `front/scripts/prerendu.ts`
- `front/public/.htaccess`
- `front/package.json` (script `build`)

## Reste ouvert
- Fiche Google Business Profile (à créer par Baptiste) et avis clients.
- `noindex` pour `preview.bsandoz.fr`.
