# Bouton de rendez-vous et frais kilométriques

Branche `feature/bouton-rdv` · 2026-11-07

## Ce qui a été fait
- Baptiste trouvait la prise de rendez-vous peu claire : en haut de l'accueil, c'était un lien souligné avec une flèche.
- Nouveau composant `BoutonRdv`, distinct des autres boutons :
  - icône de calendrier dans un carré rose ;
  - contour rose, coins moins arrondis ;
  - couleur du texte héritée du fond.
- Utilisé partout où l'on prend rendez-vous :
  - haut de l'accueil, avec « Vous préférez en parler ? » devant ;
  - formulaire de contact ;
  - pied de page ;
  - À propos, pages métier, Informatique sur place.
- **Frais kilométriques** : la règle est écrite en petit dès que « Chez vous » est choisi, avant l'adresse, et plus en bas de page. La carte « Chez vous » reste courte.

## Tests
- `BoutonRdv.test.tsx` : vrai lien, nom lisible, icône décorative.
- Les tests de l'accueil, du rendez-vous et du pied de page restent verts.
- Vérifié dans Chrome : haut de l'accueil, pied de page, page rendez-vous.
- Lancer : `npm run test -w front`.

## Reste ouvert
- Retour de l'estimation, plus discrète que le devis : branche suivante.
