# Compléments en pointillés, calcul des frais visible

Branche `style/complements-pointilles` · 2026-11-06

## Ce qui a été fait
- **Bloc « Les compléments »** au format demandé : cadres en pointillés, nom et détail à gauche, prix en rose à droite, deux colonnes sur ordinateur et une sur mobile.
- **Calcul des frais kilométriques** affiché en petit, juste sous le message, là où les frais sont annoncés : sur la carte (position hors zone) et sur la page Rendez-vous (adresse au-delà de 50 km). Exemple : « Calcul : 48 km × 0,1875 € = 9,00 € (2,50 € le litre × 7,5 L aux 100 km) ». Les fonctions sont `detailCalcul` et `origineCoutKm` (`data/zones.ts`).
- Il n'y a pas de cadre « Déplacement » dans les compléments, à ta demande : seulement la ligne de calcul, en petit, au bon endroit.

## Tests
- `CarteZones.test.tsx` :
  - format du calcul ;
  - ligne affichée hors zone, absente dans la zone.
- `RendezVous.test.tsx` : ligne de calcul pour une adresse lointaine.
- `Tarifs.test.tsx` : prix de chaque complément, lus dans son cadre.
- Lancer : `npm run test -w front -- CarteZones RendezVous Tarifs`.
- Manuel : captures des compléments (ordinateur, mobile) et du message de la carte depuis Lille.

## Reste ouvert
Rien.
