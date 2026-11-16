import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../../app/routes';
import { pages } from '../../data/pages';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

describe('Pages métier', () => {
  beforeEach(() => window.localStorage.clear());

  it.each([
    [pages.artisan, 'Artisans à domicile', 6, 'Atelier Brillance'],
    [pages.ecommerce, 'Commerçants', 6, 'Maison Lumen'],
    [pages.restaurant, 'Restaurants et bars', 5, 'Le Petit Comptoir'],
    [pages.independant, 'Santé et bien-être', 5, 'Studio Équilibre'],
  ])('%s : promesse, fonctions sans prix et exemple de site', (page, publicVise, nbFonctions, exemple) => {
    renderAt(page.path);
    expect(screen.getByRole('heading', { level: 1, name: page.heading })).toBeInTheDocument();
    expect(within(screen.getByRole('main')).getByText(publicVise)).toBeInTheDocument();
    const fonctions = screen.getByRole('region', { name: 'Les fonctions utiles à votre métier' });
    expect(within(fonctions).getAllByRole('heading', { level: 3 })).toHaveLength(nbFonctions);
    // Plus aucun prix : tout est dans le devis.
    expect(fonctions).not.toHaveTextContent('€');
    expect(screen.getByRole('complementary', { name: 'Aperçu de votre futur site' })).toHaveTextContent(exemple);
    expect(screen.getByText(/Entreprise fictive, pour l’exemple/)).toBeInTheDocument();
  });

  it('montre la réalisation proche du métier quand il y en a une', () => {
    renderAt(pages.artisan.path);
    expect(screen.getByRole('article', { name: 'Perfect Clean' })).toBeInTheDocument();
  });

  it('ne montre pas de réalisation quand il n’y en a pas', () => {
    renderAt(pages.restaurant.path);
    expect(screen.queryByText('Un projet proche du vôtre')).not.toBeInTheDocument();
  });

  it('mène à la demande de devis', async () => {
    const user = userEvent.setup();
    renderAt(pages.independant.path);
    await user.click(within(screen.getByRole('main')).getAllByRole('link', { name: 'Demander un devis' })[0]);
    expect(screen.getByRole('heading', { level: 1, name: pages.devis.heading })).toBeInTheDocument();
  });

  it('propose un rendez-vous gratuit', () => {
    renderAt(pages.ecommerce.path);
    for (const lien of screen.getAllByRole('link', { name: 'Prendre rendez-vous (gratuit)' })) {
      expect(lien).toHaveAttribute('href', pages.rendezVous.path);
    }
  });
});
