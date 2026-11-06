# Choix en pastilles (`ChoiceChips`)

Choix unique parmi quelques réponses, présenté en pastilles. Construit sur de vrais boutons radio.

## Utilisation
```tsx
import { ChoiceChips } from '@bsandoz79/blocs';

<ChoiceChips
  legend="Votre activité"
  name="activite"
  choices={[{ value: 'artisan', label: 'Artisan' }, { value: 'commerce', label: 'Commerce' }]}
  value={activite}
  onChange={setActivite}
/>
```

## Propriétés
| Prop | Type | Défaut | Rôle |
| --- | --- | --- | --- |
| `legend` | `ReactNode` | — | question posée |
| `name` | `string` | — | nom du groupe radio, unique dans la page |
| `choices` | `{ value, label, meta?, description? }[]` | — | réponses possibles |
| `value` | `string \| null` | — | réponse choisie |
| `onChange` | `(value) => void` | — | appelé au choix |
| `variant` | `'chips' \| 'cards'` | `'chips'` | pastilles compactes, ou cartes avec `description` et `meta` (prix) |
| `hideLegend` | `boolean` | `false` | légende masquée visuellement (toujours lue) |

## Accessibilité
- `fieldset` + `legend` : la question est annoncée avec chaque réponse.
- Navigation au clavier native des boutons radio (Tab pour entrer, flèches pour changer).
- Contour de focus visible sur la pastille.

## État choisi
Pastille choisie : fond rose plein, texte clair. Carte choisie (variante `cards`) : bordure neutre plus marquée et petite coche ronde rose en haut à droite. Pas de bordure épaisse ni de fond teinté.
