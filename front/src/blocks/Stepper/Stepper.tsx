import type { CSSProperties } from 'react';
import styles from './Stepper.module.css';

export type StepperProps = {
  /** Nom de la liste d'étapes (« Étapes de la demande »). */
  label: string;
  steps: string[];
  /** Index de l'étape en cours (0 = première). */
  current: number;
  /** Texte lu pour une étape terminée (« terminée »). */
  doneLabel?: string;
  className?: string;
};

/** Indicateur de progression : barre et liste des étapes, l'étape en cours marquée `aria-current="step"`. */
export function Stepper({ label, steps, current, doneLabel = 'terminée', className }: StepperProps) {
  const progression = steps.length > 1 ? (current / (steps.length - 1)) * 100 : 100;
  const style = { '--stepper-progress': `${progression}%` } as CSSProperties;

  return (
    <div className={[styles.stepper, className ?? ''].filter(Boolean).join(' ')} style={style}>
      <div className={styles.track} aria-hidden="true">
        <div className={styles.bar} />
      </div>
      <ol className={styles.steps} aria-label={label}>
        {steps.map((step, i) => {
          const state = i < current ? 'done' : i === current ? 'current' : 'todo';
          return (
            <li key={step} className={`${styles.step} ${styles[state]}`} aria-current={state === 'current' ? 'step' : undefined}>
              <span className={styles.dot} aria-hidden="true">
                {state === 'done' ? '✓' : i + 1}
              </span>
              <span className={styles.name}>
                {step}
                {state === 'done' && <span className="sr-only"> ({doneLabel})</span>}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
