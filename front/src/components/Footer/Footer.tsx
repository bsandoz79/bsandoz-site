import { BoutonRdv } from '../BoutonRdv';
import { Link, useLocation } from 'react-router-dom';
import { Container, MoyensPaiement } from '@bsandoz79/blocs';
import { rouvrirBandeau } from '../../app/consentement';
import { bandeau } from '../../data/consentement';
import { contact, footer, metierLinks, type Reseau } from '../../data/navigation';
import { pages } from '../../data/pages';
import { paiement } from '../../data/paiement';
import logoSb from '../../assets/marque/logo-sb.png';
import styles from './Footer.module.css';

/** Icône au trait d'un réseau social (dessinée en code, couleur du texte). */
function IconeReseau({ nom }: { nom: Reseau['nom'] }) {
  return (
    <svg viewBox="0 0 24 24" className={styles.iconeReseau} aria-hidden="true" focusable="false">
      {nom === 'Instagram' ? (
        <>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
        </>
      ) : (
        <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4a21 21 0 0 0-2.3-.1c-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      )}
    </svg>
  );
}

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
              <img className={styles.logo} src={logoSb} alt="" width={152} height={96} />
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
              {contact.reseaux.map((r) => (
                <li key={r.nom}>
                  <a href={r.url} className={styles.reseau} rel="me noopener" target="_blank" aria-label={`${r.nom} ${r.compte} (nouvel onglet)`}>
                    <IconeReseau nom={r.nom} />
                    {r.nom}
                  </a>
                </li>
              ))}
              <li>
                <Link to={footer.espaceClient.to}>{footer.espaceClient.label}</Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className={styles.bas}>
          <p>{footer.droits(ANNEE)}</p>
          <MoyensPaiement label={paiement.label} moyens={paiement.moyens} taille="petite" />
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
