# Aperçu en direct

Branche `feature/apercu` · 2026-11-04

## Ce qui a été fait
Bloc `SitePreview` (faux site dessiné depuis un modèle) et `modeleApercu` ; aperçu à droite du configurateur, masqué sous 1 000 px.

## À quoi ça sert
Faire voir au visiteur le site qu’il est en train de composer.

## Comment l’utiliser
Entreprises d’exemple et sections dans `src/data/apercu.ts`.

## Tests
- **unitaires** : `SitePreview.test.tsx`, `apercu.test.ts` (sections selon les options, options offertes incluses).
- **fonctionnels** : Aperçu dans `Composer.test.tsx`.

Lancer : `cd front && npm run test`

## Fichiers principaux
- `src/blocks/SitePreview/`
- `src/data/apercu.ts`

## Reste ouvert
- Rien.
