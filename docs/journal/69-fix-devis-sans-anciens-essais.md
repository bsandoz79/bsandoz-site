# Le devis ne garde plus les essais précédents

Branche `fix/devis-sans-anciens-essais` · 2026-11-06

## Le problème
Exemple : une estimation « Vitrine + rédaction des textes », puis « Recevoir mon devis détaillé ». Le devis arrivait avec plusieurs choix cochés que la personne n'avait pas faits. La branche précédente :
- gardait l'activité et le texte d'un ancien devis ;
- ajoutait d'office « Être contacté » pour les vitrines ;
- déduisait un budget du prix.

## Ce qui a été fait
- **Nouvelle estimation** : `demarrerDevis` part d'un devis neuf (`demandeRemiseAZero`). Seuls sont cochés :
  - l'activité choisie dans cette estimation (aucune pour une vitrine) ;
  - les besoins des options réellement choisies (rendez-vous, galerie, calculateur, appli, boutique, SEO…).

  Rien n'est ajouté d'office et le budget n'est plus déduit. Les coordonnées sont gardées.
- **Même estimation** : le devis reprend là où on s'était arrêté, comme avant.
- `budgetDepuisEstimation` est supprimé.

## Tests
- `demande.test.ts` :
  - besoins seulement depuis les options (Vitrine + rédaction : aucun) ;
  - devis neuf avec les seules coordonnées gardées ;
  - cas de la vitrine après un essai avec activité.
- `Devis.test.tsx` : une autre simulation repart avec un texte vide et seulement le besoin de cette simulation.
- Lancer : `npm run test -w front -- Devis demande`.

## Reste ouvert
- Le configurateur, lui, garde ses choix d'une visite à l'autre : on les voit cochés. Si ce n'est pas souhaité, on peut ajouter un bouton « Nouvelle estimation » ou ne garder les choix que le temps de la visite.
