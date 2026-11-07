import { Link } from 'react-router-dom';
import { Card } from '@bsandoz79/blocs';
import type { CarteRealisation } from '../../data/realisations';
import styles from './RealisationCard.module.css';

type RealisationCardProps = {
  realisation: CarteRealisation;
  /** Niveau du titre de la carte. */
  headingLevel?: 2 | 3;
};

/** Couverture : la première capture dans un cadre de navigateur ; sinon, une illustration provisoire. */
function Apercu({ realisation }: { realisation: CarteRealisation }) {
  const { apercu, emplacements, captures } = realisation;
  if (captures.length > 0) {
    return (
      <div className={styles.couverture} aria-hidden="true">
        <span className={styles.dots}>
          <span />
          <span />
          <span />
        </span>
        <img src={captures[0].src} alt="" loading="lazy" decoding="async" className={styles.image} />
        {realisation.exemple && <span className={styles.exemple}>{exempleTexte}</span>}
      </div>
    );
  }
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

/** Mention d'une maquette : une entreprise fictive, pas un client. */
const exempleTexte = 'Exemple';

/** Carte d'une réalisation, ou d'un exemple d'outil : aperçu, métier, titre, résumé et lien. */
export function RealisationCard({ realisation, headingLevel = 3 }: RealisationCardProps) {
  const Heading = `h${headingLevel}` as const;
  const titleId = `realisation-${realisation.id}`;

  return (
    <Card as="article" padding="none" lift className={styles.card} aria-labelledby={titleId}>
      <Apercu realisation={realisation} />
      <div className={styles.body}>
        <p className={styles.categorie}>
          {realisation.exemple && <span className="sr-only">{exempleTexte} · </span>}
          {realisation.categorie}
        </p>
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
