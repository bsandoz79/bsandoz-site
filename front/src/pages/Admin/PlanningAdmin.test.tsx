import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { LigneDemande, RendezVousAdmin } from './api';
import { PlanningAdmin } from './PlanningAdmin';
import { calculerStatistiques, joursDeLaSemaine, lundiDe, placesDeLaSemaine } from './statistiques';

const rdv = (id: string, jour: string, heure: string, changements: Partial<RendezVousAdmin> = {}): RendezVousAdmin => ({
  id,
  jour,
  heure,
  fin: `${String(Number(heure.slice(0, 2)) + 1).padStart(2, '0')}:00`,
  lieu: 'visio',
  lieuLibelle: 'En visio',
  adresse: null,
  nom: 'Marie Dupont',
  email: 'marie@exemple.fr',
  telephone: '06 12 34 56 78',
  activite: 'Detailing',
  message: 'Un message.',
  statut: 'confirme',
  kmFactures: null,
  frais: null,
  ...changements,
});

const demande = (statut: string): LigneDemande => ({ id: statut, numero: '1', titre: 'x', nom: 'y', entreprise: '', envoyeeLe: '2026-11-02T10:00:00+01:00', statut, statutLibelle: statut }) as LigneDemande;

describe('calcul des statistiques', () => {
  const lundi = '2026-11-02';

  it('trouve le lundi et les sept jours de la semaine', () => {
    expect(lundiDe('2026-11-05')).toBe(lundi);
    expect(lundiDe(lundi)).toBe(lundi);
    expect(joursDeLaSemaine(lundi).at(-1)).toBe('2026-11-08');
  });

  it('compte les places des jours travaillés et ouverts', () => {
    expect(placesDeLaSemaine(lundi, { joursTravailles: [0, 1, 2, 3, 4], creneaux: ['09:00', '14:00'], joursFermes: ['2026-11-03'] })).toBe(8);
    expect(placesDeLaSemaine(lundi, { joursTravailles: [], creneaux: ['09:00'], joursFermes: [] })).toBe(0);
  });

  it('calcule les chiffres sur les vraies données, sans inventer d’occupation', () => {
    const rdvPeriode = [
      rdv('a', '2026-11-05', '09:00'),
      rdv('b', '2026-11-12', '09:00'),
      rdv('c', '2026-11-20', '09:00'),
      rdv('d', '2026-11-06', '09:00', { statut: 'annule' }),
      rdv('e', '2026-12-01', '09:00'),
      rdv('f', '2026-11-02', '09:00'),
    ];
    const stats = calculerStatistiques({
      rdvPeriode,
      rdvSemaine: [rdvPeriode[0], rdvPeriode[3]],
      demandes: [demande('recue'), demande('recue'), demande('acceptee'), demande('livree'), demande('en_etude')],
      aujourdhui: '2026-11-05',
      places: 4,
    });
    expect(stats).toEqual({ aVenir: 2, mois: 4, annules: 1, occupation: 25, aTraiter: 2, acceptes: 2 });
    expect(calculerStatistiques({ rdvPeriode: [], rdvSemaine: [], demandes: [], aujourdhui: '2026-11-05', places: 0 }).occupation).toBeNull();
  });
});

describe('Planning du back-office', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 10, 5, 10, 0)); // jeudi 5 novembre 2026
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  function api(rendezVous: RendezVousAdmin[], { annulation = 200 } = {}) {
    const appels: string[] = [];
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string, init: RequestInit = {}) => {
        const adresse = new URL(String(url));
        appels.push(`${init.method ?? 'GET'} ${adresse.pathname}${adresse.search}`);
        if (adresse.pathname.endsWith('/annuler')) {
          return new Response(JSON.stringify({ rendezVous: { ...rendezVous[0], statut: 'annule' } }), { status: annulation });
        }
        if (adresse.pathname === '/rendez-vous/disponibilites') {
          return new Response(JSON.stringify({ joursTravailles: [0, 1, 2, 3, 4], creneaux: ['09:00', '14:00'], dureeMinutes: 60, delaiMinJours: 1, horizonJours: 60, joursFermes: [] }));
        }
        const du = adresse.searchParams.get('du') ?? '';
        const au = adresse.searchParams.get('au') ?? '';
        return new Response(JSON.stringify({ rendezVous: rendezVous.filter((r) => r.jour >= du && r.jour <= au) }));
      }),
    );
    return appels;
  }

  const grille = () => within(screen.getByTestId('grille'));

  it('affiche les rendez-vous sur la semaine, et les chiffres', async () => {
    api([rdv('a', '2026-11-05', '14:00'), rdv('b', '2026-11-16', '09:00')]);
    render(<PlanningAdmin demandes={[demande('recue')]} />);

    expect(await grille().findByRole('button', { name: /14:00 Marie Dupont/ })).toBeInTheDocument();
    const stats = within(screen.getByRole('region', { name: 'Statistiques' }));
    expect(await stats.findByText('RDV à venir')).toBeInTheDocument();
    expect(stats.getByText('Demandes à traiter').parentElement).toHaveTextContent('1');
  });

  it('change de semaine et revient à aujourd’hui', async () => {
    const user = userEvent.setup();
    const appels = api([rdv('b', '2026-11-16', '09:00')]);
    render(<PlanningAdmin demandes={[]} />);
    expect(await screen.findByText('Aucun rendez-vous cette semaine.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Semaine suivante' }));
    await user.click(screen.getByRole('button', { name: 'Semaine suivante' }));
    expect(await grille().findByRole('button', { name: /09:00 Marie Dupont/ })).toBeInTheDocument();
    expect(appels).toContain('GET /backoffice/rendez-vous?du=2026-11-16&au=2026-11-22');

    await user.click(screen.getByRole('button', { name: 'Aujourd’hui' }));
    expect(await screen.findByText('Aucun rendez-vous cette semaine.')).toBeInTheDocument();
  });

  it('ouvre le détail, avec téléphone, adresse et frais', async () => {
    const user = userEvent.setup();
    api([rdv('a', '2026-11-05', '14:00', { lieu: 'chezvous', lieuLibelle: 'Chez vous', adresse: 'Grand-Place, Lille', frais: '18,00 €', kmFactures: 96 })]);
    render(<PlanningAdmin demandes={[]} />);
    await user.click(await grille().findByRole('button', { name: /14:00 Marie Dupont/ }));

    const detail = within(screen.getByRole('region', { name: 'Marie Dupont' }));
    expect(detail.getByRole('link', { name: '06 12 34 56 78' })).toHaveAttribute('href', 'tel:0612345678');
    expect(detail.getByRole('link', { name: 'marie@exemple.fr' })).toHaveAttribute('href', 'mailto:marie@exemple.fr');
    expect(detail.getByText('Chez vous : Grand-Place, Lille')).toBeInTheDocument();
    expect(detail.getByText('18,00 € (96 km aller-retour)')).toBeInTheDocument();
  });

  it('annule seulement avec des disponibilités, et les envoie au client', async () => {
    const user = userEvent.setup();
    const appels = api([rdv('a', '2026-11-05', '14:00')]);
    const envois: unknown[] = [];
    const fetchReel = globalThis.fetch;
    vi.stubGlobal('fetch', vi.fn(async (url: string, init: RequestInit = {}) => {
      if (init.method === 'POST') envois.push(JSON.parse(String(init.body)));
      return fetchReel(url, init);
    }));
    render(<PlanningAdmin demandes={[]} />);
    await user.click(await grille().findByRole('button', { name: /14:00 Marie Dupont/ }));

    await user.click(screen.getByRole('button', { name: 'Annuler ce rendez-vous' }));
    await user.click(screen.getByRole('button', { name: 'Garder le rendez-vous' }));
    expect(appels.some((a) => a.includes('/annuler'))).toBe(false);

    await user.click(screen.getByRole('button', { name: 'Annuler ce rendez-vous' }));
    await user.click(screen.getByRole('button', { name: 'Annuler et envoyer l’e-mail' }));
    expect(screen.getByText('Indiquez au moins une disponibilité à proposer.')).toBeInTheDocument();
    expect(appels.some((a) => a.includes('/annuler'))).toBe(false);

    await user.type(screen.getByRole('textbox', { name: /Vos disponibilités à proposer/ }), 'Mardi 17 à 14 h');
    await user.click(screen.getByRole('button', { name: 'Annuler et envoyer l’e-mail' }));
    expect(await grille().findByRole('button', { name: /14:00 Marie Dupont\s*\(Annulé\)/ })).toBeInTheDocument();
    expect(appels).toContain('POST /backoffice/rendez-vous/a/annuler');
    expect(envois).toEqual([{ message: 'Mardi 17 à 14 h', lien: `${window.location.origin}/rendez-vous` }]);
    expect(screen.queryByRole('button', { name: 'Annuler ce rendez-vous' })).not.toBeInTheDocument();
  });

  it('signale un échec d’annulation et garde le message', async () => {
    const user = userEvent.setup();
    api([rdv('a', '2026-11-05', '14:00')], { annulation: 500 });
    render(<PlanningAdmin demandes={[]} />);
    await user.click(await grille().findByRole('button', { name: /14:00 Marie Dupont/ }));
    await user.click(screen.getByRole('button', { name: 'Annuler ce rendez-vous' }));
    await user.type(screen.getByRole('textbox', { name: /Vos disponibilités à proposer/ }), 'Mardi');
    await user.click(screen.getByRole('button', { name: 'Annuler et envoyer l’e-mail' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('n’a pas abouti');
    expect(screen.getByRole('textbox', { name: /Vos disponibilités à proposer/ })).toHaveValue('Mardi');
  });

  it('dit quand les rendez-vous sont illisibles', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 500 })));
    render(<PlanningAdmin demandes={[]} />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Impossible de lire');
    expect(screen.queryByText('Aucun rendez-vous cette semaine.')).not.toBeInTheDocument();
  });
});
