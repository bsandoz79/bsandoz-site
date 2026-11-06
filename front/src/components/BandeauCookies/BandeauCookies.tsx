import { Link, useLocation } from 'react-router-dom';
import { choisir, fermerPourLInstant, useConsentement } from '../../app/consentement';
import { bandeau as t } from '../../data/consentement';
import { barreMobileVisible } from '../MobileBar';
import styles from './BandeauCookies.module.css';

/**
 * Bande discrète en bas de l'écran : elle informe et laisse choisir, sans bloquer la page.
 * « Accepter » et « Refuser » ont le même poids ; la croix ferme pour cette visite seulement.
 */
export function BandeauCookies() {
  const { pathname } = useLocation();
  const { bandeauVisible } = useConsentement();
  if (!bandeauVisible) return null;

  return (
    <section
      className={[styles.bandeau, 'anim-appear', barreMobileVisible(pathname) && styles.auDessusBarre].filter(Boolean).join(' ')}
      aria-label={t.label}
    >
      <p className={styles.texte}>
        {t.texte}{' '}
        <Link to={t.enSavoirPlus.to} className={styles.lien}>
          {t.enSavoirPlus.label}
        </Link>
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.bouton} onClick={() => choisir('refuse')}>
          {t.refuser}
        </button>
        <button type="button" className={styles.bouton} onClick={() => choisir('accepte')}>
          {t.accepter}
        </button>
      </div>
      <button type="button" className={styles.fermer} onClick={fermerPourLInstant} aria-label={t.fermer} title={t.fermer}>
        <span aria-hidden="true">×</span>
      </button>
    </section>
  );
}
