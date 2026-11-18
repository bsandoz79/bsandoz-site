# Téléphone animé : mes sites qui défilent

Branche `feature/telephone-anime` · 2026-11-19

## Ce qui a été fait
Le téléphone du haut de l'accueil ne montre plus un écran de réservation figé : **les sites de Baptiste défilent** sur son écran, un toutes les 3,5 secondes, avec leur nom dans l'étiquette à côté (« Réalisation », « Démo » ou « Exemple ») et des petits points sous le téléphone.
- Écrans (vues téléphone, 400 × 848, 143 Ko en tout) : Christophe Poix Moto, Perfect Clean (démo de réservation), Cadeaux, Shop ton chargeur, la carte du kebab d'exemple (annoncée « Exemple »), Alterno.
- Captures prises sur les sites construits en local (o2switch bloque les visites répétées), Alterno découpé dans ses captures existantes.
- Pas de mouvement si l'utilisateur réduit les animations ; pause quand l'onglet est caché ; décoratif (caché aux lecteurs d'écran) ; affiché à partir de 960 px seulement, comme avant.

## À quoi ça sert
Montrer d'un coup d'œil, dès l'arrivée, plusieurs sites réels plutôt qu'un seul écran.

## Comment l'utiliser
Liste et noms dans `front/src/data/accueil.ts` (`ecransTelephone`, `DUREE_ECRAN_MS`), images dans `front/src/assets/ecrans/`.

## Tests
- `HeroDemo.test.tsx` : défilement et nom affiché, retour au premier, immobile si animations réduites, kebab annoncé « Exemple ».

Lancer : `npm run test -w front -- HeroDemo`

## Fichiers principaux
- `front/src/pages/Home/sections/HeroDemo.tsx`, `HeroDemo.module.css`, `front/src/assets/ecrans/`

## Reste ouvert
- O'RDV : sa démo en ligne (o-rdv.vercel.app) affiche « Impossible de charger les prestataires » ; à ajouter quand son serveur répondra.
