# Compléments et simulateur sur les trois formules

Branche `feature/tarifs-complements` · 2026-11-06

## Ce qui a été fait
- **Nouveaux prix** (`data/offres.ts`) :
  - intervention à **29 € / h** (`tarifHoraire`) ;
  - **suivi mensuel 29 € / mois**, hébergement et maintenance (`abonnementMensuel`) ;
  - **référencement Google seul : 400 €**. C'est 20 % sous le bas de la fourchette du marché, 500 à 1 200 € pour l'audit et l'optimisation SEO d'un site vitrine par un freelance (source affichée : Freelance Solution, 2026). Le calcul est fait par `prixSeoSeul()` à partir de `marche.seo` et de `REMISE_SEO`.
- **Bloc « Les compléments »** (`components/Complements`) : page supplémentaire, suivi mensuel, heure et SEO seul, à part et bien visibles, sous les formules de l'accueil et de la page Tarifs. La ligne « Page supplémentaire » n'est plus répétée dans chaque carte.
- **« À partir de »** sur Vitrine et Vitrine+ comme sur le Fonctionnel. Sur les cartes, la mention est en petit au-dessus du montant. Les données structurées utilisent `minPrice` pour les trois formules.
- **Simulateur de la page Tarifs** :
  - plus aucune formule n'est choisie à l'avance ; on choisit Vitrine, Vitrine+ ou Fonctionnel ;
  - l'activité n'est demandée que pour le Fonctionnel ;
  - les options suivent la formule.
- Les textes suivent automatiquement : FAQ, CGV, « Et après la mise en ligne ? ».

## Tests
- `Tarifs.test.tsx` :
  - « à partir de » sur les trois cartes ;
  - le bloc des compléments (4 éléments et leurs prix), sans ligne répétée dans les cartes ;
  - le calcul du SEO et le suivi du prix de la page ;
  - le simulateur sans formule au départ, puis Vitrine+ sans activité, puis Fonctionnel avec activité ;
  - 29 € de l'heure et 29 € par mois.
- `offres.test.ts`, `seo.test.ts`, `predevis.test.ts`, `Home.test.tsx`, `Metier.test.tsx`, `Composer.test.tsx`, `Legal.test.tsx` : passés à « à partir de » et à 29 €.
- Lancer : `npm run test -w front`.
- Manuel : captures des cartes, du bloc des compléments et du simulateur en Vitrine+.

## Reste ouvert
- Que comprend exactement le suivi mensuel (mises à jour, sauvegardes, nombre de modifications, engagement) ? Pour l'instant, il est seulement décrit comme « Hébergement et maintenance de votre site ».
