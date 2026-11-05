import type { ReactNode } from 'react';
import styles from './PriceSummary.module.css';

export type PriceLine = {
  label: string;
  /** Montant déjà formaté. */
  amount: string;
  /** Ligne offerte : montant barré et mention. */
  free?: boolean;
};

export type PriceSummaryProps = {
  /** Nom du récapitulatif (pour les lecteurs d'écran). */
  title: string;
  /** Petite ligne au-dessus du prix (« Votre estimation · artisan »). */
  eyebrow?: string;
  /** Prix principal, déjà formaté. Annoncé à chaque changement. */
  total: string;
  /** Ligne sous le prix (délai, précision). */
  caption?: ReactNode;
  lines?: PriceLine[];
  /** Mention des lignes offertes. */
  freeLabel?: string;
  /** Contenu libre sous le détail (suggestions, boutons). */
  children?: ReactNode;
  /** Petite mention en bas (TVA, caractère indicatif). */
  footnote?: ReactNode;
  className?: string;
};

/** Récapitulatif de prix : total, détail des lignes et contenu libre. */
export function PriceSummary({
  title,
  eyebrow,
  total,
  caption,
  lines = [],
  freeLabel = 'Offert',
  children,
  footnote,
  className,
}: PriceSummaryProps) {
  return (
    <aside className={[styles.summary, className ?? ''].filter(Boolean).join(' ')} aria-label={title}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <p className={styles.total} aria-live="polite" aria-atomic="true">
        {total}
      </p>
      {caption && <p className={styles.caption}>{caption}</p>}
      {lines.length > 0 && (
        <ul className={styles.lines}>
          {lines.map((line, i) => (
            <li key={`${line.label}-${i}`} className={styles.line}>
              <span>
                {line.label}
                {line.free && <span className={styles.free}> · {freeLabel}</span>}
              </span>
              {line.free ? <s className={styles.struck}>{line.amount}</s> : <span>{line.amount}</span>}
            </li>
          ))}
        </ul>
      )}
      {children}
      {footnote && <p className={styles.footnote}>{footnote}</p>}
    </aside>
  );
}
