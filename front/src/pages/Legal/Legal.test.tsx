import { render, screen } from '@testing-library/react';
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

describe('Pages légales', () => {
  it('mentions légales : éditeur, hébergeur, SIRET à compléter', () => {
    renderAt(pages.mentionsLegales.path);
    expect(screen.getByRole('heading', { level: 1, name: pages.mentionsLegales.heading })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Éditeur du site' })).toHaveTextContent('[numéro SIRET à compléter]');
    expect(screen.getByRole('region', { name: 'Hébergeur' })).toHaveTextContent('o2switch');
  });

  it('CGV : prix nets, paiement, tarif horaire, délais tirés des données', () => {
    renderAt(pages.cgv.path);
    expect(screen.getByRole('region', { name: 'Prix' })).toHaveTextContent('TVA non applicable (art. 293 B du CGI)');
    expect(screen.getByRole('region', { name: 'Paiement' })).toHaveTextContent('le solde à la mise en ligne');
    expect(screen.getByRole('region', { name: 'Après la mise en ligne' })).toHaveTextContent('50 € de l’heure');
    expect(screen.getByRole('region', { name: 'Délais' })).toHaveTextContent('3 jours pour une Vitrine');
  });

  it('confidentialité : données collectées, stockage local, polices hébergées sur le site, droits', () => {
    renderAt(pages.confidentialite.path);
    expect(screen.getByRole('region', { name: 'Données collectées' })).toHaveTextContent('demande de devis');
    expect(screen.getByRole('region', { name: 'Données gardées dans votre navigateur' })).toHaveTextContent(
      'restent sur votre appareil',
    );
    expect(screen.getByRole('region', { name: 'Cookies et services tiers' })).toHaveTextContent('hébergées avec le site');
    expect(screen.getByRole('region', { name: 'Vos droits' })).toHaveTextContent('contact@bsandoz.fr');
  });

  it('le formulaire de devis mène à la politique de confidentialité', () => {
    expect(pages.confidentialite.path).toBe('/confidentialite');
  });
});
