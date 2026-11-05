# Questions dépliables (`Accordion`)

Liste de questions dont la réponse se déplie au clic. Idéal pour une FAQ.

## Utilisation
```tsx
import { Accordion } from '@bsandoz79/blocs';

<Accordion
  headingLevel={2}
  items={[
    { id: 'delais', question: 'Quels sont les délais ?', answer: <p>De 3 jours à 6 semaines.</p> },
  ]}
/>
```

## Propriétés
| Prop | Type | Défaut | Rôle |
| --- | --- | --- | --- |
| `items` | `{ id, question, answer }[]` | — | questions ; `id` sert d'ancre (`/faq#delais`) |
| `headingLevel` | `2 \| 3 \| 4` | `3` | niveau de titre des questions |
| `defaultOpen` | `string` | — | question ouverte au départ |

## Accessibilité
- Construit sur `<details>` / `<summary>` : ouverture au clavier (Entrée, Espace) et état annoncé par le navigateur, sans script.
- Chaque question est un vrai titre : on peut naviguer de question en question au lecteur d'écran.
- Le contenu reste dans la page (et trouvable par la recherche du navigateur).
