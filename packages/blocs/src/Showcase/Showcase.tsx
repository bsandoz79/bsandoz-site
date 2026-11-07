import { useState, type CSSProperties, type ReactNode } from 'react';
import styles from './Showcase.module.css';

export type ShowcaseItem = {
  /** Clé unique de l'élément. */
  id: string;
  /** Contenu affiché : une carte, une image… */
  content: ReactNode;
};

export type ShowcaseProps = {
  items: ShowcaseItem[];
  /** Nom de la liste pour les lecteurs d'écran. */
  label: string;
  /** Durée d'un tour complet, en secondes. */
  duration?: number;
  /** Texte du bouton qui arrête le défilement. */
  pauseLabel?: string;
  /** Texte du bouton qui le relance. */
  playLabel?: string;
  className?: string;
};

/**
 * Vitrine qui défile en continu : des cartes passent de droite à gauche.
 * Le défilement s'arrête au survol, au clavier (focus dans une carte) et avec le bouton pause.
 * La liste est rendue deux fois pour boucler sans à-coup ; la copie est cachée et inerte.
 * Si les animations sont réduites, la vitrine devient une rangée que l'on fait glisser.
 */
export function Showcase({
  items,
  label,
  duration = 40,
  pauseLabel = 'Mettre en pause',
  playLabel = 'Relancer le défilement',
  className,
}: ShowcaseProps) {
  const [paused, setPaused] = useState(false);
  const style = { '--showcase-duration': `${duration}s` } as CSSProperties;
  const list = (copy: boolean) => (
    <ul
      className={copy ? `${styles.list} ${styles.copy}` : styles.list}
      aria-label={copy ? undefined : label}
      aria-hidden={copy || undefined}
      inert={copy || undefined}
    >
      {items.map((item) => (
        <li key={item.id} className={styles.item}>
          {item.content}
        </li>
      ))}
    </ul>
  );

  return (
    <div className={[styles.showcase, paused ? styles.paused : '', className ?? ''].filter(Boolean).join(' ')} style={style}>
      <button type="button" className={styles.toggle} aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
        {paused ? playLabel : pauseLabel}
      </button>
      <div className={styles.viewport}>
        <div className={styles.track}>
          {list(false)}
          {list(true)}
        </div>
      </div>
    </div>
  );
}
