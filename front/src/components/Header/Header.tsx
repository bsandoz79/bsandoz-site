import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Container, buttonClassName } from '@bsandoz79/blocs';
import { header, informatiquePrefix, metierLinks, serviceTabs, type NavLink as NavItem } from '../../data/navigation';
import styles from './Header.module.css';

const MENU_ID = 'menu-principal';
const METIERS_ID = 'menu-metiers';

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
  return (
    <NavLink to={item.to} className={className ?? navClass}>
      {item.label}
    </NavLink>
  );
}

/**
 * En-tête du site : onglets des deux catégories de services, logo, navigation
 * (avec le sous-menu « Métiers ») et menu repliable sur mobile.
 */
export function Header() {
  const { pathname } = useLocation();
  // On retient l'adresse où chaque menu a été ouvert : changer de page les referme.
  const [menuOpenAt, setMenuOpenAt] = useState<string | null>(null);
  const [metiersOpenAt, setMetiersOpenAt] = useState<string | null>(null);
  const menuOpen = menuOpenAt === pathname;
  const metiersOpen = metiersOpenAt === pathname;

  const toggleRef = useRef<HTMLButtonElement>(null);
  const metiersRef = useRef<HTMLLIElement>(null);

  const [firstLink, ...otherLinks] = header.links;
  const inInformatique = pathname.startsWith(informatiquePrefix);
  const metiersActive = metierLinks.some((item) => item.to === pathname);

  // Un clic en dehors du sous-menu « Métiers » le referme.
  useEffect(() => {
    if (!metiersOpen) return;
    function onPointerDown(event: PointerEvent) {
      if (!metiersRef.current?.contains(event.target as Node)) setMetiersOpenAt(null);
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [metiersOpen]);

  function onKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Escape') return;
    if (metiersOpen) {
      setMetiersOpenAt(null);
      metiersRef.current?.querySelector('button')?.focus();
    } else if (menuOpen) {
      setMenuOpenAt(null);
      toggleRef.current?.focus();
    }
  }

  return (
    <header className={styles.header} onKeyDown={onKeyDown}>
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

        <nav
          id={MENU_ID}
          aria-label={header.navLabel}
          className={menuOpen ? `${styles.nav} ${styles.navOpen}` : styles.nav}
        >
          <ul className={styles.list}>
            <li>
              <ItemLink item={firstLink} />
            </li>
            <li ref={metiersRef} className={styles.dropdown}>
              <button
                type="button"
                className={metiersActive ? `${styles.link} ${styles.active}` : styles.link}
                aria-expanded={metiersOpen}
                aria-controls={METIERS_ID}
                onClick={() => setMetiersOpenAt(metiersOpen ? null : pathname)}
              >
                {header.metiersLabel}
                <svg className={styles.chevron} width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <ul id={METIERS_ID} className={styles.submenu} hidden={!metiersOpen}>
                {metierLinks.map((item) => (
                  <li key={item.label}>
                    <ItemLink item={item} />
                  </li>
                ))}
              </ul>
            </li>
            {otherLinks.map((item) => (
              <li key={item.label}>
                <ItemLink item={item} />
              </li>
            ))}
          </ul>
          <Link to={header.cta.to} className={buttonClassName({ className: styles.cta })}>
            {header.cta.label}
          </Link>
        </nav>
      </Container>
    </header>
  );
}
