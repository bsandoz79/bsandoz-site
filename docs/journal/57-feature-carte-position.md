# Position du visiteur sur la carte

Branche `feature/carte-position` · 2026-11-06

## Ce qui a été fait
- **Demande de position** au moment où la carte apparaît à l'écran (visible à 40 %), une seule fois : `components/CarteZones/usePosition.ts`.
- **Position acceptée** :
  - un point « Vous êtes ici » apparaît sur la carte, cadrée sur ce point et la zone la plus proche ;
  - dans la zone : « Bonne nouvelle : vous êtes dans ma zone, à 15 km d'Amiens. Je peux venir chez vous. » ;
  - hors zone : un message rassurant, qui annonce un déplacement possible avec seulement des frais kilométriques (essence), et rappelle que la visio et le téléphone restent possibles.
- **Position refusée** :
  - la carte reste normale ;
  - un petit bouton « Me situer sur la carte » (icône de repère, en pilule) est placé sous la carte ;
  - si le navigateur bloque encore, une phrase dit comment réautoriser la position.
- **Calculs** :
  - la zone de référence est la plus proche des quatre villes ;
  - la formule de distance est partagée avec la page Rendez-vous (`data/distance.ts`) ;
  - élision correcte : « d'Amiens », « d'Arras », « de Beauvais ».
- **Vie privée** : la position reste dans le navigateur. La politique de confidentialité le dit.

## Tests
- `CarteZones.test.tsx`, avec une géolocalisation simulée et des observateurs de défilement simulés :
  - aucune demande avant l'apparition de la carte ;
  - dans la zone (point placé, message) ;
  - hors zone (frais kilométriques) ;
  - refus, puis nouvelle demande, puis blocage du navigateur, puis acceptation ;
  - navigateur sans géolocalisation ;
  - élision et ville la plus proche.
- Lancer : `npm run test -w front -- CarteZones`.
- Vérification manuelle dans un vrai navigateur, avec une position simulée :
  - Corbie : « à 15 km d'Amiens », point affiché ;
  - Paris (mobile) : « à 67 km de Beauvais », frais kilométriques ;
  - position refusée : pas de message, le bouton apparaît.

## Reste ouvert
- **À trancher** : la page Rendez-vous ne vérifie encore que les 50 km autour d'Amiens. Faut-il accepter aussi les trois autres villes, et facturer des frais kilométriques au-delà ?
