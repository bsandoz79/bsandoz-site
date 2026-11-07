# Barre de navigation : Estimer, sans Métiers

Branche `feature/nav-estimation` · 2026-11-07

## Ce qui a été fait
- Baptiste ne retrouvait plus l'estimation, et se demandait si le menu « Métiers » restait pertinent.
- **Barre** : Réalisations, Tarifs, Estimer, À propos, puis « Demander un devis ». « Estimer » est un lien simple : le devis reste la seule action en bouton.
- **Menu « Métiers »** : retiré de l'en-tête (code, état et styles du sous-menu). Les quatre pages restent, listées dans le pied de page sous « Sites par métier », utiles pour le référencement.
- **Lien « Portfolio »** : retiré de la barre, il est déjà dans le pied de page.

## Tests
- `Header.test.tsx` : liens de la barre, « Estimer » vers `/composer?onglet=web`, plus de « Métiers » ni de « Portfolio ».
- `Footer.test.tsx` : colonne « Sites par métier ».
- Vérifié dans Chrome à 1 280 et 1 000 px, ainsi que le pied de page.
- Lancer : `npm run test -w front -- Header Footer`.

## Reste ouvert
- Les pages métier présentent encore quatre grandes catégories. On pourra les revoir avec le nouveau discours, « un site que vous modifiez vous-même ».
