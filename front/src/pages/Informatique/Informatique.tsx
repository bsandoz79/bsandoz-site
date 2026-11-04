import { Link } from 'react-router-dom';
import { buttonClassName } from '../../blocks/Button';
import { Card } from '../../blocks/Card';
import { Container } from '../../blocks/Container';
import { Reveal } from '../../blocks/Reveal';
import { SectionTitle } from '../../blocks/SectionTitle';
import { PageMeta } from '../../components/PageMeta';
import {
  deroulementInformatique,
  informatiqueMentions,
  pageInformatique,
  servicesInformatique,
} from '../../data/informatique';
import { pages } from '../../data/pages';
import styles from './Informatique.module.css';

/** Page Informatique sur place : prestations, déroulement, tarif sur devis. */
export function Informatique() {
  const page = pages.informatique;
  const t = pageInformatique;

  return (
    <>
      <PageMeta title={page.title} description={page.description} />

      <section className={styles.hero} aria-labelledby="informatique-titre">
        <Container className={styles.heroInner}>
          <p className={styles.badge}>{t.badge}</p>
          <h1 id="informatique-titre" className={styles.titre}>
            {page.heading}
          </h1>
          <p className={styles.intro}>{t.intro}</p>
          <div className={styles.actions}>
            <Link to={t.composer.to} className={buttonClassName({ size: 'lg' })}>
              {t.composer.label}
            </Link>
            <Link to={t.rdv.to} className={buttonClassName({ size: 'lg', variant: 'secondary' })}>
              {t.rdv.label}
            </Link>
          </div>
          <ul className={styles.reassurance}>
            {t.reassurance.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="section section--white" aria-labelledby="services-titre">
        <Container className={styles.stack}>
          <SectionTitle id="services-titre" eyebrow={t.services.eyebrow} title={t.services.title} />
          <ul className={styles.grille}>
            {servicesInformatique.map((service, i) => (
              <Reveal as="li" key={service.id} delay={(i % 4) * 60}>
                <Card
                  tone={service.bientot ? 'muted' : 'surface'}
                  className={service.bientot ? `${styles.service} ${styles.bientot}` : styles.service}
                >
                  <h3 className={styles.serviceNom}>{service.nom}</h3>
                  <p className={styles.muted}>{service.description}</p>
                  {service.bientot && <p className={styles.mention}>{informatiqueMentions.bientot}</p>}
                </Card>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section className="section" aria-labelledby="deroulement-titre">
        <Container className={styles.colonnes}>
          <div className={styles.stack}>
            <SectionTitle id="deroulement-titre" eyebrow={t.deroulement.eyebrow} title={t.deroulement.title} />
            <ol className={styles.etapes}>
              {deroulementInformatique.map((etape, i) => (
                <li key={etape.titre} className={styles.etape}>
                  <span className={styles.numero} aria-hidden="true">
                    {i + 1}
                  </span>
                  <span>
                    <strong>{etape.titre}</strong> : {etape.texte}
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <aside className={styles.tarif} aria-labelledby="tarif-titre">
            <h2 id="tarif-titre" className={styles.tarifTitre}>
              {t.tarif.title}
            </h2>
            <p>{t.tarif.text}</p>
            <p>{informatiqueMentions.zone}</p>
            <Link to={t.composer.to} className={buttonClassName({ block: true })}>
              {t.composer.label}
            </Link>
          </aside>
        </Container>
      </section>
    </>
  );
}
