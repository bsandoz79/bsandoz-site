# Prix d'une page supplémentaire sous chaque formule

Branche `feature/tarif-page-sup` · 2026-11-06

## Ce qui a été fait
Sous chacune des trois formules (page Tarifs et offres de l'accueil), une ligne « Page supplémentaire : + 50 € ». Le montant vient de l'option « Page supplémentaire » (`data/offres.ts`, fonction `lignePageSupplementaire()`) : le changer dans le back-office met les trois blocs à jour.

## Tests
- **fonctionnels** : `Tarifs.test.tsx` vérifie la ligne sous les trois formules, et qu'elle suit le prix de l'option (essai à 149 €).

Résultats : site 359 et bibliothèque 70 tests verts ; lint et build verts.

## Reste ouvert
- Prix à confirmer : 50 € (cahier des charges) ou 149 € (exemple donné) ; il se règle dans le back-office, onglet Prix.
