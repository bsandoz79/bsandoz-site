# Retour de l'estimation, plus simple et en second plan

Branche `feature/estimation-retour` · 2026-11-07

## Ce qui a été fait
Baptiste veut garder l'estimation, mais derrière la demande de devis. Une estimation validée doit valoir demande de devis.

- **Accès** : la page `/composer` est restaurée depuis l'historique, avec des liens discrets sur Devis et Tarifs. Le bouton principal reste « Demander un devis ».
- **Métier** : nouveau bloc `Autocomplete`, alimenté par la liste de `data/metiersConnus.ts` (environ 90 métiers et leur catégorie). Un métier hors liste est gardé, en catégorie « autre ». Le formulaire de devis l'utilise aussi.
- **Options incluses** :
  - 1, 2 ou 3 petites options selon la formule ;
  - les gros modules toujours payants ;
  - un compteur dans l'étape et des badges « Inclus » ;
  - les packs supprimés ;
  - plus de petites options proposées.
- **Aperçu** : légende « Exemple · squelette sans style ».
- **Validation** :
  - le formulaire de contact s'ouvre sous l'estimation (`validation.ts`, prop `estimation` de `ContactRapide`) ;
  - l'envoi contient le titre, le récapitulatif et le texte de l'estimation ;
  - l'API n'a pas changé.
- **Correctif vu à l'écran** : la liste des suggestions passait sous l'étape suivante. L'étape active passe maintenant devant.

## Tests
- **Bloc** : `Autocomplete.test.tsx` (filtre, clavier, saisie libre).
- **Site** : `Composer.test.tsx` réécrit, plus `calculs`, `predevis`, `apercu`, `ContactRapide`, `Devis`, `Header` et `MobileBar`.
- **Résultats** : 396 tests pour le site, 80 pour les blocs.
- **Dans Chrome** : suggestions, options incluses, estimation à 540 € pour 840 € de valeur, formulaire avec l'estimation jointe.
- **Lancer** : `npm run test`.

## Reste ouvert
- **À valider par Baptiste** :
  - le nombre d'options incluses (1, 2, 3) et la liste des gros modules ;
  - la suppression des packs.
- **Aperçu** : l'entreprise d'exemple suit la catégorie. Un menuisier voit l'exemple « Atelier Brillance », un detailing auto. Le texte dit bien que c'est un exemple.
