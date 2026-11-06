# Changement de thème en rideau

Branche `feature/theme-rideau` · 2026-11-06

## Ce qui a été fait
- `changerTheme(theme, maj)` (`app/theme.ts`) applique le thème dans une transition de vue du navigateur (`document.startViewTransition`). La nouvelle page se découvre de gauche à droite en 0,7 s (animation `rideau-theme`, `clip-path`, dans `styles/animations.css`).
- Le bouton de thème (`ThemeToggle`) met son icône à jour dans la même image (`flushSync`).
- Sans transition de vue dans le navigateur, ou avec les animations réduites, le thème change tout de suite, comme avant.

## Tests
- `ThemeToggle.test.tsx` :
  - avec une transition de vue simulée, elle est utilisée, le thème change et l'icône aussi ;
  - avec les animations réduites, elle n'est pas utilisée et le thème change directement.
- Lancer : `npm run test -w front -- ThemeToggle`.
- Manuel (Chromium) : capture à mi-transition, moitié gauche en clair et moitié droite encore en nuit.

## Reste ouvert
Rien.
