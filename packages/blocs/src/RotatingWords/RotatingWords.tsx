import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../motion';
import styles from './RotatingWords.module.css';

export type RotatingWordsProps = {
  /** Mots ou expressions affichés tour à tour. */
  words: string[];
  /** Durée d'affichage de chaque mot, en millisecondes. */
  interval?: number;
  className?: string;
};

/**
 * Fait défiler des mots verticalement, l'un après l'autre.
 * Les lecteurs d'écran lisent la liste complète ; si l'utilisateur réduit les animations,
 * le premier mot reste affiché.
 */
export function RotatingWords({ words, interval = 2500, className }: RotatingWordsProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length < 2 || prefersReducedMotion()) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % words.length), interval);
    return () => window.clearInterval(timer);
  }, [words.length, interval]);

  return (
    <span className={[styles.root, className ?? ''].filter(Boolean).join(' ')}>
      <span className="sr-only">{words.join(', ')}</span>
      <span className={styles.window} aria-hidden="true">
        <span className={styles.track} style={{ transform: `translateY(-${index * 1.2}em)` }}>
          {words.map((word, i) => (
            <span key={word} className={styles.word} data-active={i === index}>
              {word}
            </span>
          ))}
        </span>
      </span>
    </span>
  );
}
