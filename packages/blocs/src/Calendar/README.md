# Calendrier (`Calendar`)

Calendrier mensuel pour choisir un jour. Les jours indisponibles (complets, non travaillés, passés) sont grisés et barrés. Réutilisable tel quel dans un kit de réservation client.

## Utilisation
```tsx
import { Calendar, aujourdhui, jourDeLaSemaine } from '@bsandoz79/blocs';

<Calendar
  label="Date du rendez-vous"
  month={mois}
  onMonthChange={setMois}
  value={jour}
  onChange={setJour}
  isDisabled={(d) => jourDeLaSemaine(d) >= 5}
  min={aujourdhui()}
  today={aujourdhui()}
/>
```

## Propriétés
| Prop | Type | Défaut | Rôle |
| --- | --- | --- | --- |
| `label` | `string` | — | nom du calendrier |
| `month` / `onMonthChange` | date ISO | — | mois affiché |
| `value` / `onChange` | date ISO | — | jour choisi |
| `isDisabled` | `(jour) => boolean` | aucun | jours non sélectionnables |
| `min` / `max` | date ISO | — | bornes (jours et navigation par mois) |
| `today` | date ISO | — | jour mis en évidence |
| `weekdays`, `previousLabel`, `nextLabel`, `unavailableLabel`, `locale` | — | français | textes |

Les dates sont des chaînes `AAAA-MM-JJ` (aucun décalage lié au fuseau horaire). `dates.ts` fournit les fonctions utiles : `aujourdhui`, `ajouterJours`, `ajouterMois`, `jourDeLaSemaine`, `libelleLong`…

## Accessibilité (motif ARIA « grid »)
- Une seule case reçoit le focus (Tab) ; flèches : jour précédent / suivant / semaine ; Début / Fin : début / fin de semaine ; Page préc. / Page suiv. : mois.
- Chaque jour est un bouton nommé en toutes lettres (« mardi 17 novembre 2026, indisponible »), le jour choisi est `aria-selected`, aujourd'hui `aria-current="date"`.
- Le mois affiché est annoncé quand il change.

## Jours marqués
`isMarked` signale des jours sans les désactiver, et `markedLabel` complète leur nom pour les lecteurs d'écran. Exemple : les jours fermés d'un réglage, où un clic ferme ou rouvre le jour.
