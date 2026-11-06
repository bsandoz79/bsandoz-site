import { useEffect, useRef, type RefObject } from 'react';

/**
 * Quand une étape apparaît (`visible` passe de faux à vrai), la page défile jusqu'à elle et la centre à l'écran.
 * Défilement doux, ou instantané si l'utilisateur réduit les animations. Le focus clavier n'est pas déplacé.
 */
export function useCentrerEtape(visible: boolean, cible: RefObject<HTMLElement | null>) {
  const avant = useRef(visible);

  useEffect(() => {
    if (visible && !avant.current) {
      const reduit = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
      cible.current?.scrollIntoView?.({ behavior: reduit ? 'auto' : 'smooth', block: 'center' });
    }
    avant.current = visible;
  }, [visible, cible]);
}
