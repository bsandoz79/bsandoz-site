# Récapitulatif de prix (`PriceSummary`)

Encadré sombre : prix principal, détail des lignes (lignes offertes barrées) et contenu libre (suggestions, boutons).

## Utilisation
```tsx
import { PriceSummary } from '@bsandoz79/blocs';

<PriceSummary
  title="Votre estimation"
  eyebrow="Votre estimation · artisan"
  total="1 390 € – 1 690 €"
  caption="Délai estimé : 3 à 6 semaines"
  lines={[{ label: 'Site', amount: '989 €' }, { label: 'Avis Google', amount: '60 €', free: true }]}
  footnote="Estimation indicative."
>
  <a href="/devis">Recevoir mon devis</a>
</PriceSummary>
```

## Propriétés
| Prop | Type | Défaut | Rôle |
| --- | --- | --- | --- |
| `title` | `string` | — | nom de l'encadré (`aside`) |
| `eyebrow` | `string` | — | ligne au-dessus du prix |
| `total` | `string` | — | prix principal, formaté |
| `caption` | `ReactNode` | — | ligne sous le prix |
| `lines` | `{ label, amount, free? }[]` | `[]` | détail |
| `freeLabel` | `string` | `'Offert'` | mention des lignes offertes |
| `footnote` | `ReactNode` | — | mention en bas |

## Accessibilité
- Le prix principal est une zone `aria-live="polite"` : sa nouvelle valeur est annoncée quand les choix changent.
- Les montants offerts sont barrés (`<s>`) et accompagnés d'une mention écrite.
