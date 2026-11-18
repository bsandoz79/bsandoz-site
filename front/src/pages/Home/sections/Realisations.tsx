import { Link } from 'react-router-dom';
import { Container, SectionTitle } from '@bsandoz79/blocs';
import { RealisationCard } from '../../../components/RealisationCard';
import { realisationsSection } from '../../../data/accueil';
import { pages } from '../../../data/pages';
import { realisations } from '../../../data/realisations';
import styles from './Sections.module.css';

/** Nombre de réalisations sur l'accueil : les autres, et les exemples d'outils, sont sur la page Réalisations. */
export const REALISATIONS_ACCUEIL = 3;

/** Les trois premières réalisations, en grille, et le lien vers toutes les réalisations. */
export function Realisations() {
  return (
    <section className="section" aria-labelledby="realisations-titre">
      <Container className={styles.stack}>
        <div className={styles.head}>
          <SectionTitle id="realisations-titre" title={realisationsSection.title} />
          <Link to={pages.realisations.path} className={styles.arrowLink}>
            {realisationsSection.lien} <span aria-hidden="true">→</span>
          </Link>
        </div>
        <ul className={styles.grilleRealisations} aria-label={realisationsSection.title}>
          {realisations.slice(0, REALISATIONS_ACCUEIL).map((r) => (
            <li key={r.id}><RealisationCard realisation={r} /></li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
