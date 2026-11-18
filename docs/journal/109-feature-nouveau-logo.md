# Nouveau logo « SB »

Branche `feature/nouveau-logo` · 2026-11-18

## Ce qui a été fait
- Baptiste a fourni un nouveau logo : « SB » en lettres pleines, S rose et B bleu (photo du logo en relief sur un mur).
- Les lettres ont été détourées de la photo (le mur gris et les ombres retirés, fond transparent), puis déclinées :
  - **En-tête et pied de page** : `front/src/assets/marque/logo-sb.png` (144 px de haut pour les écrans haute définition, affiché à 40-44 px) ; dimensions de l'image passées à 152 × 96 (nouveau format, plus large).
  - **Icône d'onglet** : `favicon-64.png`.
  - **Écran d'accueil iPhone** : `apple-touch-icon.png` (180 px, fond blanc).
  - **Grand format** (données structurées pour Google) : `logo.png` (512 px).

## À quoi ça sert
Une identité plus sobre et lisible que le monogramme néon.

## Comment l'utiliser
Rien à faire : le logo s'affiche partout. Pour le changer, remplacer les images ci-dessus en gardant leurs noms.

## Tests
- **fonctionnels** : `Header.test.tsx` vérifie toujours que le logo ramène à l'accueil.
- **manuel** : vérifié dans Chrome sur ordinateur et sur téléphone.

Lancer : `npm run test -w front -- Header`

## Fichiers principaux
- `front/src/assets/marque/logo-sb.png`, `front/public/` (logo, icônes)
- `front/src/components/Header/Header.tsx`, `Footer/Footer.tsx` et leurs `*.module.css`

## Reste ouvert
- Une version vectorielle (SVG) du logo serait plus nette encore : à faire si le fichier source du logo est disponible.
