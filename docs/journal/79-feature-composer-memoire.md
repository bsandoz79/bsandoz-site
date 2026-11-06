# Configurateur : reprendre ou recommencer

Branche `feature/composer-memoire` · 2026-11-06

## Ce qui a été fait
- **Repérer une visite** : marqueur `bsandoz.composer.visite` dans le stockage de session, oublié à la fermeture de l'onglet (`estNouvelleVisite`, `marquerVisite`).
- **À une nouvelle visite** avec une estimation enregistrée (`aDesChoix`) : fenêtre `Reprise`, « Voulez-vous reprendre là où vous en étiez ? », avec le résumé (« Site Vitrine · 1 option »).
  - **Oui, reprendre** (ou Échap) : l'estimation est gardée.
  - **Non, recommencer** : on repart de zéro, en gardant ce que demande le lien suivi (onglet, formule, métier).
- **Même visite** : pas de question. C'est le cas en revenant du devis, et aussi après une simulation sur la page Tarifs (le simulateur marque la visite).
- **Accessibilité** : fenêtre `role="dialog"` et `aria-modal`, focus sur « Oui », Tab qui tourne entre les deux boutons, Échap.

## Tests
- `Composer.test.tsx` :
  - nouvelle visite : résumé, focus, « Oui » qui garde ;
  - « Non » qui repart de zéro avec la formule du lien ;
  - Échap et Tab ;
  - pas de question pendant la même visite ni sans estimation.
- `Tarifs.test.tsx` : le simulateur marque la visite.
- Lancer : `npm run test -w front -- Composer Tarifs`.
- Manuel : capture de la fenêtre ; après « Oui » et un rechargement, la question n'est pas reposée.

## Reste ouvert
Rien.
