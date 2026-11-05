import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react';
import { prefersReducedMotion } from '../motion';
import styles from './Reveal.module.css';

export type RevealProps = {
  children: ReactNode;
  /** Balise rendue (`div` par défaut). */
  as?: ElementType;
  /** Délai avant l'apparition, en millisecondes (pour décaler des éléments voisins). */
  delay?: number;
  className?: string;
};

function canAnimate() {
  return typeof window.IntersectionObserver === 'function' && !prefersReducedMotion();
}

/**
 * Fait apparaître son contenu en fondu quand il entre à l'écran, une seule fois.
 * Sans IntersectionObserver ou si les animations sont réduites, le contenu est visible d'emblée.
 */
export function Reveal({ children, as: Tag = 'div', delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(() => !canAnimate());

  useEffect(() => {
    const element = ref.current;
    if (visible || !element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [visible]);

  const style = delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined;
  const classes = [styles.reveal, visible ? styles.visible : '', className ?? ''].filter(Boolean).join(' ');

  return (
    <Tag ref={ref} className={classes} style={style}>
      {children}
    </Tag>
  );
}
