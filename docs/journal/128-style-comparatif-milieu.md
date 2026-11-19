# Comparatif : « Avec moi » au milieu

Branche `style/comparatif-milieu` · 2026-11-19

## Ce qui a été fait
Retour de Baptiste : mettre « Avec moi » au milieu ; l'encadré de conclusion « fait trop IA ».
- Colonnes dans l'ordre : Plateforme à abonnement, Avec moi, Agence web. « Avec moi » reste encadrée en rose avec la pastille « Recommandé ».
- Encadré de conclusion retiré (et son champ modifiable) : le tableau parle de lui-même. La petite note « lisez toujours le contrat » reste.

## Tests
- `Home.test.tsx` : ordre des colonnes avec la pastille sur celle du milieu, que des ✓ chez « Avec moi ».

## Fichiers principaux
- `front/src/data/accueil.ts`, `blocs.ts`, `front/src/pages/Home/sections/Comparatif.tsx`, `Comparatif.module.css`

## Reste ouvert
- Rien.
