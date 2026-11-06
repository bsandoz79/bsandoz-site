import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { formatPrix } from '../../data/offres';
import { pages } from '../../data/pages';
import type { MaDemande } from './compte';
import { MesDemandes } from './MesDemandes';

const libelles = ['Reçue', 'En étude', 'Devis envoyé', 'Accepté', 'En cours', 'Livré'];
const etapes = (rang: number) =>
  ['recue', 'en_etude', 'devis_envoye', 'acceptee', 'en_cours', 'livree'].map((statut, i) => ({ statut, libelle: libelles[i], atteinte: i <= rang }));

const avecDevis: MaDemande = {
  id: 'd2',
  numero: '2026-014',
  titre: 'Site avec prise de rendez-vous et devis',
  envoyeeLe: '2026-11-02T10:00:00+01:00',
  statut: 'devis_envoye',
  etapes: etapes(2),
  messages: [
    { id: 'm1', auteur: 'client', origine: 'site', corps: 'Bonjour,\nune question.', envoyeLe: '2026-11-03T09:00:00+01:00' },
    { id: 'm2', auteur: 'professionnel', origine: 'note', corps: 'Appel : préfère une visio.', envoyeLe: '2026-11-03T15:00:00+01:00' },
    { id: 'm3', auteur: 'client', origine: 'mail', corps: 'Merci pour l’appel.', envoyeLe: '2026-11-04T08:00:00+01:00' },
  ],
  devis: {
    numero: '2026-014',
    lignes: [
      { libelle: 'Site fonctionnel', prix: 989 },
      { libelle: 'Rendez-vous en ligne', prix: 400 },
      { libelle: 'Calculateur de prix', prix: 250 },
    ],
    total: 1639,
    statut: 'envoye',
    envoyeLe: '2026-11-04T10:12:00+01:00',
    accepteLe: null,
  },
};
const recue: MaDemande = { ...avecDevis, id: 'd1', numero: '2026-009', titre: 'Site vitrine une page', statut: 'recue', etapes: etapes(0), devis: null };

function simuler(demandes: MaDemande[], acceptation = 200, ecriture = 201) {
  const appels: string[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string, init: RequestInit = {}) => {
      const chemin = new URL(url).pathname;
      appels.push(`${init.method ?? 'GET'} ${chemin}`);
      if (chemin.endsWith('/messages')) {
        const corps = JSON.parse(String(init.body)).corps as string;
        const demande = { ...avecDevis, messages: [...avecDevis.messages, { id: 'm4', auteur: 'client', origine: 'site', corps, envoyeLe: '2026-11-05T08:00:00+01:00' }] };
        return new Response(JSON.stringify(ecriture === 201 ? { demande } : { erreurs: { corps: 'Message refusé.' } }), { status: ecriture });
      }
      if (chemin.endsWith('/devis/accepter')) {
        const demande = { ...avecDevis, statut: 'acceptee', etapes: etapes(3), devis: { ...avecDevis.devis!, statut: 'accepte' as const, accepteLe: '2026-11-08T18:00:00+01:00' } };
        return new Response(JSON.stringify(acceptation === 200 ? { demande } : { erreur: 'x' }), { status: acceptation });
      }
      return new Response(JSON.stringify({ demandes }), { status: 200 });
    }),
  );
  return appels;
}

const afficher = () =>
  render(
    <MemoryRouter>
      <MesDemandes />
    </MemoryRouter>,
  );

afterEach(() => vi.unstubAllGlobals());

describe('MesDemandes', () => {
  it('affiche chaque demande, son avancement et son devis, comme la maquette', async () => {
    simuler([avecDevis, recue]);
    afficher();

    expect(await screen.findByText('Demande n° 2026-014 · envoyée le 2 novembre 2026')).toBeInTheDocument();
    const article = screen.getByRole('article', { name: 'Site avec prise de rendez-vous et devis' });
    const avancement = within(article).getByRole('list', { name: 'Avancement' });
    expect(within(avancement).getByText('Devis envoyé')).toHaveAttribute('aria-current', 'step');
    expect(within(article).getByRole('heading', { name: 'Devis n° 2026-014' })).toBeInTheDocument();
    // Testing Library remplace les espaces insécables par des espaces : on compare sur une expression.
    expect(within(article).getByText(new RegExp(`^${formatPrix(1639).replace(/\s/g, '\\s')}$`))).toBeInTheDocument();
    expect(within(article).getByRole('link', { name: 'PDF' })).toHaveAttribute('href', 'https://api.bsandoz.fr/espace/demandes/d2/devis.pdf');

    const sansDevis = screen.getByRole('article', { name: 'Site vitrine une page' });
    expect(within(sansDevis).queryByRole('button', { name: 'Accepter le devis' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Nouvelle demande' })).toHaveAttribute('href', pages.devis.path);
  });

  it('accepte le devis après confirmation', async () => {
    const user = userEvent.setup();
    const appels = simuler([avecDevis]);
    afficher();

    await user.click(await screen.findByRole('button', { name: 'Accepter le devis' }));
    await user.click(screen.getByRole('button', { name: 'Pas maintenant' }));
    expect(appels.some((a) => a.startsWith('POST'))).toBe(false);

    await user.click(screen.getByRole('button', { name: 'Accepter le devis' }));
    await user.click(screen.getByRole('button', { name: 'Oui, j’accepte ce devis' }));

    expect(await screen.findByRole('status')).toHaveTextContent('votre devis est accepté');
    expect(appels).toContain('POST /espace/demandes/d2/devis/accepter');
    expect(screen.getByText('Devis accepté le 8 novembre 2026. Merci !')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Accepter le devis' })).not.toBeInTheDocument();
    expect(screen.getByText('Accepté')).toHaveAttribute('aria-current', 'step');
  });

  it('signale un échec d’acceptation', async () => {
    const user = userEvent.setup();
    simuler([avecDevis], 409);
    afficher();

    await user.click(await screen.findByRole('button', { name: 'Accepter le devis' }));
    await user.click(screen.getByRole('button', { name: 'Oui, j’accepte ce devis' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('L’acceptation n’a pas abouti.');
  });

  it('indique quand il n’y a aucune demande', async () => {
    simuler([]);
    afficher();

    expect(await screen.findByText('Aucune demande de devis pour le moment.')).toBeInTheDocument();
  });
});

describe('MesDemandes : fil de messages', () => {
  const afficher = () =>
    render(
      <MemoryRouter>
        <MesDemandes />
      </MemoryRouter>,
    );

  it('affiche les échanges avec leur origine', async () => {
    simuler([avecDevis]);
    afficher();

    const fil = within(await screen.findByRole('heading', { name: 'Nos échanges' }).then((h) => h.parentElement!));
    expect(fil.getByText(/Bonjour,\s+une question\./)).toBeInTheDocument();
    expect(fil.getByText(/Baptiste \(note d’appel\)/)).toBeInTheDocument();
    expect(fil.getByText(/Vous \(par mail\)/)).toBeInTheDocument();
  });

  it('indique quand il n’y a aucun échange', async () => {
    simuler([{ ...avecDevis, messages: [] }]);
    afficher();

    expect(await screen.findByText('Aucun échange pour le moment.')).toBeInTheDocument();
  });

  it('envoie un message, puis vide le champ', async () => {
    const appels = simuler([avecDevis]);
    afficher();

    const champ = await screen.findByLabelText(/Votre message/);
    await userEvent.type(champ, 'Une précision');
    await userEvent.click(screen.getByRole('button', { name: 'Envoyer' }));

    expect(await screen.findByText('Une précision')).toBeInTheDocument();
    expect(appels).toContain('POST /espace/demandes/d2/messages');
    expect(champ).toHaveValue('');
  });

  it('refuse un message vide sans appeler l’API', async () => {
    const appels = simuler([avecDevis]);
    afficher();

    await userEvent.click(await screen.findByRole('button', { name: 'Envoyer' }));

    expect(await screen.findByText('Écrivez votre message.')).toBeInTheDocument();
    expect(appels.filter((a) => a.startsWith('POST'))).toEqual([]);
  });

  it('garde le texte et affiche l’erreur si l’envoi est refusé', async () => {
    simuler([avecDevis], 200, 400);
    afficher();

    const champ = await screen.findByLabelText(/Votre message/);
    await userEvent.type(champ, 'Une précision');
    await userEvent.click(screen.getByRole('button', { name: 'Envoyer' }));

    expect(await screen.findByText('Message refusé.')).toBeInTheDocument();
    expect(champ).toHaveValue('Une précision');
  });
});
