# Perfect Clean : mise à jour

Branche `feature/maj-perfect-clean` · 2026-11-16

## Ce qui a été fait
- Baptiste a demandé de mettre la réalisation Perfect Clean à jour avec ce qui a été ajouté depuis le matin dans `bsandoz-booking`.
- **Captures** (1 280 × 720, WebP, 26 à 73 Ko), prises sur la démo servie en local (données de démonstration, sans API) :
  - remplacées : accueil (scène finale, carte de texte et panneau « Réserver votre lavage »), prestations, réservation (formule complète), professionnels (encart de l'accueil) ;
  - ajoutées : abonnements (espace client), espace pro (tableau de bord), encaissement par QR code ;
  - gardées : zone d'intervention et carte de fidélité.
- **Textes** : résumé, solution et fonctionnalités complétés :
  - abonnements ;
  - paiement sur place ;
  - formule complète ;
  - espace pro installable ;
  - édition du site par l'artisan ;
  - accueil animé.
- **Capture écartée** : la scène de l'intérieur, car l'image IA montre des gobelets d'une marque connue.

- **Complément (`chore/capture-pro-rouge`)** : capture « Professionnels » refaite après le passage de l'encart en rouge sur la démo.

## À quoi ça sert
Montrer aux prospects l'état actuel de la démo, la plus complète des réalisations.

## Comment l'utiliser
Page `/realisations/demo-detailing` ; la carte figure aussi sur l'accueil et la page Artisan.

## Tests
- **fonctionnels** : `Realisations.test.tsx` vérifie la capture « Encaissement sur place » et la fonctionnalité « Abonnements sans engagement », en plus des vérifications existantes.

Lancer : `npm run test -w front -- Realisation`

## Fichiers principaux
- `front/src/data/realisations.ts`
- `front/src/assets/realisations/demo-detailing/`

## Reste ouvert
- Remplacer l'image de l'habitacle sale de la démo (gobelets de marque) avant de la montrer dans le portfolio.
