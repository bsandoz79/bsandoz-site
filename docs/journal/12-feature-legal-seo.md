# Pages légales et SEO

Branche `feature/legal-seo` · 2026-11-04

## Ce qui a été fait
Sitemap et robots.txt générés au build, adresse canonique, « noindex » des pages provisoires et de la 404, données structurées ; mentions légales, CGV, confidentialité.

## À quoi ça sert
Être bien référencé et en règle.

## Comment l’utiliser
Pages légales dans `src/data/legal.ts` ; SEO dans `src/data/seo.ts`.

## Tests
- **unitaires** : `seo.test.ts` (sitemap valide, données structurées), `StructuredData.test.tsx`, `PageMeta.test.tsx`.
- **fonctionnels** : `app/seo.test.tsx`, `Legal.test.tsx`.

Lancer : `cd front && npm run test`

## Fichiers principaux
- `src/data/seo.ts`
- `src/data/legal.ts`
- `src/pages/Legal/`
- `front/vite.config.ts`

## Reste ouvert
- SIRET, adresse, acompte, conservation, médiateur à compléter ; relecture des CGV et de la confidentialité.
