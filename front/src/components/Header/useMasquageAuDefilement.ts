import { useEffect, useState } from 'react';

/** En dessous de cette hauteur de défilement, l'en-tête reste toujours visible. */
export const SEUIL_HAUT = 80;
/** Déplacement minimal (en pixels) pour changer d'état : évite les clignotements. */
export const TOLERANCE = 8;

/**
 * Masque l'en-tête quand on descend, le réaffiche dès qu'on remonte.
 * `bloque` (menu ouvert, focus clavier dans l'en-tête) le garde visible.
 * Renvoie aussi `decolle` : la page a défilé (pour ajouter une ombre).
 */
export function useMasquageAuDefilement(bloque: boolean) {
  const [masque, setMasque] = useState(false);
  const [decolle, setDecolle] = useState(false);

  useEffect(() => {
    let dernier = window.scrollY;
    let enAttente = false;

    function mesurer() {
      enAttente = false;
      const y = window.scrollY;
      setDecolle(y > 0);
      if (y < SEUIL_HAUT) {
        setMasque(false);
      } else if (y - dernier > TOLERANCE) {
        setMasque(true);
      } else if (dernier - y > TOLERANCE) {
        setMasque(false);
      } else {
        return; // petit mouvement : on garde l'état et la référence
      }
      dernier = y;
    }

    function surDefilement() {
      if (enAttente) return;
      enAttente = true;
      window.requestAnimationFrame(mesurer);
    }

    window.addEventListener('scroll', surDefilement, { passive: true });
    return () => window.removeEventListener('scroll', surDefilement);
  }, []);

  return { masque: masque && !bloque, decolle };
}
