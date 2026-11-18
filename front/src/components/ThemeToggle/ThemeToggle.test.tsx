import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CLE_THEME, themeEnregistre } from '../../app/theme';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  beforeEach(() => {
    window.localStorage.clear();
    delete document.documentElement.dataset.theme;
    document.head.innerHTML = '<meta name="theme-color" content="#0b0f29" />';
  });

  it('part du thème clair par défaut et propose le thème nuit', () => {
    render(<ThemeToggle />);
    expect(themeEnregistre()).toBe('clair');
    expect(screen.getByRole('button', { name: 'Passer en thème nuit' })).toBeInTheDocument();
  });

  it('bascule en nuit puis en clair, applique le thème et retient le choix', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole('button', { name: 'Passer en thème nuit' }));
    expect(document.documentElement.dataset.theme).toBe('nuit');
    expect(window.localStorage.getItem(CLE_THEME)).toBe('nuit');
    expect(document.querySelector('meta[name="theme-color"]')).toHaveAttribute('content', '#0b0f29');

    await user.click(screen.getByRole('button', { name: 'Passer en thème clair' }));
    expect(document.documentElement.dataset.theme).toBe('clair');
    expect(window.localStorage.getItem(CLE_THEME)).toBe('clair');
  });

  it('reprend le choix gardé dans le navigateur, et ignore une valeur inconnue', () => {
    window.localStorage.setItem(CLE_THEME, 'nuit');
    render(<ThemeToggle />);
    expect(screen.getByRole('button', { name: 'Passer en thème clair' })).toBeInTheDocument();

    window.localStorage.setItem(CLE_THEME, 'violet');
    expect(themeEnregistre()).toBe('clair');
  });

  describe('rideau au changement de thème', () => {
    const installer = (transition: unknown) =>
      Object.defineProperty(document, 'startViewTransition', { value: transition, configurable: true });
    afterEach(() => {
      Reflect.deleteProperty(document, 'startViewTransition');
      vi.unstubAllGlobals();
    });

    it('passe par la transition de vue du navigateur quand elle existe', async () => {
      const user = userEvent.setup();
      const transition = vi.fn((maj: () => void) => maj());
      installer(transition);
      render(<ThemeToggle />);
      await user.click(screen.getByRole('button', { name: 'Passer en thème nuit' }));
      expect(transition).toHaveBeenCalledTimes(1);
      expect(document.documentElement.dataset.theme).toBe('nuit');
      // L'icône change dans la même mise à jour.
      expect(screen.getByRole('button', { name: 'Passer en thème clair' })).toBeInTheDocument();
    });

    it('change tout de suite si l’utilisateur réduit les animations', async () => {
      const user = userEvent.setup();
      const transition = vi.fn((maj: () => void) => maj());
      installer(transition);
      vi.stubGlobal('matchMedia', (requete: string) => ({ matches: requete.includes('reduce') }));
      render(<ThemeToggle />);
      await user.click(screen.getByRole('button', { name: 'Passer en thème nuit' }));
      expect(transition).not.toHaveBeenCalled();
      expect(document.documentElement.dataset.theme).toBe('nuit');
    });
  });
});
