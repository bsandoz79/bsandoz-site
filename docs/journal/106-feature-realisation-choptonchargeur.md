# Réalisation « Chope ton chargeur »

Branche `feature/realisation-choptonchargeur` · 2026-11-17

## Ce qui a été fait
- Ajout du projet Chope ton chargeur (`../choptonchargeur`, en ligne sur https://choptonchargeur.bsandoz.fr) aux réalisations, après Perfect Clean.
- 7 captures 1 280 × 720 en WebP (`assets/realisations/choptonchargeur/`), prises sur la version construite du site servie en local : accueil, recherche, fiche d'un téléphone, priorités d'achat, sans fil, ordinateurs, guide.
- Textes tirés du projet (README, docs/donnees.md, docs/referencement.md) ; les chiffres (1 566 téléphones, 87 fiches vérifiées, 30 ordinateurs, 120 pages) sont ceux du dépôt au 17/11/2026.

## À quoi ça sert
Montrer un projet personnel complet : moteur de compatibilité, interface de boutique, référencement.

## Comment l'utiliser
Page `/realisations/choptonchargeur`, carte sur l'accueil et sur la page Réalisations (filtre « Sites web »).

## Tests
- **fonctionnels** : `Realisations.test.tsx` (5 projets, filtre Sites web, page du projet avec capture et lien) ; `seo.test.ts` (page dans le plan du site).

Lancer : `npm run test -w front -- Realisations seo`

## Fichiers principaux
- `front/src/data/realisations.ts`, `front/src/data/realisationsIds.ts`
- `front/src/assets/realisations/choptonchargeur/`

## Reste ouvert
- Rien.
