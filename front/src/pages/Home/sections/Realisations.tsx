import { Link } from 'react-router-dom';
import { Container, SectionTitle, Showcase } from '@bsandoz79/blocs';
import { RealisationCard } from '../../../components/RealisationCard';
import { realisationsSection } from '../../../data/accueil';
import { pages } from '../../../data/pages';
import { exemplesOutils } from '../../../data/exemples';
import { realisations } from '../../../data/realisations';
import styles from './Sections.module.css';

/** Réalisations qui défilent, suivies d'exemples d'outils (maquettes marquées « Exemple »), et le lien vers toutes les réalisations. */
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
      </Container>
      {/* La vitrine prend toute la largeur : les cartes entrent et sortent par les bords de l'écran. */}
      <Showcase
        className={styles.vitrine}
        label={realisationsSection.title}
        pauseLabel={realisationsSection.pause}
        playLabel={realisationsSection.lecture}
        items={[...realisations, ...exemplesOutils].map((r) => ({ id: r.id, content: <RealisationCard realisation={r} /> }))}
      />
    </section>
  );
}
