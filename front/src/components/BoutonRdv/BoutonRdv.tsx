import { Link } from 'react-router-dom';
import { pages } from '../../data/pages';
import styles from './BoutonRdv.module.css';

type BoutonRdvProps = {
  label: string;
  to?: string;
  /** Prend toute la largeur disponible. */
  block?: boolean;
  className?: string;
};

/**
 * Bouton de prise de rendez-vous : reconnaissable partout sur le site (icône de calendrier, coins moins
 * arrondis, contour rose), et différent des boutons « Demander un devis ». Le texte prend la couleur du fond.
 */
export function BoutonRdv({ label, to = pages.rendezVous.path, block = false, className }: BoutonRdvProps) {
  return (
    <Link to={to} className={[styles.bouton, block ? styles.block : '', className ?? ''].filter(Boolean).join(' ')}>
      <span className={styles.icone} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
      </span>
      {label}
    </Link>
  );
}
