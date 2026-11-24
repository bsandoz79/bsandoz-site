import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { choisir, reinitialiserConsentement } from '../../app/consentement';
import { pages } from '../../data/pages';
import { relanceDevis } from '../../data/relance';
import { CLE_RELANCE_DEVIS, RelanceDevis } from './RelanceDevis';

function afficher(chemin = '/') {
  return render(
    <MemoryRouter initialEntries={[chemin]}>
      <RelanceDevis />
    </MemoryRouter>,
  );
}

const fenetre = () => screen.queryByRole('dialog', { name: relanceDevis.titre });
const attendre = (ms: number) => act(() => { vi.advanceTimersByTime(ms); });

describe('Fenêtre « Toujours là ? »', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.localStorage.clear();
    reinitialiserConsentement();
    choisir('refuse');
  });
  afterEach(() => vi.useRealTimers());

  it('s’ouvre au milieu de l’écran après 30 minutes, pas avant', () => {
    afficher();
    attendre(relanceDevis.delaiMs - 1000);
    expect(fenetre()).not.toBeInTheDocument();
    attendre(1000);
    expect(fenetre()).toBeInTheDocument();
    expect(fenetre()).toHaveAttribute('aria-modal', 'true');
  });

  it('mène à la demande de devis et prend le focus', () => {
    afficher();
    attendre(relanceDevis.delaiMs);
    const lien = screen.getByRole('link', { name: relanceDevis.devis.label });
    expect(lien).toHaveAttribute('href', pages.devis.path);
    expect(lien).toHaveFocus();
  });

  it('se ferme avec « Plus tard » et ne revient pas pendant 30 jours', () => {
    const { unmount } = afficher();
    attendre(relanceDevis.delaiMs);
    fireEvent.click(screen.getByRole('button', { name: relanceDevis.plusTard }));
    expect(fenetre()).not.toBeInTheDocument();
    expect(window.localStorage.getItem(CLE_RELANCE_DEVIS)).not.toBeNull();
    unmount();

    afficher();
    attendre(relanceDevis.delaiMs * 2);
    expect(fenetre()).not.toBeInTheDocument();
  });

  it('un clic sur le fond la ferme, un clic dans la fenêtre non', () => {
    afficher();
    attendre(relanceDevis.delaiMs);
    fireEvent.click(screen.getByText(relanceDevis.texte));
    expect(fenetre()).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('relance-devis-fond'));
    expect(fenetre()).not.toBeInTheDocument();
  });

  it('Échap la ferme', () => {
    afficher();
    attendre(relanceDevis.delaiMs);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(fenetre()).not.toBeInTheDocument();
  });

  it('ne s’ouvre pas sur la page de devis', () => {
    afficher(pages.devis.path);
    attendre(relanceDevis.delaiMs);
    expect(fenetre()).not.toBeInTheDocument();
  });
});
