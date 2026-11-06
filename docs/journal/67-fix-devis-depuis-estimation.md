# Le devis reprend la dernière estimation

Branche `fix/devis-depuis-estimation` · 2026-11-06

## Le problème
- Après une estimation, « Recevoir mon devis détaillé » redemandait tout : activité, besoins, budget.
- Un devis commencé puis abandonné restait sur l'ancien projet, même après une nouvelle simulation.
- Le simulateur de la page Tarifs n'était pas repris du tout.

## Ce qui a été fait
- **Le simulateur des Tarifs** enregistre sa simulation au même endroit que le configurateur (`bsandoz.composer`). C'est la « dernière estimation ».
- **`demarrerDevis`** (`pages/Devis/demande.ts`) choisit le point de départ du devis :
  - **nouvelle estimation** :
    - l'activité est reprise ;
    - les besoins sont déduits des options (rendez-vous, galerie, calculateur, appli, boutique, SEO…) ;
    - le budget est déduit du prix estimé ;
    - le délai est vidé ;
    - le texte écrit et les coordonnées sont gardés ;
    - le devis s'ouvre sur la première question à remplir ;
  - **même estimation** : on reprend le brouillon là où on s'était arrêté.
- **Bandeau** « Repris de votre estimation : Site Fonctionnel · Rendez-vous en ligne (1 320 € – 1 530 €) », avec le lien **« Repartir de zéro »** (questions vidées, coordonnées gardées, retour à l'étape 1).
- Dans l'aperçu, « Depuis « Composer mon site » » devient « Depuis votre estimation ».

## Tests
- **Unitaires** (`demande.test.ts`) :
  - besoins déduits ;
  - tranches de budget ;
  - nouvelle estimation (choix repris, textes gardés, bonne étape) ;
  - même estimation ;
  - pas d'estimation ;
  - empreinte indépendante de l'ordre des options ;
  - remise à zéro.
- **Fonctionnels** :
  - `Devis.test.tsx` :
    - ouverture sur « Avec vos mots » avec les choix cochés ;
    - même estimation reprise à la même étape ;
    - autre simulation qui remplace les besoins en gardant le texte ;
    - « Repartir de zéro » ;
  - `Tarifs.test.tsx` : le simulateur enregistre sa simulation.
- **Lancer** : `npm run test -w front -- Devis demande Tarifs`.
- **Manuel**, dans un vrai navigateur :
  - simulation Fonctionnel + rendez-vous → devis ouvert à l'étape 3 ;
  - nouvelle simulation Vitrine+ → devis repris sur la nouvelle estimation, à l'étape « Budget et délai ».

## Reste ouvert
- Prochaine branche prévue : « Décrivez votre projet » sous forme de conversation guidée.
