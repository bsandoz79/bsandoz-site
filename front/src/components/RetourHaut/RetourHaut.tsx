import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { retourHaut } from '../../data/navigation';
import { barreMobileVisible } from '../MobileBar';
import styles from './RetourHaut.module.css';

/**
 * Petit bouton rond et transparent, en bas à droite : il ramène en haut de la page.
 * Il n'apparaît qu'une fois la page descendue, et se place au-dessus de la barre mobile quand elle est là.
 */
export function RetourHaut() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const surDefilement = () => setVisible(window.scrollY > retourHaut.seuil);
    surDefilement();
    window.addEventListener('scroll', surDefilement, { passive: true });
    return () => window.removeEventListener('scroll', surDefilement);
  }, []);

  function remonter() {
    const reduit = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    window.scrollTo({ top: 0, behavior: reduit ? 'auto' : 'smooth' });
  }

  const classes = [styles.bouton, visible && styles.visible, barreMobileVisible(pathname) && styles.auDessusBarre]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      onClick={remonter}
      aria-label={retourHaut.label}
      title={retourHaut.label}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
        <path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
