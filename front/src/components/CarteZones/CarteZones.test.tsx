import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CLE_CARTE, listeVilles, villes } from '../../data/zones';
import { CarteZones } from './CarteZones';

// Leaflet ne se dessine pas dans jsdom : on vérifie que la carte est créée et pilotée.
const afficher = vi.fn();
const detruire = vi.fn();
const creerCarte = vi.fn(() => ({ afficher, detruire }));
vi.mock('./carteLeaflet', () => ({ creerCarte: (...args: unknown[]) => creerCarte(...(args as [])) }));

describe('CarteZones', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it('nomme les zones en texte, même sans afficher la carte', () => {
    render(<CarteZones />);
    expect(screen.getByRole('heading', { name: 'Je me déplace chez vous.' })).toBeInTheDocument();
    expect(screen.getByText(/rayon de 50 km autour de Amiens, Abbeville, Arras et Beauvais/)).toBeInTheDocument();
  });

  it('ne charge la carte qu’après accord, puis s’en souvient', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<CarteZones />);
    expect(screen.getByText(/transmet votre adresse IP/)).toBeInTheDocument();
    expect(creerCarte).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Afficher la carte' }));
    await waitFor(() => expect(creerCarte).toHaveBeenCalledTimes(1));
    expect(creerCarte.mock.calls[0]).toEqual([expect.any(HTMLElement), villes]);
    expect(window.localStorage.getItem(CLE_CARTE)).toBe('oui');
    unmount();
    expect(detruire).toHaveBeenCalled();

    // Visite suivante : la carte s'affiche d'elle-même.
    render(<CarteZones />);
    expect(screen.queryByRole('button', { name: 'Afficher la carte' })).not.toBeInTheDocument();
    await waitFor(() => expect(creerCarte).toHaveBeenCalledTimes(2));
  });

  it('affiche une seule ville et zoome dessus, ou toutes les zones', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(CLE_CARTE, 'oui');
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
