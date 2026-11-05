import { useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import styles from './TextField.module.css';

type Commun = {
  label: string;
  /** Aide sous le libellé. */
  hint?: string;
  /** Message d'erreur : le champ est alors signalé invalide. */
  error?: string;
  className?: string;
};

export type TextFieldProps = Commun &
  (
    | ({ multiline?: false } & Omit<InputHTMLAttributes<HTMLInputElement>, keyof Commun>)
    | ({ multiline: true } & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, keyof Commun>)
  );

/** Champ de saisie : vrai `<label>`, aide et erreur reliées au champ (`aria-describedby`). */
export function TextField(props: TextFieldProps) {
  const { label, hint, error, className, multiline, id: idFourni, ...champ } = props;
  const genere = useId();
  const id = idFourni ?? genere;
  const idAide = hint ? `${id}-aide` : undefined;
  const idErreur = error ? `${id}-erreur` : undefined;
  const decrit = [idAide, idErreur].filter(Boolean).join(' ') || undefined;
  const communs = {
    id,
    className: styles.input,
    'aria-describedby': decrit,
    'aria-invalid': error ? true : undefined,
  };

  return (
    <div className={[styles.field, className ?? ''].filter(Boolean).join(' ')}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {champ.required && <span aria-hidden="true"> *</span>}
      </label>
      {hint && (
        <p id={idAide} className={styles.hint}>
          {hint}
        </p>
      )}
      {multiline ? (
        <textarea {...communs} {...(champ as TextareaHTMLAttributes<HTMLTextAreaElement>)} />
      ) : (
        <input {...communs} {...(champ as InputHTMLAttributes<HTMLInputElement>)} />
      )}
      {error && (
        <p id={idErreur} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
