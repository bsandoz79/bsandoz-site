import { Link } from 'react-router-dom';
import { Card, Container, Reveal, SectionTitle, buttonClassName } from '@bsandoz79/blocs';
import { PageMeta } from '../../components/PageMeta';
import { pages } from '../../data/pages';
import { pageRealisations, realisations } from '../../data/realisations';
import styles from './Realisations.module.css';

/** Page Réalisations : une étude de cas par projet (besoin, solution, captures). */
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
        {realisations.map((realisation) => (
          <Reveal key={realisation.id}>
            <Card as="article" padding="lg" className={styles.cas} id={realisation.id} aria-labelledby={`cas-${realisation.id}`}>
              <div className={styles.entete}>
                <p className={styles.categorie}>{realisation.categorie}</p>
                <h2 id={`cas-${realisation.id}`} className={styles.titre}>
                  {realisation.titre}
                </h2>
                <p className={styles.resume}>{realisation.resume}</p>
              </div>
              <dl className={styles.etude}>
                <div>
                  <dt>{t.besoin}</dt>
                  <dd>{realisation.besoin}</dd>
                </div>
                <div>
                  <dt>{t.solution}</dt>
                  <dd>{realisation.solution}</dd>
                </div>
              </dl>
              <div className={styles.captures}>
                <p className={styles.capturesTitre}>{t.captures}</p>
                <ul className={styles.emplacements}>
                  {realisation.emplacements.map((emplacement) => (
                    <li key={emplacement} className={styles.emplacement}>
                      {emplacement}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </Reveal>
        ))}
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
