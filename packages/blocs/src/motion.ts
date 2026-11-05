/** Vrai si l'utilisateur a demandé à réduire les animations (réglage du système). */
export function prefersReducedMotion() {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
