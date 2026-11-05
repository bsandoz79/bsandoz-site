# Apparition au défilement (`Reveal`)

Fait apparaître son contenu en fondu, avec une légère montée, quand il entre à l'écran. L'effet ne joue qu'une fois.

## Utilisation
```tsx
import { Reveal } from '@bsandoz79/blocs';

<Reveal>…</Reveal>
<Reveal as="li" delay={120}>…</Reveal>
```

## Propriétés
| Prop | Type | Défaut | Rôle |
| --- | --- | --- | --- |
| `as` | balise ou composant | `'div'` | élément rendu |
| `delay` | `number` | `0` | délai avant l'apparition (ms), pour décaler des éléments voisins |
| `className` | `string` | — | classe supplémentaire |

## Accessibilité
- Si « réduire les animations » est activé, ou si le navigateur ne connaît pas `IntersectionObserver`, le contenu est visible tout de suite.
- Le contenu est toujours présent dans la page : seuls l'opacité et le décalage changent.
