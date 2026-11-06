# Message des frais kilométriques

Branche `style/message-frais` · 2026-11-06

## Ce qui a été fait
- **Carte, message de position** : le trait rose à gauche est retiré. Le message est maintenant un cadre arrondi discret (bordure fine, fond de surface) avec une petite icône ronde devant le texte : une coche verte dans la zone, une voiture rose hors zone. Le calcul des frais reste en petit sous le texte.
- **Page Rendez-vous** : le message d'une adresse au-delà de 50 km n'est plus en rouge, la couleur des erreurs. Il est en couleur de texte normale, puisque le déplacement est accepté.

## Tests
- Les tests existants (`CarteZones.test.tsx`, `RendezVous.test.tsx`) passent sans changement : seule la présentation change.
- Manuel : captures du message dans la zone (Corbie) et hors zone (Lille).

## Reste ouvert
Rien.
