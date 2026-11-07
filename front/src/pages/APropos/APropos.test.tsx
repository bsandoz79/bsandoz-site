import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../../app/routes';
import { pages } from '../../data/pages';

function renderAPropos() {
  return render(
    <MemoryRouter initialEntries={[pages.aPropos.path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

describe('Page À propos', () => {
  it('présente Baptiste, avec sa photo, son parcours et le lien du portfolio', () => {
    renderAPropos();
    expect(screen.getByRole('heading', { level: 1, name: pages.aPropos.heading })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Baptiste Sandoz, développeur web à Amiens' })).toBeInTheDocument();
    expect(screen.getByText(/BTS SIO option SLAM/)).toBeInTheDocument();
    expect(screen.getByText(/Devisse Informatique/)).toBeInTheDocument();
    expect(screen.getByText(/trois saisons en snack-bar et huit mois chez McDonald’s/)).toBeInTheDocument();
    expect(document.body).not.toHaveTextContent('à compléter');
    expect(screen.getByRole('link', { name: /mes compétences sur mon portfolio/ })).toHaveAttribute(
      'href',
      'https://portfolio.bsandoz.fr',
    );
  });

  it('reprend les quatre valeurs du cahier des charges', () => {
    renderAPropos();
    const valeurs = screen.getByRole('region', { name: 'Ce qui compte pour moi' });
    expect(within(valeurs).getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'Un seul interlocuteur',
      'Un devis clair',
      'Votre site vous appartient',
      'Vous restez autonome',
    ]);
  });

  it('précise la zone d’intervention et propose un rendez-vous', () => {
    renderAPropos();
    expect(screen.getByRole('region', { name: 'Où j’interviens' })).toHaveTextContent('rayon de 50 km autour d’Amiens');
    const appel = screen.getByRole('complementary', { name: 'On en parle ?' });
    expect(within(appel).getByRole('link', { name: 'Prendre rendez-vous (gratuit)' })).toHaveAttribute(
      'href',
      pages.rendezVous.path,
    );
    expect(within(appel).getByRole('link', { name: 'Décrire mon projet' })).toHaveAttribute('href', pages.devis.path);
  });
});
