import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { formules, options } from '../../data/offres';
import { PrixAdmin } from './PrixAdmin';

function simuler(modifies: Record<string, number> = {}, statut = 200) {
  const envois: unknown[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (_url: string, init: RequestInit = {}) => {
      if (init.method === 'POST') {
        envois.push(JSON.parse(String(init.body)));
        return new Response(JSON.stringify(statut === 200 ? { prix: {} } : { erreur: 'x' }), { status: statut });
      }
      return new Response(JSON.stringify({ prix: modifies }), { status: 200 });
    }),
  );
  return envois;
}

afterEach(() => vi.unstubAllGlobals());

const vitrine = () => screen.findByLabelText(formules[0].nom);

describe('Back-office : prix', () => {
  it('montre les prix du code, et ceux déjà modifiés', async () => {
    simuler({ 'option.logo': 200 });
    render(<PrixAdmin />);

    expect(await vitrine()).toHaveValue('99');
    expect(screen.getByLabelText(options.logo.nom)).toHaveValue('200');
  });

  it('n’envoie que ce qui diffère du code', async () => {
    const envois = simuler();
    render(<PrixAdmin />);

    const champ = await vitrine();
    await userEvent.clear(champ);
    await userEvent.type(champ, '120');
    await userEvent.click(screen.getByRole('button', { name: 'Enregistrer les prix' }));

    expect(await screen.findByRole('status')).toHaveTextContent('enregistrés');
    expect(envois).toEqual([{ prix: { 'formule.vitrine': 120 } }]);
  });

  it('remettre le prix du code revient à ne plus rien modifier', async () => {
    const envois = simuler({ 'formule.vitrine': 120 });
    render(<PrixAdmin />);

    const champ = await vitrine();
    await userEvent.clear(champ);
    await userEvent.type(champ, '99');
    await userEvent.click(screen.getByRole('button', { name: 'Enregistrer les prix' }));

    await screen.findByRole('status');
    expect(envois).toEqual([{ prix: {} }]);
  });

  it('refuse un prix qui n’est pas un nombre entier, sans rien envoyer', async () => {
    const envois = simuler();
    render(<PrixAdmin />);

    const champ = await vitrine();
    await userEvent.clear(champ);
    await userEvent.type(champ, '12,50');
    await userEvent.click(screen.getByRole('button', { name: 'Enregistrer les prix' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('nombre entier');
    expect(envois).toEqual([]);
  });

  it('signale un refus de l’API', async () => {
    simuler({}, 403);
    render(<PrixAdmin />);

    await vitrine();
    await userEvent.click(screen.getByRole('button', { name: 'Enregistrer les prix' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('pas abouti');
  });

  it('ne propose aucun champ si les prix sont illisibles : on n’écraserait pas ce qui est enregistré', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 500 })));
    render(<PrixAdmin />);

    expect(await screen.findByRole('alert')).toHaveTextContent('lire');
    expect(screen.queryByRole('button', { name: 'Enregistrer les prix' })).not.toBeInTheDocument();
  });
});
