# Mentions légales : adresse de l'hébergeur

Branche `fix/adresse-hebergeur` · 2026-11-20

## Ce qui a été fait
La rubrique « Hébergeur » des mentions légales affichait « [adresse et téléphone de l'hébergeur à compléter] ». Elle donne maintenant : o2switch, SAS au capital de 100 000 €, RCS Clermont-Ferrand, SIRET 510 909 807 00032, siège chemin des Pardiaux, 63000 Clermont-Ferrand, téléphone 04 44 44 60 40, www.o2switch.fr.
- Siège : annuaire des entreprises (recherche-entreprises.api.gouv.fr, SIREN 510 909 807), relevé le 20/11/2026.
- Capital, RCS, SIRET et téléphone : page d'accueil d'o2switch, relevés le même jour.

## Tests
- `Legal.test.tsx` : la rubrique « Hébergeur » contient l'adresse du siège et plus aucun « à compléter ». Lancer : `npm run test -w front`.

## Fichiers principaux
- `front/src/data/legal.ts`, `front/src/pages/Legal/Legal.test.tsx`

## Reste ouvert
- Les autres « à compléter » des mentions et conditions (statut juridique, acompte, moyens de paiement, transfert du site, rétractation et médiateur, durée de conservation) attendent tes choix.
