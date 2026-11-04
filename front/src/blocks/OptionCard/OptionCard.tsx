import type { ReactNode } from 'react';
import styles from './OptionCard.module.css';

export type OptionCardProps = {
  title: string;
  description?: ReactNode;
  /** Prix affiché, déjà formaté (« + 80 € »). */
  price?: string;
  /** Petite mention en plus (« Offert », « Bientôt disponible »…). */
  badge?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Option affichée mais non sélectionnable. */
  disabled?: boolean;
  className?: string;
};

/** Carte à cocher : titre, description et prix, autour d'une vraie case à cocher. */
export function OptionCard({
  title,
  description,
  price,
  badge,
  checked,
  onChange,
  disabled = false,
  className,
}: OptionCardProps) {
  const classes = [styles.card, checked ? styles.checked : '', disabled ? styles.disabled : '', className ?? '']
    .filter(Boolean)
    .join(' ');

  return (
    <label className={classes}>
      <span className={styles.head}>
        <span className={styles.title}>{title}</span>
        <input
          type="checkbox"
          className={styles.check}
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
        />
      </span>
      {description && <span className={styles.description}>{description}</span>}
      {(price || badge) && (
        <span className={styles.foot}>
          {price && <span className={styles.price}>{price}</span>}
          {badge && <span className={styles.badge}>{badge}</span>}
        </span>
      )}
    </label>
  );
}
