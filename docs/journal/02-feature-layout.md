# En-tête, pied de page, barre mobile

Branche `feature/layout` · 2026-11-04

## Ce qui a été fait
Blocs `Button` et `Container` ; en-tête (onglets Sites & applis / Informatique, menu, sous-menu Métiers, menu mobile) ; pied de page ; barre « Estimer » fixe sur mobile ; lien « Aller au contenu ».

## À quoi ça sert
La navigation commune à toutes les pages, utilisable au clavier et sur téléphone.

## Comment l’utiliser
Textes et liens dans `src/data/navigation.ts` (le téléphone s’affiche dès qu’il y est renseigné).

## Tests
- **unitaires** : Blocs `Button`, `Container` : rendu, variantes, attributs transmis.
- **fonctionnels** : `Header.test.tsx` (menu mobile, Échap, clic en dehors, onglet actif), `Footer.test.tsx`, `MobileBar.test.tsx`, `Layout.test.tsx` (lien d’évitement).

Lancer : `cd front && npm run test`

## Fichiers principaux
- `src/blocks/Button/`
- `src/blocks/Container/`
- `src/components/Header/`
- `src/components/Footer/`
- `src/components/MobileBar/`
- `src/data/navigation.ts`

## Reste ouvert
- Rien.
