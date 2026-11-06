import { useEffect, useRef, useState, type ReactNode } from 'react';

/** Part de l'élément visible à l'écran pour ouvrir le rideau. */
const SEUIL = 0.35;

/**
 * Rideau qui s'ouvre la première fois que son contenu (une photo) arrive à l'écran :
 * deux panneaux s'écartent vers les côtés. Animation et styles : `anim-rideau` dans `styles/animations.css`
 * (coupée si l'utilisateur réduit les animations). Sans IntersectionObserver, le contenu est visible tout de suite.
 */
export function Rideau({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ouvert, setOuvert] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    if (ouvert || !ref.current) return;
    const observateur = new IntersectionObserver(
      (entrees) => {
        if (entrees.some((e) => e.isIntersecting)) {
          setOuvert(true);
          observateur.disconnect();
        }
      },
      { threshold: SEUIL },
    );
    observateur.observe(ref.current);
    return () => observateur.disconnect();
  }, [ouvert]);

  const classes = ['anim-rideau', ouvert && 'anim-rideau--ouvert', className].filter(Boolean).join(' ');
  return (
    <div ref={ref} className={classes} data-rideau={ouvert ? 'ouvert' : 'ferme'}>
      {children}
    </div>
  );
}
