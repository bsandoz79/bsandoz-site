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
  it('mentions légales : éditeur avec adresse et téléphone, SIRET en cours, hébergeur', () => {
    renderAt(pages.mentionsLegales.path);
    expect(screen.getByRole('heading', { level: 1, name: pages.mentionsLegales.heading })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Éditeur du site' })).toHaveTextContent('SIRET : en cours d’immatriculation');
    expect(screen.getByRole('region', { name: 'Éditeur du site' })).toHaveTextContent('319 rue de Rouen, 80000 Amiens');
    expect(screen.getByRole('region', { name: 'Éditeur du site' })).toHaveTextContent('07 69 28 78 37');
    expect(screen.getByRole('region', { name: 'Hébergeur' })).toHaveTextContent('o2switch');
    expect(screen.getByRole('region', { name: 'Hébergeur' })).toHaveTextContent('chemin des Pardiaux, 63000 Clermont-Ferrand');
    expect(screen.getByRole('region', { name: 'Hébergeur' })).not.toHaveTextContent('à compléter');
  });

  it('CGV : prix nets, paiement, tarif horaire, délais tirés des données', () => {
    renderAt(pages.cgv.path);
    expect(screen.getByRole('region', { name: 'Prix' })).toHaveTextContent('TVA non applicable (art. 293 B du CGI)');
    expect(screen.getByRole('region', { name: 'Paiement' })).toHaveTextContent('le solde à la mise en ligne');
    expect(screen.getByRole('region', { name: 'Après la mise en ligne' })).toHaveTextContent('29 € de l’heure');
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
