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
  it('propose de demander un devis', () => {
    renderAt(pages.tarifs.path);
    expect(screen.getByRole('complementary', { name: 'Demande de devis' })).toHaveTextContent('Devis gratuit, réponse sous 24 h');
    expect(screen.getByRole('link', { name: 'Demander' })).toHaveAttribute('href', pages.devis.path);
  });

  it.each([pages.devis.path, pages.composer.path, pages.rendezVous.path, pages.monEspace.path, pages.connexion.path])("n'est pas affichée sur %s", (path) => {
    renderAt(path);
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  });
});
