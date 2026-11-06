import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { choisir, reinitialiserConsentement } from '../../app/consentement';
import { listeVilles, villes } from '../../data/zones';
import { CarteZones } from './CarteZones';

// Leaflet ne se dessine pas dans jsdom : on vérifie que la carte est créée et pilotée.
const afficher = vi.fn();
const detruire = vi.fn();
const creerCarte = vi.fn(() => ({ afficher, detruire }));
vi.mock('./carteLeaflet', () => ({ creerCarte: (...args: unknown[]) => creerCarte(...(args as [])) }));

/** Observateur simulé : on décide quand la carte arrive à l'écran. */
let signaler: ((visible: boolean) => void) | null = null;
class FauxObservateur {
  constructor(rappel: (entrees: Partial<IntersectionObserverEntry>[]) => void) {
    signaler = (visible) => rappel([{ isIntersecting: visible }]);
  }
  observe() {}
  disconnect() {}
}

describe('CarteZones', () => {
  beforeEach(() => {
    window.localStorage.clear();
    reinitialiserConsentement();
    vi.clearAllMocks();
    signaler = null;
  });
  afterEach(() => vi.unstubAllGlobals());

  it('nomme les zones en texte, même sans afficher la carte', () => {
    render(<CarteZones />);
    expect(screen.getByRole('heading', { name: 'Je me déplace chez vous.' })).toBeInTheDocument();
    expect(screen.getByText(/rayon de 50 km autour de Amiens, Abbeville, Arras et Beauvais/)).toBeInTheDocument();
  });

  it('se charge d’elle-même quand on approche en défilant, sans clic', async () => {
    vi.stubGlobal('IntersectionObserver', FauxObservateur);
    const { unmount } = render(<CarteZones />);
    expect(screen.queryByRole('button', { name: /Afficher la carte/ })).not.toBeInTheDocument();
    await new Promise((r) => setTimeout(r, 0));
    expect(creerCarte).not.toHaveBeenCalled();

    act(() => signaler!(true));
    await waitFor(() => expect(creerCarte).toHaveBeenCalledTimes(1));
    expect(creerCarte.mock.calls[0]).toEqual([expect.any(HTMLElement), villes]);
    unmount();
    expect(detruire).toHaveBeenCalled();
  });

  it('ne se charge pas si les services tiers sont refusés, sauf demande depuis la carte', async () => {
    const user = userEvent.setup();
    act(() => choisir('refuse'));
    render(<CarteZones />);
    expect(screen.getByText(/refusé les services tiers/)).toBeInTheDocument();
    await new Promise((r) => setTimeout(r, 0));
    expect(creerCarte).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Afficher la carte quand même' }));
    await waitFor(() => expect(creerCarte).toHaveBeenCalledTimes(1));
  });

  it('affiche une seule ville et zoome dessus, ou toutes les zones', async () => {
    const user = userEvent.setup();
    render(<CarteZones />);
    await waitFor(() => expect(creerCarte).toHaveBeenCalled());

    await user.click(screen.getByRole('radio', { name: 'Amiens' }));
    expect(afficher).toHaveBeenLastCalledWith('amiens');
    expect(screen.getByRole('img', { name: 'Carte des zones d’intervention : Amiens' })).toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: 'Toutes' }));
    expect(afficher).toHaveBeenLastCalledWith(null);
    expect(screen.getByRole('img', { name: `Carte des zones d’intervention : ${listeVilles(villes.map((v) => v.nom))}` })).toBeInTheDocument();
  });

  it('écrit la liste des villes en français', () => {
    expect(listeVilles(['Amiens'])).toBe('Amiens');
    expect(listeVilles(['Amiens', 'Arras'])).toBe('Amiens et Arras');
    expect(listeVilles(['Amiens', 'Abbeville', 'Arras'])).toBe('Amiens, Abbeville et Arras');
  });
});
