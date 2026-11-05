import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import styles from './Card.module.css';

export type CardTone = 'surface' | 'muted' | 'dark';
export type CardPadding = 'none' | 'md' | 'lg';

export type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  /** Balise rendue (`div` par défaut) : `article`, `li`… */
  as?: ElementType;
  /** Fond : blanc, gris clair ou bleu marine (texte clair). */
  tone?: CardTone;
  /** Marges intérieures. `none` pour une image en pleine largeur. */
  padding?: CardPadding;
  /** Se soulève au survol. */
  lift?: boolean;
};

/** Carte : bloc arrondi, bordé, contenu libre empilé verticalement. */
export function Card({
  children,
  as: Tag = 'div',
  tone = 'surface',
  padding = 'md',
  lift = false,
  className,
  ...rest
}: CardProps) {
  const classes = [styles.card, styles[tone], styles[`padding-${padding}`], lift ? styles.lift : '', className ?? '']
    .filter(Boolean)
    .join(' ');
  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}
