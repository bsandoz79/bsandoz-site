import type { ReactNode } from 'react';
import styles from './SectionTitle.module.css';

export type SectionTitleProps = {
  /** Titre de la section. */
  title: ReactNode;
  /** Petit sur-titre en capitales, au-dessus du titre. */
  eyebrow?: string;
  /** Phrase d'introduction sous le titre. */
  intro?: ReactNode;
  /** Niveau du titre : `h2` par défaut. */
  level?: 1 | 2 | 3;
  /** Identifiant du titre, pour `aria-labelledby` sur la section. */
  id?: string;
  className?: string;
};

/** En-tête de section : sur-titre, titre et introduction. */
export function SectionTitle({ title, eyebrow, intro, level = 2, id, className }: SectionTitleProps) {
  const Heading = `h${level}` as const;
  return (
    <div className={[styles.root, className ?? ''].filter(Boolean).join(' ')}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <Heading id={id} className={styles.title}>
        {title}
      </Heading>
      {intro && <p className={styles.intro}>{intro}</p>}
    </div>
  );
}
