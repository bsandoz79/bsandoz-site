import { Link } from 'react-router-dom';
import { Card, Container, Reveal, SectionTitle, buttonClassName } from '@bsandoz79/blocs';
import { offres } from '../../../data/accueil';
import { formules, mentionsPrix, prixFormule, lignePageSupplementaire } from '../../../data/offres';
import { pages } from '../../../data/pages';
import sections from './Sections.module.css';
import styles from './Offres.module.css';

/** Les trois formules, avec leur prix. La formule Fonctionnel est mise en avant. */
export function Offres() {
  return (
    <section className="section section--white" aria-labelledby="offres-titre">
      <Container className={sections.stack}>
        <div className={sections.head}>
          <SectionTitle id="offres-titre" eyebrow={offres.eyebrow} title={offres.title} />
          <Link to={offres.link.to} className={sections.arrowLink}>
            {offres.link.label} <span aria-hidden="true">→</span>
          </Link>
        </div>
        <ul className={sections.grid3}>
          {formules.map((formule, i) => {
            const featured = formule.id === 'fonctionnel';
            return (
              <Reveal as="li" key={formule.id} delay={i * 80}>
                <Card
                  as="article"
                  tone={featured ? 'dark' : 'muted'}
                  padding="lg"
                  lift
                  className={sections.fill}
                  aria-labelledby={`offre-${formule.id}`}
                >
                  {featured && <p className={styles.badge}>{offres.featuredBadge}</p>}
                  <h3 id={`offre-${formule.id}`} className={styles.name}>
                    {formule.nom}
                  </h3>
                  <p className={featured ? styles.taglineDark : styles.tagline}>{formule.accroche}</p>
                  <p className={styles.price}>{prixFormule(formule)}</p>
                  <ul className={styles.features}>
                    {formule.pointsForts.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <p className={featured ? `${styles.pageSup} ${styles.pageSupDark}` : styles.pageSup}>{lignePageSupplementaire()}</p>
                  <Link
                    to={`${pages.composer.path}?formule=${formule.id}`}
                    className={buttonClassName({
                      variant: featured ? 'primary' : 'secondary',
                      block: true,
                      className: styles.cta,
                    })}
                  >
                    {offres.cta[formule.id]}
                  </Link>
                </Card>
              </Reveal>
            );
          })}
        </ul>
        <p className={sections.note}>
          {mentionsPrix.tva} {mentionsPrix.apresMiseEnLigne}
        </p>
      </Container>
    </section>
  );
}
