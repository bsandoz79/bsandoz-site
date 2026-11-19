# Téléphone : sites qui défilent tout seuls, réservation jouée, sans encoche

Branche `feature/telephone-defilement` · 2026-11-19

## Ce qui a été fait
Demande de Baptiste : enlever l'encoche du téléphone de l'accueil, et que les sites « se scrollent tout seuls », avec une réservation animée.
- Plus d'encoche (îlot) en haut de l'écran.
- Chaque site (captures pleine hauteur, prises en local) **défile de haut en bas** pendant son passage : pause en haut, descente, pause en bas, puis fondu vers le suivant. Christophe Poix Moto, Perfect Clean, Cadeaux, Shop ton chargeur, kebab d'exemple, Alterno.
- **Réservation fictive jouée** (écran codé, annoncé « Exemple ») : le jour se choisit (effet de toucher), puis l'heure, appui sur « Réserver », la notification « Nouveau rendez-vous » descend dans l'écran et « Acompte reçu » apparaît à côté du téléphone.
- Durée propre à chaque écran (`duree`), écran immobile si l'utilisateur réduit les animations.

## À quoi ça sert
Montrer des sites vivants et le parcours d'une réservation, sans vidéo.

## Comment l'utiliser
Liste, noms et durées dans `front/src/data/accueil.ts` (`ecransTelephone`, `reservationDemo`), images dans `front/src/assets/ecrans/` (400 px de large, environ 330 Ko en tout, chargées seulement à partir de 960 px).

## Tests
- `HeroDemo.test.tsx` : passage au site suivant après son défilement, réservation jouée jusqu'à l'acompte, immobile si animations réduites, exemples annoncés.
- **manuel** : filmé dans Chrome à plusieurs instants.

Lancer : `npm run test -w front -- HeroDemo`

## Fichiers principaux
- `front/src/pages/Home/sections/HeroDemo.tsx`, `HeroDemo.module.css`, `front/src/data/accueil.ts`

## Reste ouvert
- O'RDV : à ajouter quand sa démo en ligne remarchera.
