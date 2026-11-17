import { BoutonRdv } from '../BoutonRdv';
import { Link, useLocation } from 'react-router-dom';
import { Container } from '@bsandoz79/blocs';
import { rouvrirBandeau } from '../../app/consentement';
import { bandeau } from '../../data/consentement';
import { contact, footer, metierLinks } from '../../data/navigation';
import { pages } from '../../data/pages';
import logoSb from '../../assets/marque/logo-sb.png';
import styles from './Footer.module.css';

/** Année des droits, calculée une fois au chargement du site. */
const ANNEE = new Date().getFullYear();

/** Pied de page sombre et compact : appel à l'action (sauf sur l'accueil et le devis), présentation, liens du site, contact, mentions légales. */
export function Footer() {
  // L'accueil et le devis se terminent déjà par le formulaire de contact : pas de second appel juste dessous.
  const { pathname } = useLocation();
  const avecAppel = pathname !== pages.accueil.path && pathname !== pages.devis.path;

  return (
    <footer className={styles.footer}>
      <Container>
        {avecAppel && (
          <div className={styles.appel}>
            <div>
              <p className={styles.appelTitre}>{footer.appel.titre}</p>
              <p className={styles.appelTexte}>{footer.appel.texte}</p>
            </div>
            <div className={styles.appelActions}>
              <Link to={footer.appel.devis.to} className={styles.boutonRose}>
                {footer.appel.devis.label}
              </Link>
              <BoutonRdv to={footer.appel.rendezVous.to} label={footer.appel.rendezVous.label} className={styles.rdv} />
            </div>
          </div>
        )}

        <div className={styles.colonnes}>
          <div className={styles.marque}>
            <p className={styles.name}>
              <img className={styles.logo} src={logoSb} alt="" width={114} height={96} />
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

          <nav aria-label={footer.metiersLabel}>
            <p className={styles.titre} aria-hidden="true">
              {footer.metiersLabel}
            </p>
            <ul className={styles.liste}>
              {metierLinks.map((item) => (
                <li key={item.label}>
                  <Link to={item.to!}>{item.label}</Link>
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
              <li>
                <button type="button" className={styles.lienBouton} onClick={rouvrirBandeau}>
                  {bandeau.gerer}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
