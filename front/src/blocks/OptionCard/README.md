# Carte d'option (`OptionCard`)

Carte à cocher (titre, description, prix), pour choisir plusieurs options. Toute la carte est cliquable.

## Utilisation
```tsx
import { OptionCard } from '../blocks/OptionCard';

<OptionCard
  title="Galerie photos"
  description="Montrez votre travail en images."
  price="+ 80 €"
  checked={choisie}
  onChange={setChoisie}
/>
```

## Propriétés
| Prop | Type | Défaut | Rôle |
| --- | --- | --- | --- |
| `title` | `string` | — | nom de l'option (nom de la case à cocher) |
| `description` | `ReactNode` | — | précision |
| `price` | `string` | — | prix déjà formaté |
| `badge` | `string` | — | mention (« Offert », « Bientôt disponible ») |
| `checked` | `boolean` | — | cochée ou non |
| `onChange` | `(checked) => void` | — | appelé au changement |
| `disabled` | `boolean` | `false` | affichée mais non sélectionnable |

Pour présenter une liste, placer les cartes dans un `fieldset` avec une `legend`.

## Accessibilité
- Vraie case à cocher dans un `<label>` : clic n'importe où sur la carte, barre d'espace au clavier.
- Le contour de focus entoure toute la carte.
