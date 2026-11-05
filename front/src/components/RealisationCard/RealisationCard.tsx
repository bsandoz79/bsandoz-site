import { Link } from 'react-router-dom';
import { Card } from '@bsandoz79/blocs';
import type { Realisation } from '../../data/realisations';
import styles from './RealisationCard.module.css';

type RealisationCardProps = {
  realisation: Realisation;
  /** Niveau du titre de la carte. */
  headingLevel?: 2 | 3;
};

/** Illustration provisoire, en attendant les vraies captures. */
function Apercu({ realisation }: { realisation: Realisation }) {
  const { apercu, emplacements } = realisation;
  return (
    <div className={`${styles.apercu} ${styles[apercu]}`} aria-hidden="true">
      {apercu === 'site' && (
        <>
          <span className={styles.dots}>
            <span />
            <span />
            <span />
          </span>
          <span className={styles.screen}>{emplacements[0]}</span>
        </>
      )}
      {apercu === 'telephones' &&
        emplacements.map((label) => (
          <span key={label} className={styles.phone}>
            <span className={styles.phoneScreen}>{label}</span>
          </span>
        ))}
      {apercu === 'plateforme' && (
        <>
          <span className={styles.tile} />
          <span className={styles.tile} />
          <span className={styles.tile} />
          <span className={styles.wide}>{emplacements[0]}</span>
        </>
      )}
    </div>
  );
}

/** Carte d'une réalisation : aperçu, métier, titre, résumé et lien. */
export function RealisationCard({ realisation, headingLevel = 3 }: RealisationCardProps) {
  const Heading = `h${headingLevel}` as const;
  const titleId = `realisation-${realisation.id}`;

  return (
    <Card as="article" padding="none" lift className={styles.card} aria-labelledby={titleId}>
      <Apercu realisation={realisation} />
      <div className={styles.body}>
        <p className={styles.categorie}>{realisation.categorie}</p>
        <Heading id={titleId} className={styles.titre}>
          {realisation.titre}
        </Heading>
        <p className={styles.resume}>{realisation.resume}</p>
        <Link to={realisation.lien.to} className={styles.lien}>
          {realisation.lien.label}
          <span className="sr-only"> : {realisation.titre}</span> <span aria-hidden="true">→</span>
        </Link>
      </div>
    </Card>
  );
}
