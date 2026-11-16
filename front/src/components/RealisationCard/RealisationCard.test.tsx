import { render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { realisations } from '../../data/realisations';
import { RealisationCard } from './RealisationCard';

const [moto] = realisations;
/** Projet sans captures : la carte montre une illustration provisoire. */
const provisoire = { ...realisations[1], captures: [], emplacements: ['[écran réservation]', '[écran paiement]'] };

function renderCard(ui: ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('RealisationCard', () => {
  it('affiche le métier, le titre, le résumé et un lien explicite', () => {
    renderCard(<RealisationCard realisation={moto} />);
    const article = screen.getByRole('article', { name: moto.titre });
    expect(article).toHaveTextContent(moto.categorie);
    expect(article).toHaveTextContent(moto.resume);
    expect(screen.getByRole('heading', { level: 3, name: moto.titre })).toBeInTheDocument();
    const link = screen.getByRole('link');
    expect(link).toHaveAccessibleName(expect.stringContaining(moto.lien.label));
    expect(link).toHaveAccessibleName(expect.stringContaining(moto.titre));
    expect(link).toHaveAttribute('href', moto.lien.to);
  });

  it('cache l’aperçu provisoire aux lecteurs d’écran', () => {
    const { container } = renderCard(<RealisationCard realisation={provisoire} />);
    const apercu = container.querySelector('[aria-hidden="true"]');
    expect(apercu).toHaveTextContent('[écran réservation]');
    expect(apercu).toHaveTextContent('[écran paiement]');
  });

  it('accepte un titre de niveau 2', () => {
    renderCard(<RealisationCard realisation={moto} headingLevel={2} />);
    expect(screen.getByRole('heading', { level: 2, name: moto.titre })).toBeInTheDocument();
  });
  it('un seul lien par carte : toute la carte est cliquable, mais un seul arrêt au clavier', () => {
    for (const realisation of realisations) {
      const { container, unmount } = render(
        <MemoryRouter>
          <RealisationCard realisation={realisation} />
        </MemoryRouter>,
      );
      expect(container.querySelectorAll('a')).toHaveLength(1);
      expect(realisation.resume.length).toBeLessThanOrEqual(80);
      unmount();
    }
  });
});
