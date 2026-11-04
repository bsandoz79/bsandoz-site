# Architecture

## Vue d'ensemble
- **front/** : site React + Vite + TypeScript, compilé en fichiers statiques et hébergé sur o2switch.
- **api/** (V2) : API Symfony pour les demandes de devis, rendez-vous et espace client.

## Dossiers du front
```
front/src/
  app/         point d'entrée, routes
  blocks/      blocs réutilisables (indépendants du site)
  components/  composants propres à bsandoz.fr
  pages/       une page = un dossier
  data/        contenus, offres et prix
  styles/      CSS global segmenté
  test/        configuration des tests
```

## Pages construites
- **Accueil** (`pages/Home`) : une section = un composant dans `pages/Home/sections/` (Hero, Metiers, Problemes, Offres, Realisations, Methode, Pourquoi, AppelAction), textes dans `data/accueil.ts`. L'illustration du téléphone n'apparaît qu'à partir de 960 px, comme dans la maquette mobile. Les boutons de formule mènent à `/composer?formule=<id>`.

- **Tarifs** (`pages/Tarifs`) : formules, encadré sur le prix du fonctionnel, `Simulateur` (simulation du Fonctionnel avec les blocs `ChoiceChips`, `OptionCard` et `PriceSummary`, calculs de `data/calculs.ts`), après la mise en ligne. Textes dans `data/tarifs.ts`. Le configurateur complet reste `/composer`.

- **Composer** (`pages/Composer`) : `useComposer` tient l'état (onglet, configuration, demande d'informatique) et l'enregistre dans le navigateur sous la clé `bsandoz.composer` (`stockage.ts` : lecture validée, sans effet si le stockage est bloqué). `?formule=<id>` préremplit la formule. `ConfigurateurWeb` (étapes), `Estimation` (bloc `PriceSummary`), `ComparaisonMarche` (deux barres + source), `ConfigurateurInformatique`. Les onglets suivent le modèle ARIA (flèches, Début, Fin).

## Règle des blocs
Un bloc ne connaît ni bsandoz.fr ni un métier : il reçoit tout par ses propriétés (props). Il peut ainsi être réutilisé tel quel sur un site client (detailing, espaces verts…).

## Pages et routes
- Les pages publiques (adresse, titre d'onglet, meta description, titre principal) sont décrites dans `src/data/pages.ts`.
- `src/app/routes.tsx` crée une route par page, sous la mise en page commune `components/Layout` : lien d'évitement « Aller au contenu », en-tête, balise `<main id="contenu">`, pied de page, barre mobile, et retour en haut à chaque changement de page.
- Les pages construites sont déclarées dans `builtPages` (`src/app/routes.tsx`). Une page qui n'a pas encore de contenu affiche `pages/Placeholder` ; elle est remplacée par sa vraie page dans la branche prévue au plan.
- Toute adresse inconnue affiche `pages/NotFound` (404, `noindex`).
- `src/data/navigation.ts` regroupe les libellés et liens de l'en-tête, des onglets de services, du pied de page et de la barre mobile, ainsi que le contact (le téléphone n'est affiché qu'une fois renseigné).
- `src/data/offres.ts` : formules (nom, accroche, prix, délai, points forts), tarif horaire et mentions de prix ; `formatPrix` et `prixFormule` pour l'affichage. Contient aussi les métiers, les options (`prixOption` pour l'affichage), les listes d'options par formule et par métier, les précisions (sous-questions), les packs et les prix du marché.
- `src/data/calculs.ts` : fonctions pures du configurateur, sans état : `optionsDisponibles`, `garderOptionsValides`, `packsActifs`, `calculerEstimation` (fourchette −5 % / +10 %, jamais sous le prix plancher), `suggestions` (2 au plus), `comparaisonMarche`. Une `Configuration` réunit formule, métier, options et réponses aux précisions.
- `src/data/realisations.ts` : réalisations présentées (captures à ajouter, emplacements `[…]` en attendant).
- `src/data/informatique.ts` : prestations d'informatique sur place (sans prix : « Tarif sur devis »), publics.
- `src/data/configurateur.ts` : textes du configurateur.
- `src/data/apercu.ts` : `modeleApercu(config)` construit le modèle du bloc `SitePreview` (entreprise d'exemple du métier, navigation, sections, appli, résultat Google) et sa description textuelle.
- `src/data/tarifs.ts` : textes de la page Tarifs.
- `src/data/accueil.ts` : textes de la page d'accueil, repris de la maquette `Main`.
- `components/Header` : onglets des deux catégories de services (l'onglet « Informatique sur place » est actif sur les adresses qui commencent par `/informatique`), navigation principale et sous-menu « Métiers ». Sous 960 px, la navigation est repliée derrière un bouton de menu.
- `components/Footer` : présentation, contact et liens légaux. Sur mobile, il garde de la place en bas pour la barre « Estimer ».
- `components/MobileBar` : barre « Estimer » fixe en bas de l'écran sous 960 px ; masquée sur les pages listées dans `mobileBar.hiddenOn`.
- `components/RealisationCard` : carte d'une réalisation (accueil, page Réalisations).
- `components/PageMeta` met à jour le titre de l'onglet (« Titre – Baptiste Sandoz ») et la meta description déjà présents dans `index.html`, sans les dupliquer.
