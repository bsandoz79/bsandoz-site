# Étapes (`Stepper`)

Barre de progression et liste des étapes d'un parcours (formulaire en plusieurs étapes, réservation…).

## Utilisation
```tsx
import { Stepper } from '../blocks/Stepper';

<Stepper label="Étapes de la demande" steps={['Activité', 'Besoins', 'Coordonnées']} current={1} />
```

## Propriétés
| Prop | Type | Défaut | Rôle |
| --- | --- | --- | --- |
| `label` | `string` | — | nom de la liste |
| `steps` | `string[]` | — | noms des étapes |
| `current` | `number` | — | index de l'étape en cours |
| `doneLabel` | `string` | `'terminée'` | mention lue pour une étape passée |

## Accessibilité
- Liste ordonnée nommée ; l'étape en cours porte `aria-current="step"`, les étapes passées sont annoncées « terminée ».
- Sur téléphone, seuls les numéros restent visibles ; les noms sont toujours lus par les lecteurs d'écran.
