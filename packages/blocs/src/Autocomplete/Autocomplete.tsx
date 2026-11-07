import { useId, useState, type KeyboardEvent } from 'react';
import styles from './Autocomplete.module.css';

export type AutocompleteProps = {
  label: string;
  value: string;
  /** Appelé à chaque frappe et au choix d'une suggestion. */
  onChange: (value: string) => void;
  /** Liste complète : seules celles qui correspondent à la saisie sont proposées. */
  suggestions: string[];
  hint?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  maxLength?: number;
  /** Nombre maximal de suggestions affichées. */
  max?: number;
  /** Texte lu par les lecteurs d'écran : nombre de suggestions. */
  announce?: (count: number) => string;
  className?: string;
};

/** Minuscules, sans accents : « Électricien » et « electri » se rejoignent. */
export const normaliser = (texte: string) =>
  texte
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();

/** Suggestions pour une saisie : d'abord celles qui commencent par la saisie, puis celles qui la contiennent. */
export function filtrerSuggestions(suggestions: string[], saisie: string, max = 6): string[] {
  const s = normaliser(saisie);
  if (!s) return [];
  const debut = suggestions.filter((x) => normaliser(x).startsWith(s));
  const dedans = suggestions.filter((x) => !debut.includes(x) && normaliser(x).includes(s));
  return [...debut, ...dedans].filter((x) => normaliser(x) !== s).slice(0, max);
}

/**
 * Champ texte qui propose de finir le mot pendant la saisie (motif « combobox » de l'ARIA) :
 * flèches haut/bas pour parcourir, Entrée pour choisir, Échap pour fermer. On peut aussi écrire
 * librement : la saisie est gardée telle quelle si aucune suggestion ne convient.
 */
export function Autocomplete({
  label,
  value,
  onChange,
  suggestions,
  hint,
  placeholder,
  error,
  required,
  maxLength,
  max = 6,
  announce = (n) => (n > 1 ? `${n} suggestions` : n === 1 ? '1 suggestion' : ''),
  className,
}: AutocompleteProps) {
  const id = useId();
  const [ouvert, setOuvert] = useState(false);
  const [actif, setActif] = useState(-1);
  const liste = ouvert ? filtrerSuggestions(suggestions, value, max) : [];
  const idListe = `${id}-liste`;
  const idAide = hint ? `${id}-aide` : undefined;
  const idErreur = error ? `${id}-erreur` : undefined;

  function choisir(suggestion: string) {
    onChange(suggestion);
    setOuvert(false);
    setActif(-1);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setOuvert(false);
      setActif(-1);
      return;
    }
    if (liste.length === 0) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActif((i) => (i + 1) % liste.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActif((i) => (i <= 0 ? liste.length - 1 : i - 1));
    } else if (event.key === 'Enter' && actif >= 0) {
      event.preventDefault();
      choisir(liste[actif]);
    }
  }

  return (
    <div className={[styles.field, className ?? ''].filter(Boolean).join(' ')}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {hint && (
        <p id={idAide} className={styles.hint}>
          {hint}
        </p>
      )}
      <div className={styles.zone}>
        <input
          id={id}
          type="text"
          role="combobox"
          autoComplete="off"
          className={styles.input}
          value={value}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          aria-autocomplete="list"
          aria-expanded={liste.length > 0}
          aria-controls={idListe}
          aria-activedescendant={actif >= 0 && liste[actif] ? `${id}-option-${actif}` : undefined}
          aria-describedby={[idAide, idErreur].filter(Boolean).join(' ') || undefined}
          aria-invalid={error ? true : undefined}
          onChange={(e) => {
            onChange(e.target.value);
            setOuvert(true);
            setActif(-1);
          }}
          onKeyDown={onKeyDown}
          onBlur={() => setOuvert(false)}
        />
        <ul id={idListe} role="listbox" aria-label={label} className={styles.liste} hidden={liste.length === 0}>
          {liste.map((suggestion, i) => (
            <li
              key={suggestion}
              id={`${id}-option-${i}`}
              role="option"
              aria-selected={i === actif}
              className={i === actif ? `${styles.option} ${styles.actif}` : styles.option}
              // mousedown plutôt que click : le choix passe avant que le champ perde le focus.
              onMouseDown={(e) => {
                e.preventDefault();
                choisir(suggestion);
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      </div>
      <p className="sr-only" role="status">
        {liste.length > 0 ? announce(liste.length) : ''}
      </p>
      {error && (
        <p id={idErreur} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
