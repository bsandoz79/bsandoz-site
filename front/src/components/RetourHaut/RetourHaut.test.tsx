import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { retourHaut } from '../../data/navigation';
import { pages } from '../../data/pages';
import { RetourHaut } from './RetourHaut';

function renderBouton(chemin = '/') {
  return render(
    <MemoryRouter initialEntries={[chemin]}>
      <RetourHaut />
    </MemoryRouter>,
  );
}

function defiler(y: number) {
  act(() => {
    Object.defineProperty(window, 'scrollY', { value: y, configurable: true });
    fireEvent.scroll(window);
  });
}

// Caché (aria-hidden), le bouton n'a plus de nom accessible : on le prend directement dans le document.
const bouton = () => document.querySelector('button') as HTMLButtonElement;

describe('RetourHaut', () => {
  afterEach(() => defiler(0));

  it('reste caché et hors du parcours clavier tant que la page est en haut', () => {
    renderBouton();
    expect(bouton()).toHaveAttribute('aria-hidden', 'true');
    expect(bouton()).toHaveAttribute('tabindex', '-1');
    expect(screen.queryByRole('button', { name: retourHaut.label })).not.toBeInTheDocument();
  });

  it('apparaît une fois la page descendue, et disparaît en remontant', () => {
    renderBouton();
    defiler(retourHaut.seuil + 1);
    expect(screen.getByRole('button', { name: retourHaut.label })).toHaveAttribute('tabindex', '0');
    defiler(10);
    expect(bouton()).toHaveAttribute('aria-hidden', 'true');
  });

  it('ramène en haut de la page au clic, en douceur', async () => {
    const user = userEvent.setup();
    renderBouton();
    defiler(2000);
    vi.mocked(window.scrollTo).mockClear();
    await user.click(screen.getByRole('button', { name: retourHaut.label }));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('se place au-dessus de la barre mobile seulement là où elle est affichée', () => {
    const { unmount } = renderBouton('/');
    const classeAccueil = bouton().className;
    unmount();
    renderBouton(pages.composer.path);
    expect(bouton().className).not.toBe(classeAccueil);
    expect(classeAccueil).toMatch(/auDessusBarre/);
    expect(bouton().className).not.toMatch(/auDessusBarre/);
  });
});
