import { useId } from 'react';
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

/** Logo officiel d'un réseau social, en couleur (dessiné en code) : carré dégradé d'Instagram, rond bleu de Facebook. */
function IconeReseau({ nom }: { nom: Reseau['nom'] }) {
  const degrade = `degrade-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <svg viewBox="0 0 24 24" className={styles.iconeReseau} aria-hidden="true" focusable="false">
      {nom === 'Instagram' ? (
        <>
          <defs>
            <radialGradient id={degrade} cx="0.25" cy="1.05" r="1.2">
              <stop offset="0" stopColor="#ffd600" />
              <stop offset="0.25" stopColor="#ff7a00" />
              <stop offset="0.5" stopColor="#ff0069" />
              <stop offset="0.75" stopColor="#d300c5" />
              <stop offset="1" stopColor="#7638fa" />
            </radialGradient>
          </defs>
          <rect width="24" height="24" rx="6" fill={`url(#${degrade})`} />
          <rect x="5" y="5" width="14" height="14" rx="4.2" fill="none" stroke="#fff" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="3.4" fill="none" stroke="#fff" strokeWidth="1.8" />
          <circle cx="16.3" cy="7.7" r="1.05" fill="#fff" />
        </>
      ) : (
        <>
          <circle cx="12" cy="12" r="11.6" fill="#fff" />
          <path
            fill="#0866ff"
            d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"
          />
        </>
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
          <MoyensPaiement label={paiement.label} moyens={paiement.moyens} liens={paiement.liens} taille="petite" />
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
