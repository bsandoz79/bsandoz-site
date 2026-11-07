import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../../app/routes';
import { pages } from '../../data/pages';

function renderInformatique() {
  return render(
    <MemoryRouter initialEntries={[pages.informatique.path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

describe('Page Informatique sur place', () => {
  beforeEach(() => window.localStorage.clear());

  it('présente la promesse et le contexte de Windows 10, avec l’onglet actif', () => {
    renderInformatique();
    expect(screen.getByRole('heading', { level: 1, name: pages.informatique.heading })).toBeInTheDocument();
    expect(screen.getByText(/Windows 10 n'est plus mis à jour depuis octobre 2025/)).toBeInTheDocument();
    const onglets = within(screen.getByRole('navigation', { name: 'Catégories de services' }));
    expect(onglets.getByRole('link', { name: 'Informatique sur place' })).toHaveAttribute('aria-current', 'true');
  });

  it('liste les prestations, sans prix, avec le réseau bientôt disponible', () => {
    renderInformatique();
    const services = screen.getByRole('region', { name: 'Ce que je fais chez vous' });
    expect(within(services).getAllByRole('heading', { level: 3 })).toHaveLength(8);
    const reseau = within(services).getByRole('heading', { name: 'Réseau et NAS' }).parentElement;
    expect(reseau).toHaveTextContent('Bientôt disponible');
    expect(services).not.toHaveTextContent('€');
  });

  it('annonce un tarif sur devis et le déroulement en trois étapes', () => {
    renderInformatique();
    expect(screen.getByRole('complementary', { name: 'Tarif sur devis' })).toHaveTextContent(
      "Je me déplace sans frais dans un rayon de 50 km autour d'Amiens et d'Abbeville ; plus loin, seuls les kilomètres en plus sont facturés.",
    );
    expect(within(screen.getByRole('region', { name: 'Comment ça se passe' })).getAllByRole('listitem')).toHaveLength(3);
  });

  it('« Décrire mon besoin » mène à la demande de devis', async () => {
    const user = userEvent.setup();
    renderInformatique();
    await user.click(screen.getAllByRole('link', { name: 'Décrire mon besoin' })[0]);
    expect(screen.getByRole('heading', { level: 1, name: pages.devis.heading })).toBeInTheDocument();
  });

  it('propose un rendez-vous gratuit', () => {
    renderInformatique();
    expect(screen.getByRole('link', { name: 'Prendre rendez-vous (gratuit)' })).toHaveAttribute(
      'href',
      pages.rendezVous.path,
    );
  });
});
