import { fireEvent, render, screen } from '@testing-library/react';
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
  it('montre le réglage en vigueur', async () => {
    simuler();
    render(<DisponibilitesAdmin />);

    expect(await screen.findByRole('checkbox', { name: 'Lundi' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Mercredi' })).not.toBeChecked();
    expect(screen.getByLabelText(/Créneaux/)).toHaveValue('09:00, 14:00');
    expect(screen.getByText(/25 décembre 2026/)).toBeInTheDocument();
  });

  it('enregistre les jours, les créneaux et les jours fermés', async () => {
    const envois = simuler();
    render(<DisponibilitesAdmin />);

    await userEvent.click(await screen.findByRole('checkbox', { name: 'Mercredi' }));
    const champ = screen.getByLabelText(/Créneaux/);
    await userEvent.clear(champ);
    await userEvent.type(champ, '08:00, 10:00;11:30');
    fireEvent.change(screen.getByLabelText('Nouveau jour fermé'), { target: { value: '2026-12-24' } });
    await userEvent.click(screen.getByRole('button', { name: 'Ajouter ce jour' }));
    await enregistrer();

    expect(await screen.findByRole('status')).toHaveTextContent('enregistrées');
    expect(envois).toEqual([{ joursTravailles: [0, 1, 2], creneaux: ['08:00', '10:00', '11:30'], joursFermes: ['2026-12-24', '2026-12-25'] }]);
  });

  it('rouvre un jour fermé', async () => {
    const envois = simuler();
    render(<DisponibilitesAdmin />);

    await userEvent.click(await screen.findByRole('button', { name: /Rouvrir le 25 décembre 2026/ }));
    await enregistrer();

    await screen.findByRole('status');
    expect(envois).toEqual([{ joursTravailles: [0, 1], creneaux: ['09:00', '14:00'], joursFermes: [] }]);
  });

  it('affiche le refus de l’API', async () => {
    simuler({ statut: 400, corps: { erreurs: { creneaux: 'Indiquez au moins un créneau, au format 09:00.' } } });
    render(<DisponibilitesAdmin />);

    await screen.findByRole('checkbox', { name: 'Lundi' });
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
