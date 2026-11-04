import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

/**
 * Mise en page commune à toutes les pages. L'en-tête et le pied de page viendront s'ajouter ici.
 */
export function Layout() {
  const { pathname } = useLocation();

  // Revient en haut de la page à chaque changement de page.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <main id="contenu">
      <Outlet />
    </main>
  );
}
