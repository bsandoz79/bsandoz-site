# Vos mots, vos textes : « ce que vous me dites → ce que ça donne »

Branche `feature/reponses-site` · 2026-11-18

## Ce qui a été fait
Idée reprise de Roselyn Pro (démonstration questionnaire → textes), avec d'autres métiers et des textes propres : une section de l'accueil, après le comparatif, montre trois exemples **fictifs**, annoncés comme tels (coiffeuse, couvreur, restaurant). À gauche, la phrase du client ; à droite, le titre et le texte qu'elle donne sur son site.
- En ligne sur grand écran (phrase → texte), en colonne sur téléphone.
- Bloc modifiable depuis le back-office.

## À quoi ça sert
Montrer, sans le dire, que Baptiste sait écrire les textes d'un site à partir de ce que raconte le client.

## Comment l'utiliser
Textes dans `front/src/data/accueil.ts` (`reponses`), ou bouton « Modifier » sur le bloc.

## Tests
- `Home.test.tsx` : ordre des sections, chaque exemple montre la phrase et le titre, mention « Exemples fictifs ».
- **manuel** : vérifié dans Chrome.

Lancer : `npm run test -w front -- Home`

## Fichiers principaux
- `front/src/pages/Home/sections/Reponses.tsx`, `Reponses.module.css`
- `front/src/data/accueil.ts`, `front/src/data/blocs.ts`

## Reste ouvert
- Rien.
