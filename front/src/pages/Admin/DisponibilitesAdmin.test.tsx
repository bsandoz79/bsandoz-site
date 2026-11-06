import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DisponibilitesAdmin } from './DisponibilitesAdmin';

const enVigueur = { joursTravailles: [0, 1], creneaux: ['09:00', '14:00'], dureeMinutes: 60, delaiMinJours: 1, horizonJours: 60, joursFermes: ['2026-12-25'] };

function simuler(reponse: { statut: number; corps: unknown } = { statut: 200, corps: { joursTravailles: [0, 1, 2], creneaux: ['08:00'], joursFermes: [] } }) {
  const envois: unknown[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (_url: string, init: RequestInit = {}) => {
      if (init.method === 'POST') {
        envois.push(JSON.parse(String(init.body)));
        return new Response(JSON.stringify(reponse.corps), { status: reponse.statut });
      }
      return new Response(JSON.stringify(enVigueur), { status: 200 });
    }),
  );
  return envois;
}

afterEach(() => vi.unstubAllGlobals());

const enregistrer = () => userEvent.click(screen.getByRole('button', { name: 'Enregistrer les disponibilités' }));

describe('Back-office : disponibilités', () => {
  const jour = (name: string, pressed: boolean) => screen.findByRole('button', { name, pressed });

  it('montre le réglage en vigueur : jours et heures en boutons, jour fermé en liste', async () => {
    simuler();
    render(<DisponibilitesAdmin />);

    expect(await jour('Lundi', true)).toBeInTheDocument();
    expect(await jour('Mercredi', false)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '09:00', pressed: true })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '10:30', pressed: false })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Rouvrir le 25 décembre 2026/ })).toBeInTheDocument();
    // Plus de champ à remplir à la main.
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('enregistre jours, heures et jours fermés, réglés d’un clic', async () => {
    const envois = simuler();
    render(<DisponibilitesAdmin />);

    await userEvent.click(await jour('Mercredi', false));
    await userEvent.click(screen.getByRole('button', { name: '09:00', pressed: true }));
    await userEvent.click(screen.getByRole('button', { name: '10:30', pressed: false }));
    await enregistrer();

    expect(await screen.findByRole('status')).toHaveTextContent('enregistrées');
    expect(envois).toEqual([{ joursTravailles: [0, 1, 2], creneaux: ['10:30', '14:00'], joursFermes: ['2026-12-25'] }]);
  });

  it('un clic dans le calendrier ferme un jour, un second clic le rouvre', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 10, 5, 10, 0));
    const envois = simuler();
    render(<DisponibilitesAdmin />);

    const jourCalendrier = await screen.findByRole('button', { name: /^mardi 17 novembre 2026$/ });
    await userEvent.click(jourCalendrier);
    expect(screen.getByRole('button', { name: /^mardi 17 novembre 2026, fermé$/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Rouvrir le 17 novembre 2026/ })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /^mardi 17 novembre 2026, fermé$/ }));
    await userEvent.click(screen.getByRole('button', { name: /^mercredi 18 novembre 2026$/ }));
    await enregistrer();

    await screen.findByRole('status');
    expect(envois).toEqual([{ joursTravailles: [0, 1], creneaux: ['09:00', '14:00'], joursFermes: ['2026-11-18', '2026-12-25'] }]);
    vi.useRealTimers();
  });

  it('rouvre un jour fermé depuis la liste', async () => {
    const envois = simuler();
    render(<DisponibilitesAdmin />);

    await userEvent.click(await screen.findByRole('button', { name: /Rouvrir le 25 décembre 2026/ }));
    await enregistrer();

    await screen.findByRole('status');
    expect(envois).toEqual([{ joursTravailles: [0, 1], creneaux: ['09:00', '14:00'], joursFermes: [] }]);
  });

  it('garde visible une heure enregistrée hors de la grille', async () => {
    simuler();
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ ...enVigueur, creneaux: ['10:15'] }), { status: 200 })),
    );
    render(<DisponibilitesAdmin />);
    expect(await screen.findByRole('button', { name: '10:15', pressed: true })).toBeInTheDocument();
  });

  it('affiche le refus de l’API', async () => {
    simuler({ statut: 400, corps: { erreurs: { creneaux: 'Indiquez au moins un créneau, au format 09:00.' } } });
    render(<DisponibilitesAdmin />);

    await jour('Lundi', true);
    await enregistrer();

    expect(await screen.findByRole('alert')).toHaveTextContent('au format 09:00');
  });

  it('ne propose rien si le réglage est illisible : on n’écraserait pas ce qui est enregistré', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 500 })));
    render(<DisponibilitesAdmin />);

    expect(await screen.findByRole('alert')).toHaveTextContent('lire');
    expect(screen.queryByRole('button', { name: 'Enregistrer les disponibilités' })).not.toBeInTheDocument();
  });
});
