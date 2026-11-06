/**
 * Thème du site : « nuit » (par défaut) ou « clair ». Le choix est gardé dans le navigateur
 * (stockage local, aucun cookie) et appliqué par l'attribut `data-theme` de <html>.
 * `index.html` applique déjà le thème avant l'affichage, pour éviter un flash de l'autre thème.
 */
export type Theme = 'nuit' | 'clair';

export const CLE_THEME = 'bsandoz.theme';
export const THEME_PAR_DEFAUT: Theme = 'nuit';

/** Couleur de la barre du navigateur sur téléphone, selon le thème. */
export const COULEUR_BARRE: Record<Theme, string> = { nuit: '#0b0f29', clair: '#f7f6fa' };

export function themeEnregistre(): Theme {
  try {
    const valeur = window.localStorage.getItem(CLE_THEME);
    return valeur === 'clair' || valeur === 'nuit' ? valeur : THEME_PAR_DEFAUT;
  } catch {
    return THEME_PAR_DEFAUT;
  }
}

export function appliquerTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', COULEUR_BARRE[theme]);
  try {
    window.localStorage.setItem(CLE_THEME, theme);
  } catch {
    // Stockage indisponible (navigation privée stricte) : le thème vaut pour cette visite.
  }
}

/**
 * Change de thème avec un effet de rideau : la nouvelle couleur se déploie de gauche à droite
 * (transition de vue du navigateur, animation `rideau-theme` dans `styles/animations.css`).
 * Sans cette fonction du navigateur, ou si l'utilisateur réduit les animations : changement immédiat.
 * `maj` met l'interface à jour (icône du bouton) au même moment que le thème.
 */
export function changerTheme(theme: Theme, maj: () => void = () => {}) {
  const reduit = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const appliquer = () => {
    appliquerTheme(theme);
    maj();
  };
  if (reduit || typeof document.startViewTransition !== 'function') {
    appliquer();
    return;
  }
  document.startViewTransition(appliquer);
}
