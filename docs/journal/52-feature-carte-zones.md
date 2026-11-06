# Carte des zones d'intervention

Branche `feature/carte-zones` · 2026-11-06

## Ce qui a été fait
- **Section « Où j'interviens »** tout en bas de l'accueil : une carte OpenStreetMap (Leaflet) avec un cercle de 50 km autour d'Amiens, Abbeville, Arras et Beauvais. Les cercles se chevauchent, et chaque ville est nommée.
- **Choix de la ville** (Toutes, Amiens, Abbeville, Arras, Beauvais) : seul le cercle choisi reste affiché et la carte zoome dessus ; « Toutes » revient à l'ensemble. Les cercles prennent la couleur rose du thème.
- **Les zones sont aussi écrites en toutes lettres**, et la carte a un nom pour les lecteurs d'écran (selon la zone affichée).
- **Vie privée** :
  - la carte ne se charge qu'au clic sur « Afficher la carte », avec une phrase qui dit pourquoi (OpenStreetMap reçoit l'adresse IP) ;
  - le choix est gardé dans le navigateur pour les visites suivantes ;
  - la politique de confidentialité le mentionne ;
  - Leaflet n'est téléchargé qu'à ce moment-là (fichier à part, 44 Ko compressé).
- **Données** : `data/zones.ts` (villes, rayon, textes).

## Tests
- **unitaires et fonctionnels** (`CarteZones.test.tsx`, Leaflet simulé) : zones nommées en texte ; carte chargée seulement après accord, accord retenu ; une ville puis toutes ; liste des villes en français. L'accueil contient la section en dernier.
- **manuel**, dans un vrai navigateur : 8 tracés et 12 tuiles chargées, aucune erreur ; captures « Toutes » et « Amiens » (zoom).
- **Bug trouvé et corrigé pendant l'essai** : les limites des cercles étaient demandées avant qu'ils soient sur la carte (erreur Leaflet) ; elles sont maintenant calculées depuis le centre et le rayon.

Résultats : site 372 et bibliothèque 70 tests verts ; lint et build verts.

## Reste ouvert
- **À trancher** : la page Rendez-vous accepte un déplacement à moins de 50 km d'**Amiens** seulement. Faut-il aussi accepter Abbeville, Arras et Beauvais ?
