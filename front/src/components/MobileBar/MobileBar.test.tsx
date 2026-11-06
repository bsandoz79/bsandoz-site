import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { pages } from '../../data/pages';
import { MobileBar } from './MobileBar';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <MobileBar />
    </MemoryRouter>,
  );
}

describe('MobileBar', () => {
  it('propose « Estimer », qui mène au configurateur', () => {
    renderAt(pages.tarifs.path);
    expect(screen.getByRole('complementary', { name: 'Estimation rapide' })).toHaveTextContent(
      'Devis gratuit en 2 min',
    );
    expect(screen.getByRole('link', { name: 'Estimer' })).toHaveAttribute('href', pages.composer.path);
  });

  it.each([pages.composer.path, pages.devis.path, pages.rendezVous.path, pages.monEspace.path, pages.connexion.path])("n'est pas affichée sur %s", (path) => {
    renderAt(path);
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  });
});
