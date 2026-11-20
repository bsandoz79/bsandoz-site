# Moyens de paiement (`MoyensPaiement`)

Ligne des moyens de paiement acceptés : une petite carte par moyen (Visa, Mastercard, American Express, Apple Pay, Google Pay, Stripe, virement, PayPal, espèces, chèque), avec un titre et une phrase facultatifs.

## Utilisation
```tsx
import { MoyensPaiement } from '@bsandoz79/blocs';

<MoyensPaiement
  label="Moyens de paiement acceptés"
  moyens={['visa', 'mastercard', 'amex', 'applepay', 'googlepay', 'virement']}
  mention="Carte, Apple Pay et Google Pay par Stripe, ou virement."
/>
```

## Propriétés
| Prop | Type | Défaut | Rôle |
| --- | --- | --- | --- |
| `moyens` | `MoyenPaiement[]` | — | moyens à afficher, dans l'ordre ; **seulement ceux réellement acceptés** |
| `label` | `string` | — | nom de la liste (lecteurs d'écran) |
| `titre` | `ReactNode` | — | titre visible au-dessus |
| `mention` | `ReactNode` | — | phrase sous les pastilles |
| `taille` | `'normale' \| 'petite'` | `'normale'` | `petite` pour un pied de page |

## Accessibilité
- Vraie liste nommée (`aria-label`), chaque carte porte le nom complet du moyen (texte masqué) : « American Express », « Virement bancaire »…
- Les marques sont dessinées en texte et formes simples (pas les logos officiels), décoratives (`aria-hidden`).
