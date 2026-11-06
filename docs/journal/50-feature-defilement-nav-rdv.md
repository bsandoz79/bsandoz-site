# Onglets seulement en haut de page, étapes du rendez-vous centrées

Branche `feature/defilement-nav-rdv` · 2026-11-06

## Ce qui a été fait
- **En-tête** :
  - en descendant, il se cache entièrement ;
  - en remontant, seule la barre principale (logo, navigation, thème) revient ;
  - la barre « Sites & applis / Informatique sur place » ne s'affiche que tout en haut de la page.
  - Le hook `useMasquageAuDefilement` renvoie maintenant `enHaut`, et l'en-tête remonte de la hauteur des onglets (`--hauteur-onglets`).
- **Rendez-vous** : quand une étape s'ouvre (le lieu validé ouvre l'étape 2, le créneau choisi ouvre l'étape 3), la page défile jusqu'à elle et la centre à l'écran (`useCentrerEtape`).
  - Défilement doux, ou instantané si l'utilisateur réduit les animations.
  - Le focus clavier n'est pas déplacé.
  - Changer de créneau quand l'étape 3 est déjà ouverte ne refait pas défiler.

## Tests
- **unitaires** : `useMasquageAuDefilement.test.tsx` (en remontant hors du haut de page : barre principale visible, onglets non ; en haut : tout visible).
- **fonctionnels** : `RendezVous.test.tsx` (choisir la visio centre l'étape 2 ; choisir un jour ne suffit pas ; choisir un créneau centre l'étape 3 ; changer de créneau ne refait pas défiler).
- **manuel**, dans un vrai navigateur : décalage de l'en-tête de 0 px en haut, −121 px après une descente, −44 px (hauteur des onglets) en remontant, 0 px revenu en haut.

Résultats : site 368 et bibliothèque 70 tests verts ; lint et build verts.

## Fichiers principaux
- `front/src/components/Header/` (`useMasquageAuDefilement.ts`, `Header.tsx`, `Header.module.css`)
- `front/src/pages/RendezVous/useCentrerEtape.ts`, `RendezVous.tsx`
