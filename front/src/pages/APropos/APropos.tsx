import { Link } from 'react-router-dom';
import { Card, Container, SectionTitle, buttonClassName } from '@bsandoz79/blocs';
import { PageMeta } from '../../components/PageMeta';
import { aPropos } from '../../data/apropos';
import { pages } from '../../data/pages';
import styles from './APropos.module.css';
import portrait from '../../assets/baptiste/portrait.webp';

/** Page À propos : photo, parcours, valeurs, zone d'intervention. */
export function APropos() {
  const page = pages.aPropos;
  const t = aPropos;

  return (
    <>
      <PageMeta title={page.title} description={page.description} />
      <section className={styles.hero} aria-labelledby="apropos-titre">
        <Container className={styles.heroInner}>
          <div className={styles.texte}>
            <SectionTitle id="apropos-titre" level={1} title={page.heading} intro={t.intro} />
            <div className={styles.parcours}>
              <h2 className={styles.sousTitre}>{t.parcours.titre}</h2>
              <p className={styles.muted}>{t.parcours.texte}</p>
              <a href={t.parcours.portfolio.href} className={buttonClassName({ variant: 'secondary', className: styles.portfolio })}>
                {t.parcours.portfolio.label} <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <figure className={styles.photo}>
            <img src={portrait} alt={t.photo} width="600" height="800" className={styles.image} />
            <figcaption className={styles.legende}>{t.photoLegende}</figcaption>
          </figure>
        </Container>
      </section>

      <section className="section section--white" aria-labelledby="valeurs-titre">
        <Container className={styles.stack}>
          <SectionTitle id="valeurs-titre" title={t.valeurs.titre} />
          <ul className={styles.valeurs}>
            {t.valeurs.items.map((valeur) => (
              <li key={valeur.title}>
                <Card tone="muted" className={styles.valeur}>
                  <h3 className={styles.valeurTitre}>{valeur.title}</h3>
                  <p className={styles.muted}>{valeur.text}</p>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="section" aria-labelledby="zone-titre">
        <Container className={styles.colonnes}>
          <div className={styles.stack}>
            <SectionTitle id="zone-titre" title={t.zone.titre} />
            <ul className={styles.zone}>
              {t.zone.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <aside className={styles.appel} aria-labelledby="apropos-appel">
            <h2 id="apropos-appel" className={styles.appelTitre}>
              {t.appel.titre}
            </h2>
            <p>{t.appel.texte}</p>
            <Link to={t.appel.rdv.to} className={buttonClassName({ block: true })}>
              {t.appel.rdv.label}
            </Link>
            <Link to={t.appel.devis.to} className={`${buttonClassName({ block: true })} ${styles.outline}`}>
              {t.appel.devis.label}
            </Link>
          </aside>
        </Container>
      </section>
    </>
  );
}
