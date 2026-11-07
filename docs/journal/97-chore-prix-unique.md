# Un seul prix : à partir de 390 €

Branche `chore/prix-unique` · 2026-11-07

## Ce qui a été fait
- Baptiste préfère retirer les prix détaillés et n'en afficher qu'un. Son choix : 390 €, celui de la Vitrine+, qui tient la promesse « un site que vous modifiez vous-même ». L'estimation est retirée avec.
- **Retirés** :
  - les pages Tarifs et Estimation ;
  - les composants `Complements` et `OffreSeo` ;
  - le pré-devis et les données `tarifs.ts` et `configurateur.ts` ;
  - l'estimation jointe au formulaire ;
  - les blocs de formules du registre ;
  - les données structurées `OfferCatalog`.
- `/tarifs` et `/composer` redirigent vers `/devis`.
- **Haut de l'accueil** : « Sites à partir de 390 €. Le prix exact dans votre devis, sous 24 h. » Le montant vient de `prixDepart()` et se modifie dans le bloc « Haut de page ».
- **FAQ, pages métier, mentions** : plus aucun montant. Les CGV gardent le tarif horaire, qui est contractuel.
- **Barre** : Réalisations, À propos, Questions fréquentes, puis « Demander un devis ». Le lien vers `/#faq` n'est plus surligné sur l'accueil.

## Tests
- **Accueil** : un seul prix visible, hors téléphone de démonstration décoratif (« acompte 30 € » d'un client fictif).
- **Autres tests mis à jour** :
  - FAQ sans prix, pages métier sans « € » ;
  - redirections de `/tarifs` et `/composer` ;
  - en-tête, pied de page ;
  - édition par bloc, maintenant sur le haut de l'accueil avec le prix ;
  - SEO.
- **Résultats** : 348 tests pour le site, 80 pour les blocs.
- **Lancer** : `npm run test`.

## Reste ouvert
- **Back-office** : les prix des formules et options restent modifiables pour les devis. Seul celui de la Vitrine+ s'affiche encore sur le site.
