import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { skipLink } from '../../data/navigation';
import { BandeauCookies } from '../BandeauCookies';
import { Footer } from '../Footer';
import { Header } from '../Header';
import { MobileBar } from '../MobileBar';
import { Relance, RelanceDevis } from '../Relance';
import { RetourHaut } from '../RetourHaut';
import styles from './Layout.module.css';

/**
 * Mise en page commune à toutes les pages : lien d'évitement, en-tête, contenu,
 * pied de page, barre « Demander un devis » sur mobile, bouton « revenir en haut », bandeau des services tiers
 * carte « Avant de partir » (après 30 secondes) et fenêtre « Toujours là ? » (après 30 minutes).
 */
export function Layout() {
  const { pathname, hash } = useLocation();

  // À chaque changement de page : va à l'ancre demandée (#…) si elle existe, sinon en haut.
  useEffect(() => {
    const cible = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    if (cible) cible.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <div className={styles.layout}>
      <a href={`#${skipLink.target}`} className={styles.skip}>
        {skipLink.label}
      </a>
      <Header />
      <main id={skipLink.target} tabIndex={-1} className={styles.main}>
        <Outlet />
      </main>
      <Footer />
      <MobileBar />
      <RetourHaut />
      <BandeauCookies />
      <Relance />
      <RelanceDevis />
    </div>
  );
}
