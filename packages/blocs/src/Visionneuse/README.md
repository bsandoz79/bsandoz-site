# Visionneuse (`Visionneuse`)

Image agrandie par-dessus la page, sur fond sombre (captures d'un projet, photos d'un commerce…), au lieu d'ouvrir l'image dans un nouvel onglet.

## Utilisation
```tsx
import { Visionneuse } from '@bsandoz79/blocs';

const [ouverte, setOuverte] = useState<number | null>(null);

<button type="button" onClick={() => setOuverte(0)}>…</button>
<Visionneuse photos={captures} index={ouverte} onChange={setOuverte} onClose={() => setOuverte(null)} />
```

## Propriétés
| Prop | Type | Défaut | Rôle |
| --- | --- | --- | --- |
| `photos` | `{ url, description }[]` | — | images ; `description` = texte alternatif et légende |
| `index` | `number \| null` | — | image ouverte (`null` : fermée) |
| `onChange` | `(index) => void` | — | passer à une autre image |
| `onClose` | `() => void` | — | fermer |
| `libelles` | `Partial<VisionneuseLibelles>` | français | fermer, précédente, suivante, position (« {n} / {total} »), titre |

## Accessibilité
- Fenêtre modale (`role="dialog"`, `aria-modal`), focus placé sur « Fermer », gardé dedans (Tab), puis rendu à l'élément d'origine.
- Fermeture : croix, Échap ou clic sur le fond. Flèches ← → au clavier, en boucle ; pas de flèches pour une seule image.
- Page bloquée derrière pendant l'ouverture ; apparition en fondu coupée si « réduire les animations ».
