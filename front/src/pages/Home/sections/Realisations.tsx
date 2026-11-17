import { Link } from 'react-router-dom';
import { Container, SectionTitle } from '@bsandoz79/blocs';
import { RealisationCard } from '../../../components/RealisationCard';
import { realisationsSection } from '../../../data/accueil';
import { pages } from '../../../data/pages';
import { exemplesOutils } from '../../../data/exemples';
import { realisations } from '../../../data/realisations';
import styles from './Sections.module.css';

/**
 * Réalisations en grille, toutes visibles d'un coup (on choisit sans attendre), suivies d'exemples d'outils (maquettes
 * marquées « Exemple »), et le lien vers toutes les réalisations.
 */
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
          {[...realisations, ...exemplesOutils].map((r) => (
            <li key={r.id}><RealisationCard realisation={r} /></li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
