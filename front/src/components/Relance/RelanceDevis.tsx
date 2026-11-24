import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useConsentement } from '../../app/consentement';
import { relanceAutorisee, relanceDevis as t } from '../../data/relance';
import styles from './RelanceDevis.module.css';

/** Date de la dernière ouverture, pour ne pas la remontrer avant `silenceJours`. */
export const CLE_RELANCE_DEVIS = 'bsandoz-relance-devis';

function dejaMontree(): boolean {
  try {
    const date = Number(window.localStorage.getItem(CLE_RELANCE_DEVIS));
    return date > 0 && Date.now() - date < t.silenceJours * 86_400_000;
  } catch {
    return false;
  }
}

function noterOuverture() {
  try {
    window.localStorage.setItem(CLE_RELANCE_DEVIS, String(Date.now()));
  } catch {
    /* stockage indisponible (navigation privée) : elle pourra revenir à la prochaine visite */
  }
}

/**
 * Fenêtre « Toujours là ? Alors demandez votre devis », au milieu de l'écran, 30 minutes après l'ouverture du site
 * (le temps compte d'une page à l'autre). Elle attend que le bandeau des cookies soit fermé et ne s'ouvre qu'une fois par mois.
 * Fond voilé : un clic à côté, la croix, « Plus tard » ou Échap la ferment.
 */
export function RelanceDevis() {
  const { pathname } = useLocation();
  const { bandeauVisible } = useConsentement();
  const [finie] = useState(dejaMontree);
  const [ecoule, setEcoule] = useState(false);
  const [fermee, setFermee] = useState(false);
  const fenetre = useRef<HTMLDivElement>(null);
  const visible = !finie && ecoule && !fermee && !bandeauVisible && relanceAutorisee(pathname);

  useEffect(() => {
    if (finie) return undefined;
    const minuteur = window.setTimeout(() => setEcoule(true), t.delaiMs);
    return () => window.clearTimeout(minuteur);
  }, [finie]);

  useEffect(() => {
    if (!visible) return undefined;
    noterOuverture();
    const avant = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    fenetre.current?.querySelector<HTMLElement>('a, button')?.focus();
    const clavier = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFermee(true);
      if (e.key !== 'Tab' || !fenetre.current) return;
      // Le focus reste dans la fenêtre tant qu'elle est ouverte.
      const elements = [...fenetre.current.querySelectorAll<HTMLElement>('a, button')];
      const premier = elements[0];
      const dernier = elements[elements.length - 1];
      if (e.shiftKey && document.activeElement === premier) {
        e.preventDefault();
        dernier.focus();
      } else if (!e.shiftKey && document.activeElement === dernier) {
        e.preventDefault();
        premier.focus();
      }
    };
    window.addEventListener('keydown', clavier);
    return () => {
      window.removeEventListener('keydown', clavier);
      avant?.focus();
    };
  }, [visible]);

  if (!visible) return null;
  const fermer = () => setFermee(true);

  return (
    <div className={styles.fond} onClick={fermer} data-testid="relance-devis-fond">
      <div
        ref={fenetre}
        role="dialog"
        aria-modal="true"
        aria-labelledby="relance-devis-titre"
        aria-describedby="relance-devis-texte"
        className={`${styles.fenetre} anim-appear`}
        onClick={(e) => e.stopPropagation()}
      >
        <p className={styles.surtitre}>{t.surtitre}</p>
        <h2 id="relance-devis-titre" className={styles.titre}>{t.titre}</h2>
        <p id="relance-devis-texte" className={styles.texte}>{t.texte}</p>
        <div className={styles.actions}>
          <Link to={t.devis.to} className={styles.principal} onClick={fermer}>
            {t.devis.label}
          </Link>
          <button type="button" className={styles.secondaire} onClick={fermer}>
            {t.plusTard}
          </button>
        </div>
        <button type="button" className={styles.fermer} onClick={fermer} aria-label={t.fermer} title={t.fermer}>
          <span aria-hidden="true">×</span>
        </button>
      </div>
    </div>
  );
}
