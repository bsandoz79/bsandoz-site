# Navigation qui se cache au défilement, pied de page sombre

Branche `feature/nav-pied-de-page` · 2026-11-06

## Ce qui a été fait
- **En-tête toujours accessible** :
  - collé en haut de l'écran, avec un léger flou derrière ;
  - il se cache quand on descend et réapparaît dès qu'on remonte (`useMasquageAuDefilement`) ;
  - il reste visible en haut de page, quand le menu ou le sous-menu « Métiers » est ouvert, et quand le focus clavier est dedans ;
  - une ombre apparaît dès que la page a défilé ;
  - l'animation est coupée si l'utilisateur réduit les animations.
- **Pied de page** refait sur fond bleu marine avec une lueur rose :
  - une bande d'appel à l'action (« Un projet en tête ? », Estimer mon projet, Rendez-vous gratuit) ;
  - la présentation avec le logo, puis « Le site » et « Contact » côte à côte, même sur téléphone ;
  - en bas : droits de l'année et pages légales sur une ligne ;
  - plus compact qu'avant, contrastes AA.
- **Barre mobile** : la place réservée en bas de page prend la couleur du pied de page.
- **Variables de design** ajoutées dans `tokens.css` (bleu nuit, lueur rose, lignes et voiles sur fond sombre, ombre d'en-tête) : aucune couleur écrite en dur.
- **Lint** : deux avertissements corrigés (année calculée une seule fois, variable de nettoyage dans `Connexion.tsx`).

## Tests
- **unitaires** : `useMasquageAuDefilement.test.tsx` (se cache en descendant, revient en remontant, visible en haut, petits mouvements ignorés, bloqué par le menu ou le focus) ; `Footer.test.tsx` (appel à l'action, liens du site, droits de l'année, en plus des tests existants).
- **manuel** : captures à 390 px et 1 280 px ; en-tête mesuré dans un vrai navigateur : décalé de toute sa hauteur après une descente, revenu après une remontée.

Résultats : site 344 et bibliothèque 70 tests verts ; lint et build verts.

## Fichiers principaux
- `front/src/components/Header/` (`useMasquageAuDefilement.ts`, `Header.tsx`, `Header.module.css`)
- `front/src/components/Footer/`, `front/src/data/navigation.ts`, `front/src/styles/tokens.css`

## Reste ouvert
- Points suivants de la refonte : une réalisation affichée seule, formulaires modernisés, site plus dynamique (dont le cadre de téléphone façon iPhone récent).
