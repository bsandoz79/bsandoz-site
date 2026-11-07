# Retrait des cartes des autres besoins

Branche `fix/retrait-cibles` · 2026-11-07

## Ce qui a été fait
Baptiste n'aimait pas les quatre cartes ajoutées sur l'accueil (fiche 88). Elles sont retirées : section, données, bloc modifiable et test.

Les besoins hors site (CRM, logiciel interne, outil pour photographes, carte par QR code) passent par une demande de devis. Baptiste fait ensuite une proposition. L'estimateur reste réservé aux sites, dont le prix se calcule.

## Tests
`Home.test.tsx` : ordre des sections sans la section retirée. Lancer : `npm run test -w front -- Home`.

## Reste ouvert
- Une page par métier quand un projet de ce type sera terminé.
