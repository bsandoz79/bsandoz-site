import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { situer, type Situation } from '../../data/zones';

export type EtatPosition =
  | { statut: 'attente' }
  | { statut: 'enCours' }
  | { statut: 'trouvee'; lat: number; lng: number; situation: Situation }
  /** Refusée ; `bloquee` si elle l'est encore après une nouvelle demande (réglage du navigateur). */
  | { statut: 'refusee'; bloquee: boolean }
  | { statut: 'introuvable' }
  /** Le navigateur ne sait pas donner de position : rien à proposer. */
  | { statut: 'impossible' };

/** Part de la carte visible à l'écran pour demander la position. */
const SEUIL_VISIBLE = 0.4;

/**
 * Position du visiteur, demandée une seule fois, quand la carte apparaît vraiment à l'écran.
 * Elle reste dans le navigateur : rien n'est envoyé ni enregistré.
 */
export function usePosition(cible: RefObject<HTMLElement | null>) {
  const [etat, setEtat] = useState<EtatPosition>({ statut: 'attente' });
  const demandes = useRef(0);

  const demander = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setEtat({ statut: 'impossible' });
      return;
    }
    demandes.current += 1;
    const relance = demandes.current > 1;
    setEtat({ statut: 'enCours' });
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        setEtat({ statut: 'trouvee', lat: coords.latitude, lng: coords.longitude, situation: situer(coords.latitude, coords.longitude) }),
      (erreur) =>
        setEtat(erreur.code === erreur.PERMISSION_DENIED ? { statut: 'refusee', bloquee: relance } : { statut: 'introuvable' }),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 10 * 60 * 1000 },
    );
  }, []);

  // Première demande : quand la carte est bien visible (pas avant, pas au chargement de la page).
  useEffect(() => {
    if (!cible.current || typeof IntersectionObserver === 'undefined') return;
    const observateur = new IntersectionObserver(
      (entrees) => {
        if (entrees.some((e) => e.isIntersecting)) {
          observateur.disconnect();
          demander();
        }
      },
      { threshold: SEUIL_VISIBLE },
    );
    observateur.observe(cible.current);
    return () => observateur.disconnect();
  }, [cible, demander]);

  return { etat, demander };
}
