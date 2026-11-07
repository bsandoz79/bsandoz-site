# Champ avec suggestions (`Autocomplete`)

Champ texte qui propose de finir le mot pendant la saisie : on tape « me », il propose « Menuisier », « Mécanicien »… On peut aussi écrire librement.

## Utilisation
```tsx
import { Autocomplete } from '@bsandoz79/blocs';

<Autocomplete label="Votre métier" value={metier} onChange={setMetier} suggestions={['Menuisier', 'Plombier']} required />
```

## Propriétés
| Prop | Type | Défaut | Rôle |
| --- | --- | --- | --- |
| `label` | `string` | — | libellé du champ (vrai `<label>`) |
| `value`, `onChange` | `string`, `(v) => void` | — | valeur contrôlée |
| `suggestions` | `string[]` | — | liste complète |
| `hint`, `placeholder`, `error` | `string` | — | aide, exemple, erreur |
| `required`, `maxLength` | | — | comme un champ texte |
| `max` | `number` | `6` | suggestions affichées au plus |
| `announce` | `(n) => string` | « n suggestions » | texte lu quand la liste change |

Fonctions exportées : `filtrerSuggestions(liste, saisie, max)` (d'abord ce qui commence par la saisie, puis ce qui la contient) et `normaliser(texte)` (minuscules, sans accents).

## Accessibilité
- Motif « combobox » : `role="combobox"`, `aria-expanded`, `aria-activedescendant`, liste `role="listbox"`.
- Flèches haut et bas pour parcourir, Entrée pour choisir, Échap pour fermer.
- Le nombre de suggestions est annoncé aux lecteurs d'écran.
