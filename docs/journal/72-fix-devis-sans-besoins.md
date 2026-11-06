# Plus de question « Besoins » après une estimation

Branche `fix/devis-sans-besoins` · 2026-11-06

## Le problème
Après une estimation « Vitrine + rédaction des textes », le devis demandait encore « Qu'aimeriez-vous que votre site fasse ? », avec toute la liste : rendez-vous, devis, appli, boutique… C'était redondant et ça prêtait à confusion.

## Ce qui a été fait
- `etapesActives(depuisEstimation)` (`pages/Devis/demande.ts`) : sans l'étape « Besoins » quand le devis part d'une estimation. Le parcours, la barre d'étapes, « Étape n sur 4 », Retour et Continuer suivent ces étapes.
- « Repartir de zéro » remet l'étape « Besoins » et l'estimation n'est plus reprise, même au rechargement (marque `zero:` dans le brouillon).
- Un ancien brouillon arrêté sur « Besoins » passe à l'étape suivante.
- Le récapitulatif et l'e-mail n'affichent plus de ligne « Besoins » vide : c'est la configuration qui décrit le projet.

## Tests
- `demande.test.ts` :
  - étapes affichées et étape de reprise ;
  - brouillon arrêté sur « Besoins » ;
  - « Repartir de zéro » gardé au rechargement ;
  - pas de ligne « Besoins » vide.
- `Devis.test.tsx` :
  - 4 étapes, sans « Besoins » ;
  - « Étape 2 sur 4 » ;
  - Retour va directement à l'activité ;
  - après « Repartir de zéro », l'étape « Besoins » revient.
- Lancer : `npm run test -w front -- Devis demande`.

## Reste ouvert
Rien.
