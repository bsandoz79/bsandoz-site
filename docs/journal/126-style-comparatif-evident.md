# Comparatif : l'avantage saute aux yeux

Branche `style/comparatif-evident` · 2026-11-19

## Ce qui a été fait
Retour de Baptiste : « pas assez évident que ce que je propose est mieux ».
- « Avec moi » en première colonne, encadrée en rose, pastille « Recommandé », texte en gras ; les deux autres colonnes en gris.
- Un signe par case : ✓ (avantage), ✕ (inconvénient), ~ (ça dépend), lu « Oui / Non / Ça dépend » par les lecteurs d'écran. La colonne « Avec moi » n'a que des ✓.
- Nouvelle ligne « Le délai » (premier aperçu en 5 à 7 jours ouvrés) ; textes plus nets (« Un abonnement à payer chaque mois », « Je peux les écrire pour vous »).
- Conclusion surlignée : « Avec moi : un site fait sur mesure, un prix fixe sans abonnement, et un site qui reste à vous. »
- Rien d'inventé sur les autres : ✓ quand ils le font (équipe d'agence, modifications sur une plateforme), ~ quand ça dépend du contrat.

## Tests
- `Home.test.tsx` : colonnes, critères, signes lus, que des ✓ chez « Avec moi », conclusion, aucun prix.

## Fichiers principaux
- `front/src/pages/Home/sections/Comparatif.tsx`, `Comparatif.module.css`, `front/src/data/accueil.ts`, `blocs.ts`

## Reste ouvert
- Rien.
