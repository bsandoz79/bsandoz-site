import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../../app/routes';
import { pages } from '../../data/pages';
import { detailCalcul, formatFrais, fraisKilometriques, kmFactures, origineCoutKm, situer } from '../../data/zones';

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
const confirmer = () => within(screen.getByRole('form')).getByRole('button', { name: 'Confirmer le rendez-vous' });

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

  it('vérifie l’adresse et accepte un déplacement sans frais dans les 50 km', async () => {
    const user = userEvent.setup();
    simulerReseau();
    renderRdv();
    await user.type(screen.getByRole('textbox', { name: /Adresse du rendez-vous/ }), '12 rue de la Gare, Abbeville');
    await user.tab();
    expect(await screen.findByText(/Abbeville, à moins d’1 km d’Abbeville : je me déplace gratuitement\./)).toBeInTheDocument();
    expect(resume()).toHaveTextContent('Chez vous, Abbeville');
  });

  it('au-delà de 50 km : accepte le déplacement et annonce les frais kilométriques, dus même sans projet', async () => {
    const user = userEvent.setup();
    simulerReseau({ lieu: geocodage(3.0573, 50.6292, 'Lille') });
    renderRdv();
    await user.type(screen.getByRole('textbox', { name: /Adresse du rendez-vous/ }), 'Grand-Place, Lille');
    await user.tab();
    const { km } = situer(50.6292, 3.0573);
    const message = await screen.findByText(/au-delà de 50 km, je viens quand même/);
    const texte = message.textContent!.replace(/\s/g, ' ');
    expect(texte).toContain(`pour ${kmFactures(km)} km aller-retour`);
    expect(texte).toContain(formatFrais(fraisKilometriques(km)).replace(/\s/g, ' '));
    expect(texte).toContain('dus même si le projet ne se fait pas');
    expect(screen.getByText(/^Calcul : /).textContent).toBe(`Calcul : ${detailCalcul(km)} (${origineCoutKm()}).`);
    expect(screen.getByRole('group', { name: "2. Choisissez un créneau d'une heure" })).toBeInTheDocument();
    expect(resume()).toHaveTextContent('Chez vous, Lille');
  });

  it('fait apparaître chaque étape quand la précédente est validée', async () => {
    const user = userEvent.setup();
    simulerReseau();
    renderRdv();
    const calendrier = () => screen.queryByRole('group', { name: "2. Choisissez un créneau d'une heure" });
    const coordonnees = () => screen.queryByRole('group', { name: '3. Vos coordonnées' });

    // Au départ : seulement le lieu. Pas de calendrier, pas de coordonnées, pas de bouton « Confirmer ».
    expect(calendrier()).not.toBeInTheDocument();
    expect(coordonnees()).not.toBeInTheDocument();
    expect(within(resume()).queryByRole('button')).not.toBeInTheDocument();
    expect(resume()).toHaveTextContent('Choisissez le lieu, puis la date et le créneau, et enfin vos coordonnées.');

    // Chez vous : l'adresse vérifiée dans les 50 km valide le lieu.
    await user.type(screen.getByRole('textbox', { name: /Adresse du rendez-vous/ }), '12 rue de la Gare, Abbeville');
    await user.click(screen.getByRole('button', { name: "Vérifier l'adresse" }));
    expect(await screen.findByText(/je me déplace gratuitement/)).toBeInTheDocument();
    expect(calendrier()).toBeInTheDocument();
    expect(screen.getByText('Étape suivante : choisissez une date et un créneau.')).toBeInTheDocument();
    expect(coordonnees()).not.toBeInTheDocument();

    // Jour et créneau : les coordonnées et le bouton « Confirmer » apparaissent.
    await user.click(screen.getByRole('button', { name: /^mardi 17 novembre 2026$/ }));
    expect(coordonnees()).not.toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: '14:00 – 15:00' }));
    expect(coordonnees()).toBeInTheDocument();
    expect(confirmer()).toBeInTheDocument();
    // Le bouton est en bas du formulaire, après la dernière réponse (la case d'accord), pas dans le récapitulatif.
    const accord = screen.getByRole('checkbox', { name: /J'accepte que ces informations/ });
    expect(accord.compareDocumentPosition(confirmer()) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(within(resume()).queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('Étape suivante : indiquez vos coordonnées.')).toBeInTheDocument();

    // Modifier l'adresse : les étapes suivantes se masquent jusqu'à la nouvelle vérification, le choix est gardé.
    await user.type(screen.getByRole('textbox', { name: /Adresse du rendez-vous/ }), ' bis');
    expect(calendrier()).not.toBeInTheDocument();
    expect(coordonnees()).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: "Vérifier l'adresse" }));
    await screen.findByText(/je me déplace gratuitement/);
    expect(screen.getByRole('radio', { name: '14:00 – 15:00' })).toBeChecked();
  });

  it('ne propose que les jours ouvrés à venir, puis les créneaux du jour choisi', async () => {
    const user = userEvent.setup();
    simulerReseau();
    renderRdv();
    await user.click(screen.getByRole('radio', { name: /En visio/ }));
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
    await user.click(screen.getByRole('radio', { name: /Par téléphone/ }));
    await user.click(screen.getByRole('button', { name: /^mardi 17 novembre 2026$/ }));
    await user.click(screen.getByRole('radio', { name: '09:00 – 10:00' }));
    await user.click(confirmer());
    expect(screen.getByRole('alert')).toHaveTextContent('4 champs sont à corriger.');
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
  it('centre l’écran sur chaque étape qui s’ouvre', async () => {
    const user = userEvent.setup();
    const centrer = vi.fn();
    Element.prototype.scrollIntoView = centrer;
    simulerReseau();
    renderRdv();

    await user.click(screen.getByRole('radio', { name: /En visio/ }));
    expect(centrer).toHaveBeenCalledTimes(1);
    expect(centrer.mock.contexts[0]).toBe(screen.getByRole('group', { name: "2. Choisissez un créneau d'une heure" }));
    expect(centrer).toHaveBeenLastCalledWith(expect.objectContaining({ block: 'center' }));

    await user.click(screen.getByRole('button', { name: /^mardi 17 novembre 2026$/ }));
    expect(centrer).toHaveBeenCalledTimes(1); // choisir un jour ne suffit pas à ouvrir l'étape 3
    await user.click(screen.getByRole('radio', { name: '14:00 – 15:00' }));
    expect(centrer).toHaveBeenCalledTimes(2);
    expect(centrer.mock.contexts[1]).toBe(screen.getByRole('group', { name: '3. Vos coordonnées' }));

    // Changer de créneau ne refait pas défiler : l'étape 3 était déjà ouverte.
    await user.click(screen.getByRole('radio', { name: '15:30 – 16:30' }));
    expect(centrer).toHaveBeenCalledTimes(2);
  });
});
