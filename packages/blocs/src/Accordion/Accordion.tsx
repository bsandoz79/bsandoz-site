import type { ReactNode } from 'react';
import styles from './Accordion.module.css';

export type AccordionItem = { id: string; question: string; answer: ReactNode };

export type AccordionProps = {
  items: AccordionItem[];
  /** Niveau de titre des questions (pour la hiérarchie de la page). */
  headingLevel?: 2 | 3 | 4;
  /** Identifiant de la question ouverte au départ. */
  defaultOpen?: string;
  className?: string;
};

/**
 * Liste de questions dépliables, construite sur `<details>` / `<summary>` :
 * clavier (Entrée, Espace) et lecteurs d'écran pris en charge par le navigateur, sans script.
 */
export function Accordion({ items, headingLevel = 3, defaultOpen, className }: AccordionProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <div className={[styles.accordion, className ?? ''].filter(Boolean).join(' ')}>
      {items.map((item) => (
        <details key={item.id} id={item.id} className={styles.item} open={item.id === defaultOpen || undefined}>
          <summary className={styles.summary}>
            <Heading className={styles.question}>{item.question}</Heading>
            <span className={styles.icon} aria-hidden="true" />
          </summary>
          <div className={styles.answer}>{item.answer}</div>
        </details>
      ))}
    </div>
  );
}
