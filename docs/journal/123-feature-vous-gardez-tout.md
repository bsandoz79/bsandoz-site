# « Si je ne suis plus disponible, vous gardez tout »

Branche `feature/vous-gardez-tout` · 2026-11-19

## Ce qui a été fait
Après la revue « patron de kebab » (peur du développeur seul qui disparaît) :
- FAQ « À qui appartient le site ? » (3e question, visible sans déplier) : « Et si un jour je ne suis plus disponible, vous gardez tout : le code du site, le nom de domaine, l'hébergement et les accès, à votre nom. Un autre développeur peut reprendre, rien n'est verrouillé de mon côté. »
- Comparatif, ligne « Si vous partez », colonne « Avec moi » : « Vous gardez tout : site, code, nom de domaine ».

## À quoi ça sert
Lever le doute qui freine le plus face à un indépendant.

## Comment l'utiliser
Textes dans `front/src/data/faq.ts` et `front/src/data/accueil.ts` (`comparatif`).

## Tests
- `Home.test.tsx` : la réponse de la FAQ et la case du comparatif.

Lancer : `npm run test -w front -- Home`

## Fichiers principaux
- `front/src/data/faq.ts`, `front/src/data/accueil.ts`

## Reste ouvert
- Rien.
