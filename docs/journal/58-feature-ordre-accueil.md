# Ordre de la fin de l'accueil

Branche `feature/ordre-accueil` · 2026-11-06

## Ce qui a été fait
- **Avant** : Contact → Questions fréquentes → Carte. **Après** : Questions fréquentes → Carte → Contact.
- **Pourquoi** :
  - les questions lèvent les derniers doutes ;
  - la carte répond à « venez-vous chez moi ? », et son message (« je peux venir chez vous ») mène naturellement au formulaire ;
  - la page se termine par l'action, et non par une carte.
- La FAQ reste juste avant la carte, comme demandé.
- **Pied de page** : sur l'accueil, il n'affiche plus le bandeau « Un projet en tête ? », qui faisait doublon juste sous le formulaire. Les autres pages le gardent.
- Le lien « Services tiers » du pied de page a le même style que les autres liens.

## Tests
- `Home.test.tsx` : ordre des sections, et chaîne FAQ → Carte → Contact.
- `Footer.test.tsx` : l'appel est présent sur les autres pages et absent de l'accueil.
- Lancer : `npm run test -w front -- Home Footer`.

## Reste ouvert
Rien.
