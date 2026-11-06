import { useState } from 'react';
import { flushSync } from 'react-dom';
import { changerTheme, themeEnregistre, type Theme } from '../../app/theme';
import { themeTextes } from '../../data/navigation';
import styles from './ThemeToggle.module.css';

/** Bouton de l'en-tête : bascule entre le thème nuit et le thème clair (choix gardé dans le navigateur). */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => themeEnregistre());
  const suivant: Theme = theme === 'nuit' ? 'clair' : 'nuit';

  // Rideau de gauche à droite ; l'icône change dans la même image (flushSync).
  function basculer() {
    changerTheme(suivant, () => flushSync(() => setTheme(suivant)));
  }

  return (
    <button type="button" className={styles.bouton} onClick={basculer} aria-label={themeTextes.vers[suivant]} title={themeTextes.vers[suivant]}>
      {theme === 'nuit' ? (
        // Soleil : passer en clair.
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
        </svg>
      ) : (
        // Lune : passer en nuit.
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
        </svg>
      )}
    </button>
  );
}
