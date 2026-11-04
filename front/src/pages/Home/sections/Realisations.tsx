import { Container } from '../../../blocks/Container';
import { Reveal } from '../../../blocks/Reveal';
import { SectionTitle } from '../../../blocks/SectionTitle';
import { RealisationCard } from '../../../components/RealisationCard';
import { realisationsSection } from '../../../data/accueil';
import { realisations } from '../../../data/realisations';
import styles from './Sections.module.css';

/** Aperçu des réalisations. */
export function Realisations() {
  return (
    <section className="section" aria-labelledby="realisations-titre">
      <Container className={styles.stack}>
        <SectionTitle id="realisations-titre" eyebrow={realisationsSection.eyebrow} title={realisationsSection.title} />
        <ul className={styles.grid3}>
          {realisations.map((realisation, i) => (
            <Reveal as="li" key={realisation.id} delay={i * 80}>
              <RealisationCard realisation={realisation} />
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
