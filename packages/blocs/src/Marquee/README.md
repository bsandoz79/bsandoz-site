# Bande défilante (`Marquee`)

Fait défiler une liste en continu, de droite à gauche, avec un séparateur ✦ entre les éléments.

## Utilisation
```tsx
import { Marquee } from '@bsandoz79/blocs';

<Marquee label="Métiers accompagnés" items={['Plombiers', 'Restaurants', 'Coachs']} />
```

## Propriétés
| Prop | Type | Défaut | Rôle |
| --- | --- | --- | --- |
| `items` | `string[]` | — | éléments de la bande |
| `label` | `string` | — | nom de la liste pour les lecteurs d'écran |
| `duration` | `number` | `32` | durée d'un tour (secondes) |
| `className` | `string` | — | classe supplémentaire (couleurs, typo) |

La couleur du séparateur se règle avec la variable CSS `--marquee-accent` sur le parent.

## Accessibilité
- Une seule liste est lue par les lecteurs d'écran (la copie servant à boucler est cachée).
- Si « réduire les animations » est activé, la bande est figée et les éléments passent à la ligne.

`renderItem(item, copie)` (facultatif) : rendu personnalisé d'un élément, par exemple un lien ; `copie` vaut vrai pour la seconde liste (cachée aux lecteurs d'écran : mettre `tabIndex={-1}`). La bande s'arrête au survol et quand un élément a le focus.
