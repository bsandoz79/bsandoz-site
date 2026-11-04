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
