# Préciser « Autre activité »

Branche `feature/autre-activite` · 2026-11-06

## Ce qui a été fait
- Quand on choisit « Autre activité », un champ **« Précisez votre activité »** apparaît (exemple : « toiletteur canin, photographe… », 80 caractères au plus) :
  - dans le configurateur (`ConfigurateurWeb`) ;
  - dans le simulateur de la page Tarifs ;
  - dans le devis, où il est **obligatoire** pour continuer.
- L'activité précisée :
  - est gardée avec l'estimation (`Configuration.metierAutre`, validée à la relecture du stockage) ;
  - passe au devis ;
  - remplace « Autre activité » dans l'estimation, l'aperçu, le récapitulatif et le mail (`nomActivite()`).
- La changer compte comme une nouvelle estimation pour le devis (elle fait partie de l'empreinte).

## Tests
- `demande.test.ts` : champ exigé seulement pour « Autre activité », récapitulatif, reprise depuis l'estimation.
- `Devis.test.tsx` : impossible de continuer sans préciser ; l'activité apparaît dans l'aperçu.
- `Composer.test.tsx` : champ affiché, repris dans l'estimation et gardé.
- `Tarifs.test.tsx` : même chose dans le simulateur.
- Lancer : `npm run test -w front -- Devis demande Composer Tarifs`.

## Reste ouvert
Rien.
