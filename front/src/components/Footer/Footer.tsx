import { Link } from 'react-router-dom';
import { Container } from '@bsandoz79/blocs';
import { contact, footer } from '../../data/navigation';
import styles from './Footer.module.css';

/** Année des droits, calculée une fois au chargement du site. */
const ANNEE = new Date().getFullYear();

/** Pied de page sombre et compact : appel à l'action, présentation, liens du site, contact, mentions légales. */
export function Footer() {
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.appel}>
          <div>
            <p className={styles.appelTitre}>{footer.appel.titre}</p>
            <p className={styles.appelTexte}>{footer.appel.texte}</p>
          </div>
          <div className={styles.appelActions}>
            <Link to={footer.appel.estimer.to} className={styles.boutonRose}>
              {footer.appel.estimer.label}
            </Link>
            <Link to={footer.appel.rendezVous.to} className={styles.boutonClair}>
              {footer.appel.rendezVous.label}
            </Link>
          </div>
        </div>

        <div className={styles.colonnes}>
          <div className={styles.marque}>
            <p className={styles.name}>
              <span className={styles.logo} aria-hidden="true">
                S<span className={styles.logoAccent}>B</span>
              </span>
              {footer.name}
            </p>
            <p>{footer.tagline}</p>
            <p>{footer.zone}</p>
          </div>

          <nav aria-label={footer.siteLabel}>
            <p className={styles.titre} aria-hidden="true">
              {footer.siteLabel}
            </p>
            <ul className={styles.liste}>
              {footer.site.map((item) => (
                <li key={item.to}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={footer.contactLabel}>
            <p className={styles.titre} aria-hidden="true">
              {footer.contactLabel}
            </p>
            <ul className={styles.liste}>
              <li>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </li>
              {contact.phone && (
                <li>
                  <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a>
                </li>
              )}
              <li>
                <a href={contact.portfolio}>{footer.portfolioLabel}</a>
              </li>
              <li>
                <Link to={footer.espaceClient.to}>{footer.espaceClient.label}</Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className={styles.bas}>
          <p>{footer.droits(ANNEE)}</p>
          <nav aria-label={footer.legalLabel}>
            <ul className={styles.legal}>
              {footer.legal.map((item) => (
                <li key={item.to}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
