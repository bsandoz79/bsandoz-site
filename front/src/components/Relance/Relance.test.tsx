import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { choisir, reinitialiserConsentement } from '../../app/consentement';
import { pages } from '../../data/pages';
import { relance } from '../../data/relance';
import { CLE_RELANCE, Relance } from './Relance';

function afficher(chemin = '/') {
  return render(
    <MemoryRouter initialEntries={[chemin]}>
      <Relance />
    </MemoryRouter>,
  );
}

const carte = () => screen.queryByRole('complementary', { name: relance.titre });
const attendre = (ms: number) => act(() => { vi.advanceTimersByTime(ms); });

describe('Relance « Avant de partir »', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.localStorage.clear();
    reinitialiserConsentement();
    // Bandeau des cookies déjà fermé : la carte peut s'ouvrir.
    choisir('refuse');
  });
  afterEach(() => vi.useRealTimers());

  it('s’ouvre après 30 secondes, pas avant', () => {
    afficher();
    attendre(relance.delaiMs - 1000);
    expect(carte()).not.toBeInTheDocument();
    attendre(1000);
    expect(carte()).toBeInTheDocument();
  });

  it('propose la maquette gratuite (formulaire pré-réglé) et l’appel', () => {
    afficher();
    attendre(relance.delaiMs);
    expect(screen.getByRole('link', { name: relance.maquette.label })).toHaveAttribute('href', `${pages.devis.path}?demande=maquette`);
    expect(screen.getByRole('link', { name: /Appeler le 07 69 28 78 37/ })).toHaveAttribute('href', 'tel:0769287837');
  });

  it('se ferme avec la croix ou Échap, et ne revient pas pendant 30 jours', () => {
    const { unmount } = afficher();
    attendre(relance.delaiMs);
    fireEvent.click(screen.getByRole('button', { name: relance.fermer }));
    expect(carte()).not.toBeInTheDocument();
    expect(window.localStorage.getItem(CLE_RELANCE)).not.toBeNull();
    unmount();

    // Nouvelle visite : rien.
    afficher();
    attendre(relance.delaiMs * 2);
    expect(carte()).not.toBeInTheDocument();
  });

  it('Échap la ferme', () => {
    afficher();
    attendre(relance.delaiMs);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(carte()).not.toBeInTheDocument();
  });

  it('ne s’ouvre pas sur la page de devis ni dans l’espace client', () => {
    afficher(pages.devis.path);
    attendre(relance.delaiMs);
    expect(carte()).not.toBeInTheDocument();
  });

  it('attend que le bandeau des cookies soit fermé', () => {
    window.localStorage.clear();
    reinitialiserConsentement();
    afficher();
    attendre(relance.delaiMs);
    expect(carte()).not.toBeInTheDocument();
    act(() => choisir('accepte'));
    expect(carte()).toBeInTheDocument();
  });
});
