import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import {
  ajouterJours,
  ajouterMois,
  comparer,
  debutDuMois,
  jourDeLaSemaine,
  libelleLong,
  libelleMois,
  semainesDuMois,
  type DateIso,
} from './dates';
import styles from './Calendar.module.css';

export type CalendarProps = {
  /** Nom du calendrier (lecteurs d'écran). */
  label: string;
  /** Mois affiché : n'importe quelle date du mois. */
  month: DateIso;
  onMonthChange: (month: DateIso) => void;
  /** Jour choisi. */
  value: DateIso | null;
  onChange: (day: DateIso) => void;
  /** Jour non sélectionnable (complet, non travaillé, passé…). */
  isDisabled?: (day: DateIso) => boolean;
  /** Premier et dernier jours atteignables (bornent aussi la navigation par mois). */
  min?: DateIso;
  max?: DateIso;
  /** Jour mis en évidence (aujourd'hui). */
  today?: DateIso;
  weekdays?: string[];
  previousLabel?: string;
  nextLabel?: string;
  unavailableLabel?: string;
  locale?: string;
  className?: string;
};

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

/**
 * Calendrier mensuel accessible (motif ARIA « grid ») : flèches pour changer de jour,
 * Page préc. / Page suiv. pour changer de mois, Début / Fin pour la semaine, Entrée ou Espace pour choisir.
 */
export function Calendar({
  label,
  month,
  onMonthChange,
  value,
  onChange,
  isDisabled = () => false,
  min,
  max,
  today,
  weekdays = JOURS,
  previousLabel = 'Mois précédent',
  nextLabel = 'Mois suivant',
  unavailableLabel = 'indisponible',
  locale = 'fr-FR',
  className,
}: CalendarProps) {
  const debut = debutDuMois(month);
  const semaines = semainesDuMois(debut);
  const dansLeMois = (jour: DateIso) => debutDuMois(jour) === debut;
  const horsBornes = (jour: DateIso) => (min && comparer(jour, min) < 0) || (max && comparer(jour, max) > 0);
  const indisponible = (jour: DateIso) => Boolean(horsBornes(jour)) || isDisabled(jour);

  // Jour qui porte le focus clavier (une seule case tabulable).
  const premierDispo = semaines.flat().find((j): j is DateIso => j !== null && !indisponible(j));
  const [actif, setActif] = useState<DateIso | null>(null);
  const focusable =
    actif && dansLeMois(actif) ? actif : value && dansLeMois(value) ? value : (premierDispo ?? debut);
  const grille = useRef<HTMLTableElement>(null);
  const doitFocaliser = useRef(false);

  useEffect(() => {
    if (!doitFocaliser.current) return;
    doitFocaliser.current = false;
    grille.current?.querySelector<HTMLButtonElement>(`[data-jour="${focusable}"]`)?.focus();
  });

  const moisPrecedent = ajouterMois(debut, -1);
  const moisSuivant = ajouterMois(debut, 1);
  const precedentPossible = !min || comparer(debutDuMois(min), moisPrecedent) <= 0;
  const suivantPossible = !max || comparer(debutDuMois(max), moisSuivant) >= 0;

  function deplacer(cible: DateIso) {
    if ((min && comparer(cible, min) < 0) || (max && comparer(cible, max) > 0)) return;
    setActif(cible);
    doitFocaliser.current = true;
    if (!dansLeMois(cible)) onMonthChange(debutDuMois(cible));
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, jour: DateIso) {
    const actions: Record<string, () => DateIso> = {
      ArrowLeft: () => ajouterJours(jour, -1),
      ArrowRight: () => ajouterJours(jour, 1),
      ArrowUp: () => ajouterJours(jour, -7),
      ArrowDown: () => ajouterJours(jour, 7),
      Home: () => ajouterJours(jour, -jourDeLaSemaine(jour)),
      End: () => ajouterJours(jour, 6 - jourDeLaSemaine(jour)),
      PageUp: () => ajouterMois(jour, -1),
      PageDown: () => ajouterMois(jour, 1),
    };
    const action = actions[event.key];
    if (!action) return;
    event.preventDefault();
    deplacer(action());
  }

  return (
    <div className={[styles.calendar, className ?? ''].filter(Boolean).join(' ')}>
      <div className={styles.entete}>
        <button
          type="button"
          className={styles.nav}
          onClick={() => onMonthChange(moisPrecedent)}
          disabled={!precedentPossible}
          aria-label={previousLabel}
        >
          ‹
        </button>
        <p className={styles.mois} aria-live="polite" id={`${debut}-titre`}>
          {libelleMois(debut, locale)}
        </p>
        <button
          type="button"
          className={styles.nav}
          onClick={() => onMonthChange(moisSuivant)}
          disabled={!suivantPossible}
          aria-label={nextLabel}
        >
          ›
        </button>
      </div>
      <table ref={grille} role="grid" className={styles.grille} aria-label={`${label}, ${libelleMois(debut, locale)}`}>
        <thead>
          <tr>
            {weekdays.map((jour) => (
              <th key={jour} scope="col" abbr={jour} className={styles.jourSemaine}>
                <span aria-hidden="true">{jour.charAt(0)}</span>
                <span className="sr-only">{jour}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {semaines.map((semaine, i) => (
            <tr key={i}>
              {semaine.map((jour, j) =>
                jour === null ? (
                  <td key={`vide-${j}`} />
                ) : (
                  <td key={jour} role="gridcell" aria-selected={jour === value}>
                    <button
                      type="button"
                      data-jour={jour}
                      className={[
                        styles.jour,
                        jour === value ? styles.choisi : '',
                        jour === today ? styles.aujourdhui : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      tabIndex={jour === focusable ? 0 : -1}
                      aria-disabled={indisponible(jour) || undefined}
                      aria-current={jour === today ? 'date' : undefined}
                      aria-label={`${libelleLong(jour, locale)}${indisponible(jour) ? `, ${unavailableLabel}` : ''}`}
                      onClick={() => {
                        setActif(jour);
                        if (!indisponible(jour)) onChange(jour);
                      }}
                      onKeyDown={(event) => onKeyDown(event, jour)}
                    >
                      {Number(jour.slice(8))}
                    </button>
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
