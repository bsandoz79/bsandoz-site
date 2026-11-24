# Fenêtre « Toujours là ? » après 30 minutes

Branche `feature/relance-devis-30-minutes` · 2026-11-24

## Ce qui a été fait
Baptiste voulait une deuxième relance, au milieu de l'écran, pour les visiteurs encore sur le site au bout de 30 minutes : « Toujours là ? Alors faites un devis ».
- **Fenêtre `RelanceDevis`** (`components/Relance/RelanceDevis.tsx`) : « Toujours là ? · Alors faites un devis », un court texte (devis gratuit sous 24 h, sans engagement), un bouton « Demander mon devis gratuit » (vers `/devis`) et « Plus tard ».
- **Au milieu de l'écran**, sur un fond voilé et flouté. Contrairement à la carte « Avant de partir », elle prend le focus (sur le bouton du devis), le garde tant qu'elle est ouverte et le rend en se fermant. La croix, « Plus tard », Échap ou un clic à côté la ferment.
- **Quand** : 30 minutes après l'ouverture du site, le temps comptant d'une page à l'autre. Elle attend que le bandeau des cookies soit fermé. Une seule ouverture, puis plus rien pendant 30 jours (`localStorage`, clé `bsandoz-relance-devis`, distincte de celle de la carte des 30 secondes).
- **Où elle ne s'ouvre pas** : les mêmes pages que la carte « Avant de partir » (devis, rendez-vous, pages légales, espace client, administration).
- Textes et délai dans `relanceDevis` (`data/relance.ts`).

## Tests
- 6 tests : ouverture à 30 minutes et pas avant, lien vers le devis et focus, « Plus tard » puis pas de retour pendant 30 jours, clic sur le fond (et pas dans la fenêtre), Échap, pas sur la page de devis.
- Résultats : 407 tests ; lint et build sans erreur.
- Vérifié dans Chrome (délai raccourci dans le navigateur seulement) : fenêtre centrée sur l'accueil, puis absente à la visite suivante.

## Fichiers principaux
- `front/src/components/Relance/RelanceDevis.tsx`, `RelanceDevis.module.css`, `RelanceDevis.test.tsx`, `index.ts`
- `front/src/data/relance.ts`, `front/src/components/Layout/Layout.tsx`
