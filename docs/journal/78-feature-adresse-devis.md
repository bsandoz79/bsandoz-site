# Adresse dans la demande de devis

Branche `feature/adresse-devis` · 2026-11-06

## Ce qui a été fait
- À l'étape « Coordonnées », champ **« Votre adresse (ou votre ville) »**, obligatoire, avec une aide : « gratuit à 50 km d'Amiens ou d'Abbeville, frais kilométriques au-delà ».
- À la sortie du champ, l'adresse est **vérifiée**. La vérification est déplacée dans `app/adresse.ts` et partagée avec la page Rendez-vous. Le déplacement s'affiche sous le champ : gratuit avec la distance, ou frais aller-retour estimés.
- Récapitulatif, mail et pré-devis :
  - le récapitulatif et le mail ont deux nouvelles lignes, « Adresse » et « Déplacement » ;
  - le pré-devis envoyé à la personne a une ligne « Déplacement ».
- Une adresse pas encore vérifiée l'est à l'envoi.

## Tests
- `demande.test.ts` :
  - adresse exigée à l'étape 5 ;
  - « Repartir de zéro » la garde ;
  - `texteDeplacement` : gratuit, frais, à vérifier ;
  - lignes du récapitulatif.
- `Devis.test.tsx` :
  - 4 champs à corriger sans coordonnées ;
  - adresse vérifiée (géocodage simulé), message « Gratuit » ;
  - « Adresse » et « Déplacement » dans le récapitulatif et le pré-devis envoyés ;
  - limite d'envoi et échec réseau toujours gérés.
- Lancer : `npm run test -w front -- Devis demande`.

## Reste ouvert
Rien.
