# Réalisations : captures agrandies par-dessus la page

Branche `feature/visionneuse-realisations` · 2026-11-20

## Ce qui a été fait
Retour de Baptiste : un clic sur une image d'un projet ouvrait un nouvel onglet, qu'il fallait fermer pour revenir. Maintenant l'image s'ouvre en grand par-dessus la page, sur fond sombre, avec une croix pour la fermer ; c'est le cas pour toutes les réalisations.
- Nouveau bloc réutilisable `Visionneuse` (repris du bloc du kit de réservation) : croix, Échap ou clic sur le fond pour fermer ; flèches (et ← →) pour passer d'une capture à l'autre, en boucle ; légende et position « 2 / 6 ».
- Page d'un projet : la couverture et les vignettes sont des boutons « Agrandir la capture : … » qui ouvrent la visionneuse sur la bonne capture.

## Tests
- `Visionneuse.test.tsx` (4) : légende et position, flèches et clavier, fermeture (croix, Échap, fond), une seule image sans flèches.
- `Realisations.test.tsx` : plus aucun lien d'image vers un nouvel onglet ; ouverture d'une vignette et de la couverture, image suivante, fermeture. Les tests des pages projet cherchent désormais les boutons « Agrandir la capture ».
- `npm run test` à la racine.

## Fichiers principaux
- `packages/blocs/src/Visionneuse/*`, `front/src/pages/Realisation/Realisation.tsx`, `Realisation.module.css`, `front/src/data/realisations.ts` (libellé `agrandir`)

## Reste ouvert
- Rien.
