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

- **Composer** (`pages/Composer`) : `useComposer` tient l'état (onglet, configuration, demande d'informatique) et l'enregistre dans le navigateur sous la clé `bsandoz.composer` (`stockage.ts` : lecture validée, sans effet si le stockage est bloqué). `etatDepuisAdresse` applique l'adresse : `?formule=<id>` et `?metier=<id>` préremplissent les choix, `?onglet=informatique` ouvre l'onglet informatique. `ConfigurateurWeb` (étapes), `Estimation` (bloc `PriceSummary`), `ComparaisonMarche` (deux barres + source), `ConfigurateurInformatique`. Les onglets suivent le modèle ARIA (flèches, Début, Fin). `Apercu` affiche à droite le bloc `SitePreview` (ou « Bon à savoir » pour l'informatique), collant, masqué sous 1 000 px.

- **Informatique** (`pages/Informatique`) : prestations, déroulement et tarif sur devis ; textes et déroulement (partagé avec le configurateur) dans `data/informatique.ts`.

- **Pages métier** (`pages/Metier`, une seule page paramétrée par `id`) : contenus dans `data/metiers.ts` ; fonctions et prix tirés de `data/offres.ts`, exemple dessiné par `modeleApercu`, bouton vers `/composer?formule=fonctionnel&metier=<id>`.

- **Réalisations** (`pages/Realisations`) : études de cas tirées de `data/realisations.ts` (champs `besoin` et `solution` à compléter), ancre par projet.

- **À propos** (`pages/APropos`) : textes dans `data/apropos.ts` ; les valeurs reprennent celles de l'accueil.

- **FAQ** (`pages/Faq`) : bloc `Accordion`, questions dans `data/faq.ts` (texte brut, réutilisé plus tard pour les données structurées FAQPage).

- **Devis** (`pages/Devis`) : `Devis.tsx` (étapes, focus sur le titre à chaque étape, envoi), `Etapes.tsx`, `demande.ts` (validation, brouillon `bsandoz.devis`, récapitulatif, `FormData`). Reprend `bsandoz.composer`. Envoi en `POST` vers `/api/devis.php` (voir `docs/deploiement.md`).

- **Pages légales** (`pages/Legal`, paramétrée par `id`) : contenus dans `data/legal.ts`, sections titrées.

## Règle des blocs
Un bloc ne connaît ni bsandoz.fr ni un métier : il reçoit tout par ses propriétés (props). Il peut ainsi être réutilisé tel quel sur un site client (detailing, espaces verts…).

## Pages et routes
- Les pages publiques (adresse, titre d'onglet, meta description, titre principal) sont décrites dans `src/data/pages.ts`.
- `src/app/routes.tsx` crée une route par page, sous la mise en page commune `components/Layout` : lien d'évitement « Aller au contenu », en-tête, balise `<main id="contenu">`, pied de page, barre mobile ; à chaque changement de page, défilement vers l'ancre demandée ou en haut.
- Les pages construites sont déclarées dans `builtPages` (`src/app/routes.tsx`). Une page qui n'a pas encore de contenu affiche `pages/Placeholder` ; elle est remplacée par sa vraie page dans la branche prévue au plan.
- Toute adresse inconnue affiche `pages/NotFound` (404, `noindex`).
- `src/data/navigation.ts` regroupe les libellés et liens de l'en-tête, des onglets de services, du pied de page et de la barre mobile, ainsi que le contact (le téléphone n'est affiché qu'une fois renseigné).
- `src/data/offres.ts` : formules (nom, accroche, prix, délai, points forts), tarif horaire et mentions de prix ; `formatPrix` et `prixFormule` pour l'affichage. Contient aussi les métiers, les options (`prixOption` pour l'affichage), les listes d'options par formule et par métier, les précisions (sous-questions), les packs et les prix du marché.
- `src/data/calculs.ts` : fonctions pures du configurateur, sans état : `optionsDisponibles`, `garderOptionsValides`, `packsActifs`, `calculerEstimation` (fourchette −5 % / +10 %, jamais sous le prix plancher), `suggestions` (2 au plus), `comparaisonMarche`. Une `Configuration` réunit formule, métier, options et réponses aux précisions.
- `src/data/realisations.ts` : réalisations présentées (captures à ajouter, emplacements `[…]` en attendant).
- `src/data/informatique.ts` : prestations d'informatique sur place (sans prix : « Tarif sur devis »), publics.
- `src/data/configurateur.ts` : textes du configurateur.
- `src/data/apercu.ts` : `modeleApercu(config)` construit le modèle du bloc `SitePreview` (entreprise d'exemple du métier, navigation, sections, appli, résultat Google) et sa description textuelle.
- `src/data/metiers.ts` : contenus des 4 pages métier.
- `src/data/apropos.ts`, `src/data/faq.ts` : textes des pages À propos et FAQ.
- `src/data/devis.ts` : étapes, besoins, budgets, délais, limites des photos et textes du parcours de devis.
- `src/data/seo.ts` : adresses complètes, pages indexables (`pagesNonIndexees`), `genererSitemap`, `robotsTxt`, données structurées (`jsonLdEntreprise`, `jsonLdFaq`, `jsonLdOffres`). Le plugin `fichiersSeo` de `vite.config.ts` écrit `sitemap.xml` et `robots.txt` dans `dist/` au build.
- `src/data/legal.ts` : mentions légales, CGV, confidentialité (à compléter et à faire relire).
- `src/data/tarifs.ts` : textes de la page Tarifs.
- `src/data/accueil.ts` : textes de la page d'accueil, repris de la maquette `Main`.
- `components/Header` : onglets des deux catégories de services (l'onglet « Informatique sur place » est actif sur les adresses qui commencent par `/informatique`), navigation principale et sous-menu « Métiers ». Sous 960 px, la navigation est repliée derrière un bouton de menu.
- `components/Footer` : présentation, contact et liens légaux. Sur mobile, il garde de la place en bas pour la barre « Estimer ».
- `components/MobileBar` : barre « Estimer » fixe en bas de l'écran sous 960 px ; masquée sur les pages listées dans `mobileBar.hiddenOn`.
- `components/RealisationCard` : carte d'une réalisation (accueil, page Réalisations).
- `components/StructuredData` : insère un JSON-LD (accueil : entreprise, FAQ : FAQPage, Tarifs : formules).
- `components/PageMeta` gère aussi l'adresse canonique et, avec `noindex`, la balise robots (pages provisoires, 404). Il met à jour le titre de l'onglet (« Titre – Baptiste Sandoz ») et la meta description déjà présents dans `index.html`, sans les dupliquer.
