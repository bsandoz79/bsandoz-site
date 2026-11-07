# Vitrine défilante (`Showcase`)

Fait passer des cartes de droite à gauche, en continu : réalisations, exemples, logos…

## Utilisation
```tsx
import { Showcase } from '@bsandoz79/blocs';

<Showcase
  label="Mes réalisations"
  items={projets.map((p) => ({ id: p.id, content: <CarteProjet projet={p} /> }))}
/>
```

## Propriétés
| Prop | Type | Défaut | Rôle |
| --- | --- | --- | --- |
| `items` | `{ id: string; content: ReactNode }[]` | — | éléments de la vitrine |
| `label` | `string` | — | nom de la liste pour les lecteurs d'écran |
| `duration` | `number` | `40` | durée d'un tour (secondes) |
| `pauseLabel` | `string` | `Mettre en pause` | texte du bouton pause |
| `playLabel` | `string` | `Relancer le défilement` | texte du bouton lecture |
| `className` | `string` | — | classe supplémentaire |

La largeur des éléments se règle avec la variable CSS `--showcase-item-width` (18rem par défaut).

## Accessibilité
- Un bouton met en pause (WCAG 2.2.2) ; le survol et le focus clavier arrêtent aussi le défilement.
- Une seule liste est lue et parcourue au clavier : la copie qui sert à boucler est `aria-hidden` et `inert`.
- Si « réduire les animations » est activé, rien ne bouge : la rangée se fait glisser à la main.
