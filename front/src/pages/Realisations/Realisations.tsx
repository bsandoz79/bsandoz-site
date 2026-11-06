import { Link } from 'react-router-dom';
import { Container, Reveal, SectionTitle, buttonClassName } from '@bsandoz79/blocs';
import { PageMeta } from '../../components/PageMeta';
import { RealisationCard } from '../../components/RealisationCard';
import { pages } from '../../data/pages';
import { pageRealisations, realisations } from '../../data/realisations';
import styles from './Realisations.module.css';

/** Page Réalisations : une carte par projet ; chaque carte ouvre la page de ce seul projet. */
export function Realisations() {
  const page = pages.realisations;
  const t = pageRealisations;

  return (
    <>
      <PageMeta title={page.title} description={page.description} />
      <section className={styles.intro} aria-labelledby="realisations-page-titre">
        <Container>
          <SectionTitle id="realisations-page-titre" level={1} title={page.heading} intro={t.intro} />
        </Container>
      </section>

      <Container className={styles.liste}>
        <ul className={styles.grille}>
          {realisations.map((realisation, i) => (
            <Reveal as="li" key={realisation.id} delay={i * 80}>
              <RealisationCard realisation={realisation} headingLevel={2} />
            </Reveal>
          ))}
        </ul>
        <div className={styles.appel}>
          <p className={styles.appelTexte}>{t.appel.text}</p>
          <Link to={t.appel.to} className={buttonClassName({ size: 'lg' })}>
            {t.appel.label}
          </Link>
        </div>
      </Container>
    </>
  );
}
