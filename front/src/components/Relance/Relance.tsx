import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useConsentement } from '../../app/consentement';
import { contact } from '../../data/navigation';
import { relance as t, relanceAutorisee } from '../../data/relance';
import { barreMobileVisible } from '../MobileBar';
import styles from './Relance.module.css';

/** Date de la dernière ouverture, pour ne pas la remontrer avant `silenceJours`. */
export const CLE_RELANCE = 'bsandoz-relance';

function dejaMontree(): boolean {
  try {
    const date = Number(window.localStorage.getItem(CLE_RELANCE));
    return date > 0 && Date.now() - date < t.silenceJours * 86_400_000;
  } catch {
    return false;
  }
}

function noterOuverture() {
  try {
    window.localStorage.setItem(CLE_RELANCE, String(Date.now()));
  } catch {
    /* stockage indisponible (navigation privée) : elle pourra revenir à la prochaine visite */
  }
}

/**
 * Carte « Avant de partir » en bas à droite, 30 secondes après l'arrivée sur le site (le temps compte d'une page à l'autre).
 * Elle ne bloque pas la page, attend que le bandeau des cookies soit fermé, et ne s'ouvre qu'une fois par mois.
 * Elle propose une maquette gratuite (formulaire pré-réglé) ou un appel.
 */
export function Relance() {
  const { pathname } = useLocation();
  const { bandeauVisible } = useConsentement();
  const [finie] = useState(dejaMontree);
  const [ecoule, setEcoule] = useState(false);
  const [fermee, setFermee] = useState(false);
  const visible = !finie && ecoule && !fermee && !bandeauVisible && relanceAutorisee(pathname);

  useEffect(() => {
    if (finie) return undefined;
    const minuteur = window.setTimeout(() => setEcoule(true), t.delaiMs);
    return () => window.clearTimeout(minuteur);
  }, [finie]);

  useEffect(() => {
    if (!visible) return undefined;
    noterOuverture();
    const echap = (e: KeyboardEvent) => { if (e.key === 'Escape') setFermee(true); };
    window.addEventListener('keydown', echap);
    return () => window.removeEventListener('keydown', echap);
  }, [visible]);

  if (!visible) return null;
  const fermer = () => setFermee(true);

  return (
    <aside
      className={[styles.carte, 'anim-appear', barreMobileVisible(pathname) && styles.auDessusBarre].filter(Boolean).join(' ')}
      aria-labelledby="relance-titre"
    >
      <p className={styles.surtitre}>{t.surtitre}</p>
      <h2 id="relance-titre" className={styles.titre}>{t.titre}</h2>
      <p className={styles.texte}>{t.texte}</p>
      <div className={styles.actions}>
        <Link to={t.maquette.to} className={styles.principal} onClick={fermer}>
          {t.maquette.label}
        </Link>
        {contact.phone && (
          <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className={styles.secondaire} onClick={fermer}>
            {t.appeler} {contact.phone}
          </a>
        )}
      </div>
      <button type="button" className={styles.fermer} onClick={fermer} aria-label={t.fermer} title={t.fermer}>
        <span aria-hidden="true">×</span>
      </button>
    </aside>
  );
}
