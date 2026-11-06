# Disponibilités réglées d'un clic

Branche `feature/disponibilites-admin` · 2026-11-06

## Ce qui a été fait
- **Jours travaillés** : sept boutons Lun à Dim, à la place des cases à cocher.
- **Heures** : grille de boutons de 7 h à 20 h, par demi-heure, groupée en matin, après-midi et soir, à la place du champ où l'on tapait « 09:00, 10:30 ». Une heure enregistrée hors de la grille reste affichée.
- **Congés** : clic dans le calendrier pour fermer ou rouvrir un jour, à la place de la saisie de date. Les jours fermés sont aussi listés, avec une croix.
- **Bouton Enregistrer** : le message de confirmation s'affiche juste à côté.
- **Bloc `Calendar`** : options `isMarked` et `markedLabel`, pour signaler des jours qui restent cliquables.
- Aucun changement côté API : mêmes données envoyées.

## Tests
- `DisponibilitesAdmin.test.tsx` : réglage affiché, clics enregistrés, fermeture et réouverture dans le calendrier, réouverture depuis la liste, heure hors grille, refus de l'API, réglage illisible.
- `Calendar.test.tsx` : jour marqué et cliquable.
- Lancer : `npm run test`.
- Manuel : capture de l'écran avec des données simulées, sur ordinateur.

## Reste ouvert
- Le chevauchement d'heures n'est pas contrôlé : 09:00 et 09:30 peuvent être choisies ensemble alors qu'un rendez-vous dure une heure.
