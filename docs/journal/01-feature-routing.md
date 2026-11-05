# Routes des pages

Branche `feature/routing` · 2026-11-04

## Ce qui a été fait
Une adresse par page publique (16), une page 404, le titre de l’onglet et la meta description de chaque page.

## À quoi ça sert
Poser le squelette du site : chaque page a son adresse, son titre et sa description pour Google, avant d’en écrire le contenu.

## Comment l’utiliser
Ajouter une page : la déclarer dans `src/data/pages.ts`, puis l’associer à son composant dans `builtPages` (`src/app/routes.tsx`).

## Tests
- **fonctionnels** : `src/app/routes.test.tsx` : chaque adresse affiche son titre principal, son titre d’onglet et sa description ; 404 pour une adresse inconnue ; retour en haut à chaque page.
- **unitaires** : `components/PageMeta/PageMeta.test.tsx` : titre formaté, description mise à jour sans doublon.

Lancer : `cd front && npm run test`

## Fichiers principaux
- `src/data/pages.ts`
- `src/app/routes.tsx`
- `src/components/PageMeta/`
- `src/pages/NotFound/`

## Reste ouvert
- Rien.
