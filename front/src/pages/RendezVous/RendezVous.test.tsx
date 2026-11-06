import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../../app/routes';
import { pages } from '../../data/pages';

const geocodage = (lon: number, lat: number, ville: string) => ({
  ok: true,
  status: 200,
  json: async () => ({
    features: [{ geometry: { coordinates: [lon, lat] }, properties: { city: ville, label: `1 rue X ${ville}`, score: 0.9 } }],
  }),
});

/** Simule le géocodage (data.geopf.fr) et l'API (/rendez-vous). */
function simulerReseau({ api = { ok: true, status: 201 }, lieu = geocodage(1.8336, 50.1054, 'Abbeville') } = {}) {
  const fetchMock = vi.fn(async (url: string) =>
    String(url).includes('geocodage') ? lieu : { ...api, json: async () => ({}) },
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function renderRdv() {
  return render(
    <MemoryRouter initialEntries={[pages.rendezVous.path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

const resume = () => screen.getByRole('complementary', { name: 'Votre rendez-vous' });
const confirmer = () => within(resume()).getByRole('button', { name: 'Confirmer le rendez-vous' });

async function remplirCoordonnees(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByRole('textbox', { name: /Prénom et nom/ }), 'Marie Dupont');
  await user.type(screen.getByRole('textbox', { name: /Téléphone/ }), '06 12 34 56 78');
  await user.type(screen.getByRole('textbox', { name: /E-mail/ }), 'marie@exemple.fr');
  await user.click(screen.getByRole('checkbox', { name: /J'accepte/ }));
}

describe('Page Rendez-vous', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 10, 5, 10, 0)); // jeudi 5 novembre 2026
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('propose de décrire le projet en ligne ou d’en parler de vive voix', () => {
    simulerReseau();
    renderRdv();
    expect(screen.getByRole('heading', { level: 1, name: pages.rendezVous.heading })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Je le décris en ligne/ })).toHaveAttribute('href', pages.devis.path);
    expect(screen.getByRole('radio', { name: /Chez vous/ })).toBeChecked();
  });

  it('vérifie l’adresse et accepte un déplacement dans les 50 km', async () => {
    const user = userEvent.setup();
    simulerReseau();
    renderRdv();
    await user.type(screen.getByRole('textbox', { name: /Adresse du rendez-vous/ }), '12 rue de la Gare, Abbeville');
    await user.tab();
    expect(await screen.findByText(/Abbeville, environ 41 km d'Amiens : je me déplace gratuitement\./)).toBeInTheDocument();
    expect(resume()).toHaveTextContent('Chez vous, Abbeville');
  });

  it('refuse un déplacement au-delà de 50 km et propose la visio', async () => {
    const user = userEvent.setup();
    simulerReseau({ lieu: geocodage(3.0573, 50.6292, 'Lille') });
    renderRdv();
    await user.type(screen.getByRole('textbox', { name: /Adresse du rendez-vous/ }), 'Grand-Place, Lille');
    await user.tab();
    expect(await screen.findByText(/Lille, environ \d+ km d'Amiens : c'est au-delà de 50 km/)).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: /En visio/ }));
    expect(screen.queryByRole('textbox', { name: /Adresse du rendez-vous/ })).not.toBeInTheDocument();
  });

  it('ne propose que les jours ouvrés à venir, puis les créneaux du jour choisi', async () => {
    const user = userEvent.setup();
    simulerReseau();
    renderRdv();
    expect(screen.getByRole('button', { name: /^jeudi 5 novembre 2026, indisponible$/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^samedi 7 novembre 2026, indisponible$/ })).toBeInTheDocument();
    expect(screen.getByText('Choisissez un jour pour voir les créneaux.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^mardi 17 novembre 2026$/ }));
    const creneaux = screen.getByRole('group', { name: /Créneaux du mardi 17 novembre 2026/ });
    expect(within(creneaux).getAllByRole('radio')).toHaveLength(5);
    await user.click(within(creneaux).getByRole('radio', { name: '14:00 – 15:00' }));
    expect(resume()).toHaveTextContent('mardi 17 novembre 2026');
    expect(resume()).toHaveTextContent('14:00 – 15:00');
  });

  it('explique ce qui manque avant de confirmer', async () => {
    const user = userEvent.setup();
    const fetchMock = simulerReseau();
    renderRdv();
    await user.click(confirmer());
    expect(screen.getByRole('alert')).toHaveTextContent('6 champs sont à corriger.');
    expect((fetchMock.mock.calls as unknown as [string, RequestInit?][]).filter(([, options]) => options?.method === 'POST')).toEqual([]);
  });

  it('confirme un rendez-vous en visio et l’envoie à l’API', async () => {
    const user = userEvent.setup();
    const fetchMock = simulerReseau();
    renderRdv();
    await user.click(screen.getByRole('radio', { name: /En visio/ }));
    await user.click(screen.getByRole('button', { name: /^mardi 17 novembre 2026$/ }));
    await user.click(screen.getByRole('radio', { name: '10:30 – 11:30' }));
    await remplirCoordonnees(user);
    await user.click(confirmer());

    expect(await screen.findByRole('heading', { level: 1, name: 'Votre rendez-vous est demandé !' })).toBeInTheDocument();
    const [url, options] = fetchMock.mock.calls.at(-1) as unknown as [string, RequestInit];
    expect(url).toBe('https://api.bsandoz.fr/rendez-vous');
    expect(JSON.parse(String(options.body))).toMatchObject({
      lieu: 'visio',
      adresse: null,
      jour: '2026-11-17',
      creneau: '10:30',
      email: 'marie@exemple.fr',
    });
  });

  it('demande un autre créneau s’il vient d’être pris', async () => {
    const user = userEvent.setup();
    simulerReseau({ api: { ok: false, status: 409 } });
    renderRdv();
    await user.click(screen.getByRole('radio', { name: /Par téléphone/ }));
    await user.click(screen.getByRole('button', { name: /^mardi 17 novembre 2026$/ }));
    await user.click(screen.getByRole('radio', { name: '09:00 – 10:00' }));
    await remplirCoordonnees(user);
    await user.click(confirmer());
    expect(await screen.findByText('Ce créneau vient d’être pris : choisissez-en un autre.')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '09:00 – 10:00' })).not.toBeChecked();
  });
});
