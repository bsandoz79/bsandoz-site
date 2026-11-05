# Titre de section (`SectionTitle`)

Sur-titre en capitales, titre et phrase d'introduction.

## Utilisation
```tsx
import { SectionTitle } from '@bsandoz79/blocs';

<section aria-labelledby="offres">
  <SectionTitle id="offres" eyebrow="Offres" title="Des prix clairs" intro="…" />
</section>
```

## Propriétés
| Prop | Type | Défaut | Rôle |
| --- | --- | --- | --- |
| `title` | `ReactNode` | — | titre |
| `eyebrow` | `string` | — | sur-titre |
| `intro` | `ReactNode` | — | introduction |
| `level` | `1 \| 2 \| 3` | `2` | niveau du titre |
| `id` | `string` | — | identifiant du titre (pour `aria-labelledby`) |

## Accessibilité
- Vrai titre `h1` à `h3` : la hiérarchie de la page reste lisible au lecteur d'écran.
- Sur-titre en rose foncé : contraste AA sur fond blanc et gris clair.
