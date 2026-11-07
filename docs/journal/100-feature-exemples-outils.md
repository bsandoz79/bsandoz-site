# Exemples d'outils dans la vitrine

Branche `feature/exemples-outils` · 2026-11-07

## Ce qui a été fait
- **Quatre maquettes**, des écrans d'entreprises fictives, sobres :
  - stocks et dates limites (Maison Duval, charcuterie) ;
  - carte par QR code (Le Petit Comptoir) ;
  - suivi des clients (Atelier Martin) ;
  - galerie privée avec commande (Studio Lumière).
- **Fabrication** : écrites en HTML (`docs/exemples/maquettes-outils.html`), capturées en 1 280 × 720, puis converties en WebP (`assets/exemples/`, 11 à 33 Ko).
- **Données** : `data/exemples.ts`. Elles suivent les vraies réalisations dans la vitrine de l'accueil.
- **Cartes** : `RealisationCard` accepte `exemple: true`, qui ajoute un badge « Exemple » sur l'image et « Exemple · » pour les lecteurs d'écran. Leur lien mène au devis : « Un outil comme celui-ci ? ».

## Tests
- `Home.test.tsx` : les quatre cartes sont dans la liste, marquées « Exemple », avec un lien vers le devis ; le nombre de cartes est vérifié.
- Résultats : 350 tests pour le site, 80 pour les blocs.
- Vérifié dans Chrome : un premier rendu avait une bande grise, due à une fenêtre de capture trop petite. Les images ont été refaites et contrôlées.

## Reste ouvert
- Les exemples ne sont pas sur la page Réalisations, qui reste réservée aux vrais projets.
