import type { CSSProperties, ReactNode } from 'react';
import styles from './Marquee.module.css';

export type MarqueeProps = {
  /** Éléments affichés dans la bande. */
  items: string[];
  /** Nom de la liste pour les lecteurs d'écran. */
  label: string;
  /** Durée d'un tour complet, en secondes. */
  duration?: number;
  className?: string;
  /** Rendu d'un élément (ex. un lien). `copie` : seconde liste, cachée aux lecteurs d'écran et hors du clavier. */
  renderItem?: (item: string, copie: boolean) => ReactNode;
};

/**
 * Bande qui défile en continu. La liste est rendue deux fois pour un défilement sans à-coup ;
 * la copie est cachée aux lecteurs d'écran. Si les animations sont réduites, la bande est figée
 * et les éléments passent à la ligne.
 */
export function Marquee({ items, label, duration = 32, className, renderItem }: MarqueeProps) {
  const style = { '--marquee-duration': `${duration}s` } as CSSProperties;

  return (
    <div className={[styles.marquee, className ?? ''].filter(Boolean).join(' ')} style={style}>
      <div className={styles.track}>
        <ul className={styles.list} aria-label={label}>
          {items.map((item) => (
            <li key={item} className={styles.item}>
              {renderItem ? renderItem(item, false) : item}
            </li>
          ))}
        </ul>
        <ul className={`${styles.list} ${styles.copy}`} aria-hidden="true">
          {items.map((item) => (
            <li key={item} className={styles.item}>
              {renderItem ? renderItem(item, true) : item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
