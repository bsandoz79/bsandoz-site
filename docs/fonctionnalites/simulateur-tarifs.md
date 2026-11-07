# Page Tarifs et simulateur

**Retiré le 2026-11-07** (`chore/prix-unique`), à la demande de Baptiste : le site n'affiche plus qu'un prix de départ, « Sites à partir de 390 € ». Tout le reste est chiffré dans le devis, demandé avec le [formulaire court](demande-de-devis.md).

- Les anciennes adresses `/tarifs` et `/composer` mènent à `/devis`.
- Le code est dans l'historique git, avant la fusion de `chore/prix-unique`.
- Les prix restent dans `data/offres.ts`, pour le back-office (devis, prix modifiables). `prixDepart()` donne le prix affiché (celui de la Vitrine+).
