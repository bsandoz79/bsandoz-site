# Logos Instagram et Facebook en couleur

Branche `feature/logos-reseaux` · 2026-11-23

## Ce qui a été fait
Baptiste voulait les vrais logos à côté des liens Instagram et Facebook du pied de page.
- `IconeReseau` (`front/src/components/Footer/Footer.tsx`) : carré au dégradé Instagram avec l'appareil photo blanc, rond bleu Facebook (#0866ff) avec le « f » blanc, dessinés en SVG dans le code (aucune image à charger).
- Identifiant du dégradé unique (`useId`) pour ne jamais entrer en conflit avec un autre SVG de la page.
- Taille passée de 1,05 à 1,35 rem, écart texte-logo de 0,5 rem.

## Vérification
- Captures du pied de page sur ordinateur (1366 px) et téléphone (390 px) : logos nets, alignés avec le texte.
- Les tests existants (liens, nouvel onglet) passent sans changement : les logos sont décoratifs (`aria-hidden`).

## Fichiers principaux
- `front/src/components/Footer/Footer.tsx`, `front/src/components/Footer/Footer.module.css`
