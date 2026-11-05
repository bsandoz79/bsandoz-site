# Bouton (`Button`)

Bouton réutilisable. Rend un vrai `<button>` (type `button` par défaut), ou un lien `<a>` si `href` est fourni.

## Utilisation
```tsx
import { Button } from '@bsandoz79/blocs';

<Button onClick={valider}>Valider</Button>
<Button type="submit" size="lg" block>Envoyer</Button>
<Button href="/contact" variant="secondary">Me contacter</Button>
```

## Propriétés
| Prop | Type | Défaut | Rôle |
| --- | --- | --- | --- |
| `variant` | `'primary' \| 'secondary' \| 'ghost'` | `'primary'` | apparence |
| `size` | `'md' \| 'lg'` | `'md'` | taille |
| `block` | `boolean` | `false` | pleine largeur |
| `href` | `string` | — | rend un lien `<a>` |

Toutes les autres propriétés natives (`onClick`, `disabled`, `aria-*`, `target`…) sont transmises.

## Habiller un autre élément
`buttonClassName({ variant, size, block, className })` renvoie les classes du bouton, par exemple pour un lien de routeur :
```tsx
<Link to="/contact" className={buttonClassName({ variant: 'secondary' })}>Me contacter</Link>
```

## Accessibilité
- Hauteur minimale de 44 px (cible tactile).
- Contour de focus global (`:focus-visible`).
- Texte blanc sur rose `--color-rose` : contraste AA.
