import { useEffect, useState } from 'react';
import alterno from '../../../assets/ecrans/alterno.webp';
import cadeaux from '../../../assets/ecrans/cadeaux.webp';
import christophePoixMoto from '../../../assets/ecrans/christophe-poix-moto.webp';
import kebab from '../../../assets/ecrans/kebab.webp';
import perfectClean from '../../../assets/ecrans/perfect-clean.webp';
import shopTonChargeur from '../../../assets/ecrans/shoptonchargeur.webp';
import { medias } from '../../../data/medias';
import { DUREE_ECRAN_MS, ecransTelephone, hero } from '../../../data/accueil';
import styles from './HeroDemo.module.css';

const IMAGES: Record<(typeof ecransTelephone)[number]['id'], string> = {
  'christophe-poix-moto': christophePoixMoto,
  'perfect-clean': perfectClean,
  cadeaux,
  shoptonchargeur: shopTonChargeur,
  kebab,
  alterno,
};

/** Défilement automatique, sauf si l'utilisateur réduit les animations ou si la page est cachée. */
function useEcranCourant(nombre: number) {
  const [courant, setCourant] = useState(0);
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const minuterie = window.setInterval(() => {
      if (!document.hidden) setCourant((c) => (c + 1) % nombre);
    }, DUREE_ECRAN_MS);
    return () => window.clearInterval(minuterie);
  }, [nombre]);
  return courant;
}

/**
 * Téléphone du haut de page : les sites de Baptiste défilent sur l'écran, avec leur nom à côté.
 * Purement décoratif, donc caché aux lecteurs d'écran.
 */
export function HeroDemo() {
  const courant = useEcranCourant(ecransTelephone.length);
  const ecran = ecransTelephone[courant];

  return (
    <div className={styles.scene} aria-hidden="true">
      <figure className={styles.portrait}>
        <img src={medias.portrait} alt="" width="600" height="800" />
        <figcaption className={styles.portraitNom}>
          {hero.identite.nom}
          <span>{hero.identite.role}</span>
        </figcaption>
      </figure>
      <div className={styles.phone}>
        {/* Cadre façon smartphone récent : boutons latéraux, îlot en haut de l'écran. */}
        <span className={styles.boutonsGauche} />
        <span className={styles.boutonDroit} />
        <div className={styles.screen}>
          <span className={styles.ilot} />
          <div className={styles.defile} style={{ transform: `translateX(-${courant * 100}%)` }}>
            {ecransTelephone.map((e) => (
              <img key={e.id} className={styles.ecran} src={IMAGES[e.id]} alt="" width="400" height="848" loading="lazy" decoding="async" />
            ))}
          </div>
        </div>
      </div>
      <div className={`${styles.toast} ${styles.toastTop} anim-appear`} key={ecran.id}>
        <span className={styles.toastLabel}>{ecran.type}</span>
        <span className={styles.toastValue}>{ecran.nom}</span>
      </div>
      <ol className={styles.points}>
        {ecransTelephone.map((e, i) => (
          <li key={e.id} className={i === courant ? styles.pointCourant : undefined} />
        ))}
      </ol>
    </div>
  );
}
