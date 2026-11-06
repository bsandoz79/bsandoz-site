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

  it('part du thème nuit par défaut et propose le thème clair', () => {
    render(<ThemeToggle />);
    expect(themeEnregistre()).toBe('nuit');
    expect(screen.getByRole('button', { name: 'Passer en thème clair' })).toBeInTheDocument();
  });

  it('bascule en clair puis en nuit, applique le thème et retient le choix', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole('button', { name: 'Passer en thème clair' }));
    expect(document.documentElement.dataset.theme).toBe('clair');
    expect(window.localStorage.getItem(CLE_THEME)).toBe('clair');
    expect(document.querySelector('meta[name="theme-color"]')).toHaveAttribute('content', '#f7f6fa');

    await user.click(screen.getByRole('button', { name: 'Passer en thème nuit' }));
    expect(document.documentElement.dataset.theme).toBe('nuit');
    expect(window.localStorage.getItem(CLE_THEME)).toBe('nuit');
  });

  it('reprend le choix gardé dans le navigateur, et ignore une valeur inconnue', () => {
    window.localStorage.setItem(CLE_THEME, 'clair');
    render(<ThemeToggle />);
    expect(screen.getByRole('button', { name: 'Passer en thème nuit' })).toBeInTheDocument();

    window.localStorage.setItem(CLE_THEME, 'violet');
    expect(themeEnregistre()).toBe('nuit');
  });
});
