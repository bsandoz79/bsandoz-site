import { Link, useLocation } from 'react-router-dom';
import { mobileBar } from '../../data/navigation';
import styles from './MobileBar.module.css';
import { barreMobileVisible } from './visibilite';

/**
 * Barre « Estimer » fixée en bas de l'écran sur mobile (masquée sur ordinateur par le CSS).
 * Elle n'est pas affichée sur les pages où l'on est déjà en train d'estimer.
 */
export function MobileBar() {
  const { pathname } = useLocation();
  if (!barreMobileVisible(pathname)) return null;

  return (
    <>
      {/* Réserve la place de la barre en bas de page : le pied de page n'est jamais caché derrière. */}
      <div className={styles.espace} aria-hidden="true" />
      <aside className={styles.bar} aria-label={mobileBar.label}>
        <p className={styles.text}>{mobileBar.text}</p>
        <Link to={mobileBar.cta.to} className={styles.cta}>
          {mobileBar.cta.label}
        </Link>
      </aside>
    </>
  );
}
