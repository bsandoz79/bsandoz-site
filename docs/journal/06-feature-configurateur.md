# Configurateur « Composer mon site »

Branche `feature/configurateur` · 2026-11-04

## Ce qui a été fait
Page `/composer` : onglets accessibles, étapes successives, précisions, suggestions, estimation, comparaison au marché ; onglet Informatique (tarif sur devis) ; choix mémorisés dans le navigateur.

## À quoi ça sert
L’outil central : le visiteur compose son site et voit le prix, puis demande un devis ou un rendez-vous.

## Comment l’utiliser
`/composer?formule=vitrine`, `?metier=artisan`, `?onglet=informatique` préremplissent les choix.

## Tests
- **unitaires** : `stockage.test.ts` : lecture validée de ce qui est mémorisé, adresse.
- **fonctionnels** : `Composer.test.tsx` : étapes, précisions, pack offert, marché, mémorisation, onglets au clavier.

Lancer : `cd front && npm run test`

## Fichiers principaux
- `src/pages/Composer/`
- `src/data/configurateur.ts`
- `src/data/informatique.ts`

## Reste ouvert
- Rien.
