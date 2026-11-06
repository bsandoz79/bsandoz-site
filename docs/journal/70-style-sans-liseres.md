# État « choisi » et bouton de confirmation

Branche `style/sans-liseres` · 2026-11-06

## Ce qui a été fait
- **Choix sélectionnés** (bibliothèque `@bsandoz79/blocs`) : la bordure rose épaisse sur fond violet est retirée partout.
  - **Pastilles** (`ChoiceChips`) : choisie = fond rose plein, texte blanc. Contraste AA : 5,7 en thème clair, 5,1 en thème nuit.
  - **Cartes de choix** (`ChoiceChips` variante cartes : lieu du rendez-vous, formule, activité…) : bordure neutre plus marquée et petite coche ronde rose en haut à droite.
  - **Cartes d'options** (`OptionCard`) : bordure neutre plus marquée ; la case cochée suffit.
  - Le prix, dans le choix, reste dans la couleur du texte.
- **Page Rendez-vous** : le bouton « Confirmer le rendez-vous » est maintenant en bas du formulaire, juste après la case d'accord. Avant, il était dans le récapitulatif collé en haut à droite, au-dessus de la dernière réponse. Le récapitulatif garde la date, l'heure et le lieu.

## Tests
- `RendezVous.test.tsx` : le bouton vient après la case d'accord, et le récapitulatif n'a plus de bouton.
- Les tests des blocs passent sans changement (seul le style change).
- Lancer : `npm run test` (bibliothèque et site).
- Manuel : captures du simulateur (pastilles et options) et de la page Rendez-vous.

## Reste ouvert
- Passe « moins IA » (branche suivante).
