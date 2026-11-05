# Prix et calculs

## À quoi ça sert
Une **source unique** pour tous les prix (formules, options, packs, marché) et des **fonctions pures** qui calculent l'estimation. L'accueil, Tarifs, le configurateur, les pages métier, la FAQ, les CGV et le devis lisent tous la même chose : changer un prix à un endroit le change partout.

## Schéma
```mermaid
flowchart LR
  offres["src/data/offres.ts<br/>formules · options · listes par métier<br/>précisions · packs · marché"]
  calculs["src/data/calculs.ts<br/>fonctions pures"]
  offres --> calculs
  calculs --> composer["/composer<br/>Estimation"]
  calculs --> tarifs["/tarifs<br/>Simulateur"]
  calculs --> devis["/devis<br/>première estimation"]
  calculs --> apercu["data/apercu.ts<br/>options offertes"]
  offres --> home["Accueil · Métiers · FAQ · CGV"]
```

```mermaid
flowchart TB
  c["Configuration<br/>{ formule, metier, options, precisions }"] --> e["calculerEstimation()"]
  e --> l["lignes (formule, options, précisions)"]
  e --> p["packsActifs() → options offertes"]
  e --> t["valeur − offert = total"]
  e --> f["fourchette −5 % / +10 %<br/>(Fonctionnel, jamais sous 989 €)"]
  c --> s["suggestions() : 2 au plus<br/>packs presque complets, montée en gamme"]
  t --> m["comparaisonMarche() : barres + phrase + source"]
```

## Comment l'appeler
```ts
import { calculerEstimation, suggestions, comparaisonMarche, optionsDisponibles } from '../data/calculs';

const config = { formule: 'fonctionnel', metier: 'artisan', options: ['rdv', 'acompte'], precisions: {} };
const estimation = calculerEstimation(config);   // { lignes, valeur, offert, total, fourchette, delai, packs }
const idees = suggestions(config);                // [{ titre, texte, libelle, action }]
const marche = comparaisonMarche('fonctionnel', config.options, estimation.total);
optionsDisponibles('fonctionnel', 'artisan');     // options proposées pour ce métier
```
Affichage : `formatPrix(1200)` → « 1 200 € », `prixFormule(f)` → « dès 989 € », `prixOption(o)` → « + 60 € / page ».

## Réutilisable ?
Oui : `calculs.ts` ne dépend d'aucun écran. Pour un autre site, il suffit de remplacer les données de `offres.ts`.

## Règles métier codées
- Option offerte déjà choisie : elle devient gratuite (le total baisse).
- Une option n'est offerte qu'une fois, même si deux packs l'offrent.
- Fourchette seulement pour le Fonctionnel, arrondie à 10 €, jamais sous le prix plancher.
- Marché : boutique choisie → e-commerce, sinon sur mesure ; la source est toujours affichée.

## Tests
- **unitaires** : `src/data/calculs.test.ts` (options, packs, estimation, fourchette, suggestions, marché), `src/data/offres.test.ts` (formatage, cohérence : chaque option citée existe, chaque pack est proposable).

## Modifier
Un prix, une option, un pack : `src/data/offres.ts`, puis relancer les tests (ils vérifient la cohérence).
