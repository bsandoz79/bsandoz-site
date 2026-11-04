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

## Règle des blocs
Un bloc ne connaît ni bsandoz.fr ni un métier : il reçoit tout par ses propriétés (props). Il peut ainsi être réutilisé tel quel sur un site client (detailing, espaces verts…).

## Pages et routes
- Les pages publiques (adresse, titre d'onglet, meta description, titre principal) sont décrites dans `src/data/pages.ts`.
- `src/app/routes.tsx` crée une route par page, sous la mise en page commune `components/Layout` (balise `<main>`, retour en haut à chaque changement de page).
- Une page qui n'a pas encore de contenu affiche `pages/Placeholder` ; elle est remplacée par sa vraie page dans la branche prévue au plan.
- Toute adresse inconnue affiche `pages/NotFound` (404, `noindex`).
- `src/data/navigation.ts` regroupe les libellés et liens de l'en-tête, des onglets de services, du pied de page et de la barre mobile, ainsi que le contact (le téléphone n'est affiché qu'une fois renseigné).
- `components/Header` : onglets des deux catégories de services (l'onglet « Informatique sur place » est actif sur les adresses qui commencent par `/informatique`), navigation principale et sous-menu « Métiers ». Sous 960 px, la navigation est repliée derrière un bouton de menu.
- `components/PageMeta` met à jour le titre de l'onglet (« Titre – Baptiste Sandoz ») et la meta description déjà présents dans `index.html`, sans les dupliquer.
