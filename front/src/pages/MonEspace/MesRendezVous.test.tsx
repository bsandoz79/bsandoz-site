import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { jourLisible } from '../../data/espace';
import { pages } from '../../data/pages';
import type { MonRendezVous } from './compte';
import { MesRendezVous } from './MesRendezVous';

const aVenir: MonRendezVous = {
  id: 'r1',
  jour: '2026-11-17',
  debut: '14:00',
  fin: '15:00',
  lieu: 'chezvous',
  lieuLibelle: 'Chez vous',
  adresse: '12 rue des Lilas, Abbeville',
  statut: 'confirme',
  aVenir: true,
};
const passe: MonRendezVous = { ...aVenir, id: 'r0', jour: '2026-10-02', debut: '09:00', fin: '10:00', lieu: 'visio', lieuLibelle: 'En visio', adresse: null, aVenir: false };

function simuler(rendezVous: MonRendezVous[], annulation = 200) {
  let liste = rendezVous;
  const appels: string[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string, init: RequestInit = {}) => {
      const chemin = new URL(url).pathname;
      appels.push(`${init.method ?? 'GET'} ${chemin}`);
      if (chemin.endsWith('/annuler')) {
        if (annulation === 200) liste = liste.map((r) => (chemin.includes(r.id) ? { ...r, statut: 'annule' as const, aVenir: false } : r));
        return new Response(JSON.stringify({ statut: 'annule' }), { status: annulation });
      }
      return new Response(JSON.stringify({ rendezVous: liste }), { status: 200 });
    }),
  );
  return appels;
}

function afficher() {
  return render(
    <MemoryRouter>
      <MesRendezVous />
    </MemoryRouter>,
  );
}

afterEach(() => vi.unstubAllGlobals());

describe('MesRendezVous', () => {
  it('écrit le jour comme la maquette', () => {
    expect(jourLisible('2026-11-17')).toBe('Mardi 17 novembre');
  });

  it('affiche le rendez-vous à venir avec ses actions', async () => {
    simuler([passe, aVenir]);
    afficher();

    expect(await screen.findByText('Mardi 17 novembre · 14:00 – 15:00')).toBeInTheDocument();
    expect(screen.getByText('Rendez-vous découverte · chez vous, 12 rue des Lilas, Abbeville')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ajouter à l’agenda' })).toHaveAttribute('href', 'https://api.bsandoz.fr/espace/rendez-vous/r1/agenda.ics');
    expect(screen.getByRole('link', { name: 'Déplacer' })).toHaveAttribute('href', pages.rendezVous.path);
    expect(screen.getByRole('heading', { name: 'Rendez-vous passés et annulés' })).toBeInTheDocument();
    expect(screen.getByText('Vendredi 2 octobre · 09:00 – 10:00')).toBeInTheDocument();
  });

  it('demande confirmation avant d’annuler, puis met la liste à jour', async () => {
    const user = userEvent.setup();
    const appels = simuler([aVenir]);
    afficher();

    await user.click(await screen.findByRole('button', { name: 'Annuler' }));
    expect(appels.filter((a) => a.startsWith('POST'))).toHaveLength(0);
    await user.click(screen.getByRole('button', { name: 'Garder le rendez-vous' }));
    expect(screen.getByRole('button', { name: 'Annuler' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Annuler' }));
    await user.click(screen.getByRole('button', { name: 'Confirmer l’annulation' }));

    expect(await screen.findByRole('status')).toHaveTextContent('Le rendez-vous est annulé.');
    expect(appels).toContain('POST /espace/rendez-vous/r1/annuler');
    await waitFor(() => expect(screen.getByText('Aucun rendez-vous pour le moment.')).toBeInTheDocument());
    const passes = screen.getByRole('heading', { name: 'Rendez-vous passés et annulés' }).nextElementSibling as HTMLElement;
    expect(within(passes).getByText(/annulé/)).toBeInTheDocument();
  });

  it('signale un échec d’annulation', async () => {
    const user = userEvent.setup();
    simuler([aVenir], 409);
    afficher();

    await user.click(await screen.findByRole('button', { name: 'Annuler' }));
    await user.click(screen.getByRole('button', { name: 'Confirmer l’annulation' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('L’annulation n’a pas abouti.');
  });

  it('propose de prendre rendez-vous quand il n’y en a aucun', async () => {
    simuler([]);
    afficher();

    expect(await screen.findByText('Aucun rendez-vous pour le moment.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Prendre rendez-vous (gratuit)' })).toHaveAttribute('href', pages.rendezVous.path);
  });
});
