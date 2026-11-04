# Conventions

## Branches
`main` est toujours déployable. Chaque fonctionnalité a sa branche (`feature/…`), fusionnée dans `main` quand ses tests passent.

## Commits
Conventional Commits en français : `feat:`, `fix:`, `test:`, `style:`, `docs:`, `refactor:`, `chore:`, `ci:`.
Un commit = un ajout. La documentation est mise à jour dans le même commit.

## Tests
- Unitaires : chaque bloc et chaque fonction de calcul.
- Fonctionnels : les parcours (navigation, configurateur, formulaire).

Outils : Vitest + Testing Library (`front/vitest.config.ts`, `front/src/test/setup.ts`). Les fichiers de test sont à côté du code : `Bloc.test.tsx`.
