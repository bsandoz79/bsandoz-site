# Simulateur de la page Tarifs

## À quoi ça sert
Sur `/tarifs`, simuler rapidement un site : **formule** (Vitrine, Vitrine+ ou Fonctionnel, aucune choisie à l'avance), puis l'activité (seulement pour le Fonctionnel) et les fonctions → prix en direct, packs offerts et une suggestion. Le configurateur complet reste `/composer`.

## Schéma
```mermaid
flowchart LR
  f["ChoiceChips<br/>formule"] --> st["état local<br/>formule, metier, choix"]
  a["ChoiceChips<br/>activité (Fonctionnel)"] --> st
  o["OptionCard × n<br/>optionsDisponibles(formule, metier)"] --> st
  st --> e["calculerEstimation()"]
  st --> s["suggestions() → 1re suggestion d'option"]
  e --> r["PriceSummary<br/>fourchette, délai, lignes, offert"]
  s --> r
  r --> l1["/devis"]
  r --> l2["/composer"]
```

## Chemin
`pages/Tarifs/Tarifs.tsx` (formules, encadré, après mise en ligne) → `pages/Tarifs/Simulateur.tsx` (état local, sans mémoire) → `data/calculs.ts`. Textes : `data/tarifs.ts`.

## Comment l'appeler
Page `/tarifs`. Le composant `Simulateur` n'a pas de paramètre.

## Réutilisable ?
Non (propre à la page), mais il n'assemble que des blocs réutilisables et les calculs communs.

## Tests
- **fonctionnels** : `pages/Tarifs/Tarifs.test.tsx` (aucune formule à l'avance, Vitrine+ sans activité, activité demandée pour le Fonctionnel, prix en direct, pack proposé puis offert, options gardées au changement d'activité, liens).
