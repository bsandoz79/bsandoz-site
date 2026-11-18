# Page « Site pour restaurant, kebab ou snack »

Branche `feature/page-restaurant` · 2026-11-19

## Ce qui a été fait
Après la revue « je suis un patron de kebab » : la page restaurant parle maintenant à un kebab, un snack ou une pizzeria.
- Titre de page et de Google : « Site internet pour restaurant, kebab ou snack à Amiens » ; promesse : « Votre carte toujours à jour, modifiée depuis votre téléphone. »
- Bloc « Pour un restaurant, un kebab ou un snack » : carte modifiée depuis le téléphone, QR code pour les tables et la vitrine, appeler et itinéraire en un clic, commande à emporter en option.
- Exemple sur téléphone, dessiné en HTML : la carte d'un kebab **fictif** (« Le Comptoir Kebab », marqué « Exemple »), boutons Appeler, Itinéraire, À emporter. Couleurs chaudes, celles d'un restaurant, quel que soit le thème du site. Il remplace l'aperçu générique sur cette page seulement.
- Texte lisible par Google sans JavaScript : les quatre points.

## À quoi ça sert
Qu'un restaurateur se reconnaisse tout de suite, avec son vocabulaire (carte, QR code, à emporter).

## Comment l'utiliser
Textes, plats et prix d'exemple dans `front/src/data/restaurant.ts` ; activé par `exempleRestaurant: true` dans `data/metiers.ts`.

## Tests
- `Metier.test.tsx` : l'exemple de carte (plats, Appeler, Itinéraire, À emporter, « Exemple ») et les points du restaurateur.
- **manuel** : Chrome, ordinateur et téléphone.

Lancer : `npm run test -w front -- Metier`

## Fichiers principaux
- `front/src/pages/Metier/ExempleRestaurant.tsx`, `.module.css`, `Metier.tsx`
- `front/src/data/restaurant.ts`, `metiers.ts`, `pages.ts`, `front/src/seo/prerendu.ts`

## Reste ouvert
- Un vrai site de restaurant à montrer, quand Baptiste en aura fait un.
