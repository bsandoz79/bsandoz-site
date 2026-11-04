import type { ReactNode } from 'react';
import styles from './ChoiceChips.module.css';

export type Choice<T extends string> = { value: T; label: string };

export type ChoiceChipsProps<T extends string> = {
  /** Question posée (légende du groupe). */
  legend: ReactNode;
  /** Nom du groupe de boutons radio (unique dans la page). */
  name: string;
  choices: Choice<T>[];
  /** Valeur choisie, ou `null` si rien n'est choisi. */
  value: T | null;
  onChange: (value: T) => void;
  /** Cache visuellement la légende (elle reste lue par les lecteurs d'écran). */
  hideLegend?: boolean;
  className?: string;
};

/**
 * Choix unique présenté en pastilles. Ce sont de vrais boutons radio :
 * flèches du clavier pour changer de choix, légende lue par les lecteurs d'écran.
 */
export function ChoiceChips<T extends string>({
  legend,
  name,
  choices,
  value,
  onChange,
  hideLegend = false,
  className,
}: ChoiceChipsProps<T>) {
  return (
    <fieldset className={[styles.fieldset, className ?? ''].filter(Boolean).join(' ')}>
      <legend className={hideLegend ? 'sr-only' : styles.legend}>{legend}</legend>
      <div className={styles.chips}>
        {choices.map((choice) => (
          <label key={choice.value} className={styles.chip}>
            <input
              type="radio"
              className={styles.input}
              name={name}
              value={choice.value}
              checked={choice.value === value}
              onChange={() => onChange(choice.value)}
            />
            <span className={styles.label}>{choice.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
