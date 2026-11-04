# Carte (`Card`)

Bloc arrondi et bordé, au contenu libre empilé verticalement.

## Utilisation
```tsx
import { Card } from '../blocks/Card';

<Card lift>…</Card>
<Card as="article" padding="none">image + texte</Card>
<Card tone="dark" padding="lg">offre mise en avant</Card>
```

## Propriétés
| Prop | Type | Défaut | Rôle |
| --- | --- | --- | --- |
| `as` | balise ou composant | `'div'` | élément rendu (`article`, `li`…) |
| `tone` | `'surface' \| 'muted' \| 'dark'` | `'surface'` | fond blanc, gris clair ou bleu marine |
| `padding` | `'none' \| 'md' \| 'lg'` | `'md'` | marges intérieures |
| `lift` | `boolean` | `false` | se soulève au survol (souris uniquement) |

Toutes les autres propriétés natives sont transmises.

## Accessibilité
- Le fond `dark` passe le texte et les liens en blanc (contraste AA).
- L'effet de survol est coupé si « réduire les animations » est activé.
