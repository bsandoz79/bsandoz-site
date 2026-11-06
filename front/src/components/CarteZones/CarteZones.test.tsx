import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { choisir, reinitialiserConsentement } from '../../app/consentement';
import {
  COUT_KM,
  aDistance,
  carteTextes,
  deVille,
  detailCalcul,
  formatFrais,
  fraisKilometriques,
  kmFactures,
  listeVilles,
  origineCoutKm,
  situer,
  villes,
  zoneSansFrais,
} from '../../data/zones';
import { CarteZones } from './CarteZones';

// Leaflet ne se dessine pas dans jsdom : on vérifie que la carte est créée et pilotée.
const afficher = vi.fn();
const detruire = vi.fn();
const placerPosition = vi.fn();
const creerCarte = vi.fn(() => ({ afficher, detruire, placerPosition }));
vi.mock('./carteLeaflet', () => ({ creerCarte: (...args: unknown[]) => creerCarte(...(args as [])) }));

/** Observateurs simulés : on décide quand la carte approche (marge) puis apparaît vraiment (seuil). */
type Rappel = (entrees: Partial<IntersectionObserverEntry>[]) => void;
let observateurs: { rappel: Rappel; options?: IntersectionObserverInit }[] = [];
class FauxObservateur {
  constructor(rappel: Rappel, options?: IntersectionObserverInit) {
    observateurs.push({ rappel, options });
  }
  observe() {}
  disconnect() {}
}
const approcher = () => observateurs.filter((o) => o.options?.rootMargin).forEach((o) => o.rappel([{ isIntersecting: true }]));
const apparaitre = () => observateurs.filter((o) => o.options?.threshold).forEach((o) => o.rappel([{ isIntersecting: true }]));
const signaler = () => {
  approcher();
};

/** Géolocalisation simulée : chaque demande attend qu'on y réponde. */
type Reponse = { succes?: (p: { coords: { latitude: number; longitude: number } }) => void; echec?: (e: { code: number; PERMISSION_DENIED: number }) => void };
let demandes: Reponse[] = [];
const geolocalisation = {
  getCurrentPosition: vi.fn((succes: Reponse['succes'], echec: Reponse['echec']) => {
    demandes.push({ succes, echec });
  }),
};
const repondre = (lat: number, lng: number) => act(() => demandes.at(-1)!.succes!({ coords: { latitude: lat, longitude: lng } }));
const refuser = () => act(() => demandes.at(-1)!.echec!({ code: 1, PERMISSION_DENIED: 1 }));

describe('CarteZones', () => {
  beforeEach(() => {
    window.localStorage.clear();
    reinitialiserConsentement();
    vi.clearAllMocks();
    observateurs = [];
    demandes = [];
    Object.defineProperty(navigator, 'geolocation', { value: geolocalisation, configurable: true });
  });
  afterEach(() => vi.unstubAllGlobals());

  it('nomme les zones en texte, même sans afficher la carte', () => {
    render(<CarteZones />);
    expect(screen.getByRole('heading', { name: 'Je me déplace chez vous.' })).toBeInTheDocument();
    expect(screen.getByText(/Sans frais dans un rayon de 50 km autour d’Amiens et d’Abbeville/)).toBeInTheDocument();
    expect(villes.map((v) => v.nom)).toEqual(['Amiens', 'Abbeville']);
  });

  it('se charge d’elle-même quand on approche en défilant, sans clic', async () => {
    vi.stubGlobal('IntersectionObserver', FauxObservateur);
    const { unmount } = render(<CarteZones />);
    expect(screen.queryByRole('button', { name: /Afficher la carte/ })).not.toBeInTheDocument();
    await new Promise((r) => setTimeout(r, 0));
    expect(creerCarte).not.toHaveBeenCalled();

    act(() => signaler());
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

  it('dit « d’Amiens » mais « de Beauvais », et trouve la base la plus proche', () => {
    expect(deVille('Amiens')).toBe('d’Amiens');
    expect(deVille('Arras')).toBe('d’Arras');
    expect(deVille('Beauvais')).toBe('de Beauvais');
    expect(aDistance(0, 'Amiens')).toBe('à moins d’1 km d’Amiens');
    // Gare de Corbie, à une quinzaine de kilomètres d'Amiens.
    expect(situer(49.9085, 2.5097)).toMatchObject({ ville: { id: 'amiens' }, dansZone: true });
    // Paris : hors zone, Amiens est la plus proche (environ 115 km).
    const paris = situer(48.8566, 2.3522);
    expect(paris).toMatchObject({ ville: { id: 'amiens' }, dansZone: false });
    expect(paris.km).toBeGreaterThan(100);
  });

  it('frais kilométriques : km au-delà de 50, aller-retour, à 2,50 €/L et 7,5 L/100 km', () => {
    expect(COUT_KM).toBe(0.1875);
    expect(kmFactures(40)).toBe(0);
    expect(fraisKilometriques(50)).toBe(0);
    // Aller-retour : 100 km de distance → 50 km en plus, comptés deux fois → 100 km facturés.
    expect(kmFactures(100)).toBe(100);
    expect(fraisKilometriques(100)).toBe(18.75);
    expect(formatFrais(9.38)).toMatch(/^9,38\s€$/);
    expect(zoneSansFrais()).toBe('d’Amiens et d’Abbeville');
    expect(detailCalcul(100).replace(/\s/g, ' ')).toBe('100 km aller-retour × 0,1875 € = 18,75 €');
    expect(origineCoutKm().replace(/\s/g, ' ')).toBe('2,50 € le litre × 7,5 L aux 100 km');
  });

  describe('position du visiteur', () => {
    beforeEach(() => vi.stubGlobal('IntersectionObserver', FauxObservateur));

    it('n’est demandée que quand la carte apparaît à l’écran, puis place un point dans la zone', async () => {
      render(<CarteZones />);
      act(() => approcher());
      await waitFor(() => expect(creerCarte).toHaveBeenCalled());
      expect(geolocalisation.getCurrentPosition).not.toHaveBeenCalled();

      act(() => apparaitre());
      expect(geolocalisation.getCurrentPosition).toHaveBeenCalledTimes(1);
      expect(screen.getByText(carteTextes.position.enCours)).toBeInTheDocument();

      repondre(49.9085, 2.5097);
      expect(screen.getByText(/Vous êtes dans ma zone, à \d+ km d’Amiens : je viens chez vous sans frais/)).toBeInTheDocument();
      expect(screen.queryByText(/^Calcul : /)).not.toBeInTheDocument();
      await waitFor(() => expect(placerPosition).toHaveBeenCalledWith(49.9085, 2.5097, 'amiens'));
      expect(screen.queryByRole('button', { name: carteTextes.position.bouton })).not.toBeInTheDocument();
    });

    it('hors zone : message rassurant sur les frais kilométriques', () => {
      render(<CarteZones />);
      act(() => apparaitre());
      repondre(48.8566, 2.3522);
      const { km } = situer(48.8566, 2.3522);
      const texte = screen.getByText(/au-delà de ma zone/);
      expect(texte.textContent!.replace(/\s/g, ' ')).toContain(`${formatFrais(fraisKilometriques(km)).replace(/\s/g, ' ')} d’essence`);
      expect(texte).toHaveTextContent('dus même si le projet ne se fait pas');
      // Le calcul, en petit, juste dessous.
      expect(screen.getByText(/^Calcul : /).textContent).toBe(`Calcul : ${detailCalcul(km)} (${origineCoutKm()})`);
    });

    it('refusée : la carte reste normale, un bouton discret permet de réessayer', async () => {
      const user = userEvent.setup();
      render(<CarteZones />);
      act(() => apparaitre());
      refuser();
      expect(placerPosition).not.toHaveBeenCalled();
      expect(screen.queryByText(carteTextes.position.bloquee)).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: carteTextes.position.bouton }));
      expect(geolocalisation.getCurrentPosition).toHaveBeenCalledTimes(2);
      // Toujours refusée : le navigateur la bloque, on explique comment la réautoriser.
      refuser();
      expect(screen.getByText(carteTextes.position.bloquee)).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: carteTextes.position.bouton }));
      repondre(49.8941, 2.2958);
      expect(screen.getByText(/Vous êtes dans ma zone, à moins d’1 km d’Amiens/)).toBeInTheDocument();
    });

    it('sans géolocalisation dans le navigateur : pas de bouton inutile', async () => {
      const user = userEvent.setup();
      Object.defineProperty(navigator, 'geolocation', { value: undefined, configurable: true });
      // @ts-expect-error retrait de la propriété pour simuler un navigateur sans géolocalisation
      delete navigator.geolocation;
      render(<CarteZones />);
      await user.click(screen.getByRole('button', { name: carteTextes.position.bouton }));
      expect(screen.queryByRole('button', { name: carteTextes.position.bouton })).not.toBeInTheDocument();
    });
  });
});
