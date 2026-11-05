import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import styles from './Container.module.css';

export type ContainerSize = 'md' | 'narrow';

export type ContainerProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  /** Balise rendue (`div` par défaut) : `section`, `nav`, `header`… */
  as?: ElementType;
  /** Largeur maximale : `md` (contenu courant) ou `narrow` (texte à lire). */
  size?: ContainerSize;
};

/**
 * Conteneur centré, à largeur maximale, avec des marges latérales.
 */
export function Container({ children, as: Tag = 'div', size = 'md', className, ...rest }: ContainerProps) {
  const classes = [styles.container, styles[size], className ?? ''].filter(Boolean).join(' ');
  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}
