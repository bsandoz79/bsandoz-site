# Mots qui tournent (`RotatingWords`)

Affiche des mots l'un après l'autre, avec un défilement vertical.

## Utilisation
```tsx
import { RotatingWords } from '../blocks/RotatingWords';

<p>Pour avoir <RotatingWords words={['plus de clients', 'moins d’appels manqués']} /></p>
```

## Propriétés
| Prop | Type | Défaut | Rôle |
| --- | --- | --- | --- |
| `words` | `string[]` | — | mots affichés tour à tour |
| `interval` | `number` | `2500` | durée d'affichage d'un mot (ms) |
| `className` | `string` | — | classe supplémentaire |

## Accessibilité
- Les lecteurs d'écran lisent la liste complète une seule fois (texte masqué visuellement) ; la partie animée leur est cachée.
- Si « réduire les animations » est activé, le premier mot reste affiché, sans défilement.
