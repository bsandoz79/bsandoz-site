import { useEffect, useState, type CSSProperties } from 'react';
import alterno from '../../../assets/ecrans/alterno.webp';
import cadeaux from '../../../assets/ecrans/cadeaux.webp';
import christophePoixMoto from '../../../assets/ecrans/christophe-poix-moto.webp';
import kebab from '../../../assets/ecrans/kebab.webp';
import perfectClean from '../../../assets/ecrans/perfect-clean.webp';
import shopTonChargeur from '../../../assets/ecrans/shoptonchargeur.webp';
import { medias } from '../../../data/medias';
import { ecransTelephone, hero, reservationDemo } from '../../../data/accueil';
import styles from './HeroDemo.module.css';

type IdEcran = (typeof ecransTelephone)[number]['id'];

const IMAGES: Record<Exclude<IdEcran, 'reservation'>, string> = {
  'christophe-poix-moto': christophePoixMoto,
  'perfect-clean': perfectClean,
  cadeaux,
  shoptonchargeur: shopTonChargeur,
  kebab,
  alterno,
};

/** Étapes de la réservation fictive : 1 jour choisi, 2 heure choisie, 3 « Réserver », 4 rendez-vous et acompte reçus. */
const ETAPES_MS = [900, 1900, 2900, 3700];

function animationsReduites() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

/** Écran courant : chacun reste le temps de son défilement. Immobile si l'utilisateur réduit les animations. */
function useEcranCourant() {
  const [courant, setCourant] = useState(0);
  useEffect(() => {
    if (animationsReduites()) return;
    const minuterie = window.setTimeout(() => {
      setCourant((c) => (c + 1) % ecransTelephone.length);
    }, ecransTelephone[courant].duree);
    return () => window.clearTimeout(minuterie);
  }, [courant]);
  return courant;
}

/**
 * Étape de la réservation fictive. Le composant qui l'utilise est remonté à chaque passage (clé), donc l'étape
 * repart de zéro sans remise à zéro dans un effet.
 */
function useEtapeReservation() {
  const [etape, setEtape] = useState(() => (animationsReduites() ? ETAPES_MS.length : 0));
  useEffect(() => {
    if (animationsReduites()) return;
    const minuteries = ETAPES_MS.map((ms, i) => window.setTimeout(() => setEtape(i + 1), ms));
    return () => minuteries.forEach((m) => window.clearTimeout(m));
  }, []);
  return etape;
}

/** « Acompte reçu », à côté du téléphone, à la dernière étape de la réservation. */
function ToastPaiement() {
  const etape = useEtapeReservation();
  const [, paiement] = reservationDemo.notifications;
  if (etape < ETAPES_MS.length) return null;
  return (
    <div className={`${styles.toast} ${styles.toastBottom} anim-appear`}>
      <span className={styles.check}>✓</span>
      <span className={styles.toastText}>
        <span className={styles.toastLabel}>{paiement.label}</span>
        <span className={styles.toastValue}>{paiement.value}</span>
      </span>
    </div>
  );
}

function ReservationFictive({ jouer }: { jouer: boolean }) {
  const etapeJouee = useEtapeReservation();
  const etape = jouer ? etapeJouee : 0;
  const r = reservationDemo;
  const [rendezVous] = r.notifications;
  return (
    <div className={styles.reservation}>
      <div className={styles.top}>
        <span className={styles.business}>{r.business}</span>
        <span className={styles.screenTitle}>{r.title}</span>
      </div>
      <div className={styles.body}>
        <span className={styles.month}>{r.month}</span>
        <div className={styles.calendar}>
          {r.weekdays.map((jour, i) => (
            <span key={`${jour}-${i}`} className={styles.weekday}>{jour}</span>
          ))}
          {r.days.map(({ day, off, selected }) => (
            <span
              key={day}
              className={[styles.day, off ? styles.off : '', selected && etape >= 1 ? `${styles.selected} ${styles.touche}` : ''].filter(Boolean).join(' ')}
            >
              {day}
            </span>
          ))}
        </div>
        <div className={styles.slots}>
          {r.slots.map((creneau) => (
            <span
              key={creneau}
              className={creneau === r.selectedSlot && etape >= 2 ? `${styles.slot} ${styles.slotSelected} ${styles.touche}` : styles.slot}
            >
              {creneau}
            </span>
          ))}
        </div>
        <span className={etape >= 3 ? `${styles.book} ${styles.appuye}` : styles.book}>{r.button}</span>
      </div>
      {etape >= 4 && (
        <div className={styles.notification}>
          <span className={styles.toastLabel}>{rendezVous.label}</span>
          <span className={styles.toastValue}>{rendezVous.value}</span>
        </div>
      )}
    </div>
  );
}

/**
 * Téléphone du haut de page : chaque site défile tout seul de haut en bas, puis le suivant ; une réservation fictive
 * se joue étape par étape. Purement décoratif, donc caché aux lecteurs d'écran.
 */
export function HeroDemo() {
  const courant = useEcranCourant();
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
        <span className={styles.boutonsGauche} />
        <span className={styles.boutonDroit} />
        <div className={styles.screen}>
          {ecransTelephone.map((e, i) => (
            <div key={e.id} className={i === courant ? `${styles.diapo} ${styles.diapoCourante}` : styles.diapo} style={{ '--duree': `${e.duree}ms` } as CSSProperties}>
              {e.id === 'reservation' ? (
                <ReservationFictive key={i === courant ? `joue-${courant}` : 'repos'} jouer={i === courant} />
              ) : (
                <img className={styles.ecran} src={IMAGES[e.id]} alt="" width="400" loading="lazy" decoding="async" />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className={`${styles.toast} ${styles.toastTop} anim-appear`} key={ecran.id}>
        <span className={styles.toastLabel}>{ecran.type}</span>
        <span className={styles.toastValue}>{ecran.nom}</span>
      </div>
      {ecran.id === 'reservation' && <ToastPaiement key={`paiement-${courant}`} />}
      <ol className={styles.points}>
        {ecransTelephone.map((e, i) => (
          <li key={e.id} className={i === courant ? styles.pointCourant : undefined} />
        ))}
      </ol>
    </div>
  );
}
