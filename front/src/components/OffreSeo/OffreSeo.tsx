import { Link } from 'react-router-dom';
import { buttonClassName } from '@bsandoz79/blocs';
import { offreSeo } from '../../data/offres';
import { pages } from '../../data/pages';
import styles from './OffreSeo.module.css';

/** Référencement Google seul : une offre à part, pour ceux qui ont déjà un site. */
export function OffreSeo({ titreId = 'offre-seo-titre' }: { titreId?: string }) {
  const o = offreSeo();
  return (
    <section className={styles.encart} aria-labelledby={titreId}>
      <div className={styles.texte}>
        <p className={styles.badge}>{o.badge}</p>
        <h3 id={titreId} className={styles.titre}>
          {o.titre}
        </h3>
        <p className={styles.description}>{o.texte}</p>
      </div>
      <div className={styles.prixBloc}>
        <p className={styles.prix}>{o.prix}</p>
        <p className={styles.marche}>{o.marche}</p>
        <Link to={pages.devis.path} className={buttonClassName({ className: styles.bouton })}>
          Faire le point sur mon site
        </Link>
        <p className={styles.source}>{o.source}</p>
      </div>
    </section>
  );
}
