import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../../app/routes';
import { pages } from '../../data/pages';
import { realisations } from '../../data/realisations';

function renderRealisations() {
  return render(
    <MemoryRouter initialEntries={[pages.realisations.path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

describe('Page Réalisations', () => {
  it('présente une étude de cas par réalisation', () => {
    renderRealisations();
    expect(screen.getByRole('heading', { level: 1, name: pages.realisations.heading })).toBeInTheDocument();
    for (const realisation of realisations) {
      const cas = screen.getByRole('article', { name: realisation.titre });
      expect(cas).toHaveAttribute('id', realisation.id);
      expect(cas).toHaveTextContent(realisation.resume);
      expect(within(cas).getByText('Le besoin')).toBeInTheDocument();
      expect(within(cas).getByText('La solution')).toBeInTheDocument();
    }
  });

  it('laisse des emplacements à compléter plutôt que d’inventer', () => {
    renderRealisations();
    const moto = screen.getByRole('article', { name: 'Christophe Poix Moto' });
    expect(within(moto).getAllByText('[à compléter]')).toHaveLength(2);
    expect(moto).toHaveTextContent('[capture du site]');
  });

  it('chaque lien de carte pointe vers son étude de cas', () => {
    for (const realisation of realisations) {
      expect(realisation.lien.to).toBe(`${pages.realisations.path}#${realisation.id}`);
    }
  });

  it('propose de composer un projet', () => {
    renderRealisations();
    expect(screen.getByRole('link', { name: 'Composer mon site' })).toHaveAttribute('href', pages.composer.path);
  });
});
