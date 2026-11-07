# Édition sur place

Branche `feature/edition-sur-place` · 2026-11-07

## Ce qui a été fait
Baptiste ne voulait plus du panneau qui s'ouvrait à droite : il veut cliquer sur le prix ou sur le texte, le changer et enregistrer.

- **`EditeurBloc`** remplace `PanneauBloc` :
  - un cadre en pointillé sur chaque texte, prix et image du bloc ;
  - une bulle de saisie sous l'élément cliqué ;
  - un aperçu immédiat dans la page ;
  - une barre fixée en bas de l'écran (Annuler, Enregistrer, nombre de changements) ;
  - « Autres textes » pour ce qui ne se voit pas.
- **`cibles.ts`** repère où chaque champ est affiché : texte exact, prix mis en forme, adresse des images.
- **Enregistrement** : mêmes appels d'API qu'avant, l'API n'a pas changé.

## Tests
- `BlocModifiable.test.tsx` réécrit : 10 tests.
- Résultats : 349 tests pour le site, 80 pour les blocs.
- Vérifié dans Chrome avec une API simulée : cadres sur le haut de l'accueil, bulle du prix, barre en bas.
- Lancer : `npm run test -w front -- BlocModifiable`.

## Reste ouvert
- **Textes non encadrés** : un texte coupé par une mise en forme (un mot en gras au milieu) n'est pas encadré. Il reste modifiable dans « Autres textes ».
- **À essayer pour de vrai** : sur preview.bsandoz.fr, connecté au back-office.
