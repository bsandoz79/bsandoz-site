# Zones Amiens et Abbeville, frais kilométriques

Branche `feature/frais-kilometriques` · 2026-11-06

## Ce qui a été fait
- **Zones** : seulement Amiens et Abbeville, 50 km sans frais autour de chacune. Arras et Beauvais sont retirées de la carte.
- **Frais kilométriques** (`data/zones.ts`) :
  - seuls les kilomètres au-delà de 50 sont facturés, comptés depuis la base la plus proche ;
  - le kilomètre coûte 0,1875 € (2,50 € le litre × 7,5 L aux 100 km) ;
  - exemple : 100 km de distance, 50 km facturés, environ 9,38 €.
- **Page Rendez-vous** :
  - une adresse au-delà de 50 km n'est plus refusée ;
  - le message annonce les km en plus et le montant, dus même si le projet ne se fait pas ;
  - la visio et le téléphone restent gratuits.
- **Carte** : hors zone, le message donne le montant des frais.
- **CGV** : nouvelle section « Déplacements », qui précise que les frais sont dus même si aucun devis n'est accepté.
- **Textes mis à jour** : accueil (« 50 km autour d'Amiens et d'Abbeville »), À propos, Informatique sur place, espace client.

## Tests
- **Calculs** (`CarteZones.test.tsx`) :
  - coût du km ;
  - aucun frais à 50 km ou moins ;
  - 100 km → 50 km facturés, 9,38 € ;
  - format ;
  - zone en toutes lettres ;
  - base la plus proche.
- **Carte** : message hors zone avec le montant et la mention « dus même si le projet ne se fait pas ».
- **Rendez-vous** (`RendezVous.test.tsx`, `reservation.test.ts`) :
  - Abbeville sans frais ;
  - Lille accepté avec les km facturés, le montant et la mention ;
  - le calendrier s'ouvre ;
  - le statut `hors-zone` est calculé ;
  - la validation n'exige plus d'être dans la zone.
- **Lancer** : `npm run test -w front -- CarteZones RendezVous reservation Informatique`.
- **Manuel** : la carte affiche deux cercles ; depuis Lille, « à 98 km d'Amiens… environ 9,00 € ».

## Reste ouvert
- La distance est **à vol d'oiseau** et prise **en aller simple**, comme dans l'exemple donné : à confirmer s'il faut compter l'aller-retour ou la distance par la route.
- Les frais ne sont pas encore repris dans le mail de confirmation du rendez-vous (l'adresse y figure).
