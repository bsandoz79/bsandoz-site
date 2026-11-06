# Réalisation Alterno

Branche `feature/alterno` · 2026-11-06

## Ce qui a été fait
- Nouveau projet **Alterno** dans `data/realisations.ts`, type « appli », page `/realisations/alterno`. Les textes sont repris du portfolio (`portfolio.js`, projet 14), sans rien inventer :
  - contexte, besoin, solution ;
  - 6 fonctionnalités ;
  - technos (React Native, Expo, TypeScript, SQLite, Vitest, GitHub Actions) ;
  - lien « Voir le code sur GitHub ».
- 6 captures (présentation, aujourd'hui, simulation, planning, compteur, semaines d'école) converties en WebP 1280 × 720 dans `assets/realisations/alterno/`, de 13 à 33 Ko chacune.
- Identifiant ajouté à `realisationsIds.ts` : la page est dans le plan du site.

## Tests
- `Realisations.test.tsx` :
  - 4 projets, 2 dans « Applis & plateformes » ;
  - page Alterno : titre, capture, fonctionnalité, lien GitHub ;
  - projet précédent depuis Christophe Poix Moto.
- `seo.test.ts` : la page Alterno est dans le plan du site.
- Lancer : `npm run test -w front -- Realisations seo`.
- Manuel : captures de la liste et de la page du projet.

## Reste ouvert
Rien.
