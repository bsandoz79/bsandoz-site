import { useRef, useState, type KeyboardEvent } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Container, buttonClassName } from '@bsandoz79/blocs';
import { header, informatiquePrefix, serviceTabs, type NavLink as NavItem } from '../../data/navigation';
import styles from './Header.module.css';
import { ThemeToggle } from '../ThemeToggle';
import { useMasquageAuDefilement } from './useMasquageAuDefilement';

const MENU_ID = 'menu-principal';

function navClass({ isActive }: { isActive: boolean }) {
  return isActive ? `${styles.link} ${styles.active}` : styles.link;
}

function ItemLink({ item, className }: { item: NavItem; className?: string }) {
  if (item.href !== undefined) {
    return (
      <a href={item.href} className={className ?? styles.link}>
        {item.label}
      </a>
    );
  }
  // Lien vers une section (« /#faq ») : jamais signalé comme la page en cours.
  if (item.to.includes('#')) {
    return (
      <Link to={item.to} className={className ?? styles.link}>
        {item.label}
      </Link>
    );
  }
  return (
    <NavLink to={item.to} className={className ?? navClass}>
      {item.label}
    </NavLink>
  );
}

/**
 * En-tête du site : onglets des deux catégories de services, logo, navigation
 * (Réalisations, À propos, Questions fréquentes), bouton « Demander un devis » et menu repliable sur mobile.
 */
export function Header() {
  const { pathname } = useLocation();
  // On retient l'adresse où chaque menu a été ouvert : changer de page les referme.
  const [menuOpenAt, setMenuOpenAt] = useState<string | null>(null);
  const menuOpen = menuOpenAt === pathname;
  // Le focus clavier dans l'en-tête le garde visible (on ne cache jamais ce qu'on est en train d'utiliser).
  const [focusDedans, setFocusDedans] = useState(false);
  const { masque, decolle, enHaut } = useMasquageAuDefilement(menuOpen || focusDedans);
  // Hors du haut de page, seule la barre principale revient : les onglets restent cachés.
  const etat = masque ? styles.masque : enHaut ? '' : styles.compact;

  const toggleRef = useRef<HTMLButtonElement>(null);

  const inInformatique = pathname.startsWith(informatiquePrefix);
  function onKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Escape') return;
    if (menuOpen) {
      setMenuOpenAt(null);
      toggleRef.current?.focus();
    }
  }

  return (
    <header
      className={[styles.header, etat, decolle ? styles.decolle : ''].filter(Boolean).join(' ')}
      onKeyDown={onKeyDown}
      onFocus={() => setFocusDedans(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocusDedans(false);
      }}
    >
      <div className={styles.tabsBar}>
        <Container as="nav" aria-label={header.tabsLabel}>
          <ul className={styles.tabs}>
            {serviceTabs.map((tab) => {
              const current = tab.to === informatiquePrefix ? inInformatique : !inInformatique;
              return (
                <li key={tab.to}>
                  <Link
                    to={tab.to}
                    className={current ? `${styles.tab} ${styles.tabCurrent}` : styles.tab}
                    aria-current={current ? 'true' : undefined}
                  >
                    {tab.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </div>

      <Container className={styles.bar}>
        <Link to="/" className={styles.brand}>
          <span className={styles.logo} aria-hidden="true">
            S<span className={styles.logoAccent}>B</span>
          </span>
          <span className={styles.name}>{header.name}</span>
        </Link>

        {/* Bouton de thème (toujours visible) et bouton du menu (téléphone). */}
        <div className={styles.outils}>
          <Link to={header.espaceClient.to} className={styles.espace} aria-label={header.espaceClient.label} title={header.espaceClient.label}>
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4.5 20.5c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5" />
            </svg>
            <span className={styles.espaceTexte}>{header.espaceClient.label}</span>
          </Link>
          <ThemeToggle />
          <button
            ref={toggleRef}
            type="button"
            className={styles.toggle}
            aria-expanded={menuOpen}
            aria-controls={MENU_ID}
            onClick={() => setMenuOpenAt(menuOpen ? null : pathname)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
            <span className="sr-only">{menuOpen ? header.closeMenu : header.openMenu}</span>
          </button>
        </div>

        <nav
          id={MENU_ID}
          aria-label={header.navLabel}
          className={menuOpen ? `${styles.nav} ${styles.navOpen}` : styles.nav}
        >
          <ul className={styles.list}>
            {header.links.map((item) => (
              <li key={item.label}>
                <ItemLink item={item} />
              </li>
            ))}
          </ul>
          <Link to={header.cta.to} className={buttonClassName({ className: styles.cta })}>
            {header.cta.label}
          </Link>
          {/* Dans le menu du téléphone : le lien en toutes lettres. Sur ordinateur, il est dans la barre. */}
          <Link to={header.espaceClient.to} className={styles.espaceMenu}>
            {header.espaceClient.label}
          </Link>
        </nav>
      </Container>
    </header>
  );
}
