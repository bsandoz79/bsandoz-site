# Logo « SB »

Branche `feature/logo-sb` · 2026-11-17

## Ce qui a été fait
- Baptiste a fourni un nouveau logo : un monogramme « SB » néon rose et bleu.
- **En-tête et pied de page** : l'image remplace les lettres « S B » sur fond bleu nuit (`front/src/assets/marque/logo-sb.png`, 96 px de haut, fond transparent, recadré au plus près).
- **Icône d'onglet** : `favicon-64.png` remplace `favicon.svg`, qui était encore l'icône par défaut de Vite.
- **Écran d'accueil iPhone** : `apple-touch-icon.png` (180 px, fond blanc, car iOS refuse la transparence).
- **Grand format** : `logo.png` (512 px).

## À quoi ça sert
Donner au site une identité reconnaissable, aussi dans l'onglet du navigateur et sur l'écran d'accueil.

## Comment l'utiliser
Rien à faire : le logo s'affiche partout. Pour le changer, remplacer les images ci-dessus en gardant leurs noms.

## Tests
- **fonctionnels** : `Header.test.tsx` vérifie toujours que le logo ramène à l'accueil (nom accessible « Baptiste Sandoz », image décorative).
- **manuel** : vérifié dans Chrome, sur ordinateur et sur téléphone, en thème sombre.

Lancer : `npm run test -w front -- Header`

## Fichiers principaux
- `front/src/components/Header/Header.tsx`, `Header.module.css`
- `front/src/components/Footer/Footer.tsx`, `Footer.module.css`
- `front/index.html`, `front/public/`

## Reste ouvert
- Rien.
