import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { pages } from '../data/pages';
import { AppRoutes } from './routes';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

describe('Routes du site', () => {
  it.each(Object.values(pages))('affiche la page $path avec son titre et sa description', (page) => {
    renderAt(page.path);
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: page.heading })).toBeInTheDocument();
    expect(document.title).toBe(`${page.title} – Baptiste Sandoz`);
    expect(document.head.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      page.description,
    );
  });

  it('chaque page a une adresse unique', () => {
    const paths = Object.values(pages).map((page) => page.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('affiche la page 404 pour une adresse inconnue', () => {
    renderAt('/adresse-inconnue');
    expect(screen.getByRole('heading', { level: 1, name: 'Page introuvable' })).toBeInTheDocument();
    expect(document.title).toBe('Page introuvable – Baptiste Sandoz');
  });

  it("revient à l'accueil depuis la page 404", async () => {
    const user = userEvent.setup();
    renderAt('/adresse-inconnue');
    await user.click(screen.getByRole('link', { name: "Retour à l'accueil" }));
    expect(screen.getByRole('heading', { level: 1, name: pages.accueil.heading })).toBeInTheDocument();
  });

  it('remonte en haut de la page à chaque changement de page', async () => {
    const user = userEvent.setup();
    renderAt('/adresse-inconnue');
    vi.mocked(window.scrollTo).mockClear();
    await user.click(screen.getByRole('link', { name: "Retour à l'accueil" }));
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });
});
