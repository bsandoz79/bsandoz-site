# Conteneur (`Container`)

Centre le contenu, limite sa largeur et ajoute des marges latérales.

## Utilisation
```tsx
import { Container } from '@bsandoz79/blocs';

<Container>…</Container>
<Container as="nav" aria-label="Navigation principale">…</Container>
<Container size="narrow">Texte long à lire</Container>
```

## Propriétés
| Prop | Type | Défaut | Rôle |
| --- | --- | --- | --- |
| `as` | balise ou composant | `'div'` | élément rendu (`section`, `nav`, `header`…) |
| `size` | `'md' \| 'narrow'` | `'md'` | largeur maximale (`--container` ou `--container-narrow`) |

Toutes les autres propriétés natives (`id`, `aria-*`, `className`…) sont transmises.
