import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Admin } from './Admin';

const ligne = { id: 'd1', numero: '2026-014', titre: 'Site avec rendez-vous', nom: 'Marie Dupont', entreprise: 'Dupont Jardins', envoyeeLe: '2026-11-02T10:00:00+01:00', statut: 'recue', statutLibelle: 'Reçue' };
const autre = { ...ligne, id: 'd2', numero: '2026-015', titre: 'Vitrine', nom: 'Paul Martin', entreprise: '', statut: 'en_etude', statutLibelle: 'En étude' };
const statuts = [
  { statut: 'recue', libelle: 'Reçue' },
  { statut: 'en_etude', libelle: 'En étude' },
  { statut: 'devis_envoye', libelle: 'Devis envoyé' },
];
const detail = {
  id: 'd1',
  numero: '2026-014',
  titre: 'Site avec rendez-vous',
  envoyeeLe: '2026-11-02T10:00:00+01:00',
  statut: 'recue',
  statuts,
  demandeur: { nom: 'Marie Dupont', email: 'marie@exemple.fr', telephone: '06 12 34 56 78', entreprise: 'Dupont Jardins' },
  recapitulatif: 'Activité : Paysagiste',
  predevis: 'Prix estimé : 1 320 €',
  messages: [{ id: 'm1', auteur: 'client', origine: 'mail', corps: 'Une question', envoyeLe: '2026-11-03T09:00:00+01:00' }],
  devis: null as null | Record<string, unknown>,
};

type Reponse = { statut: number; corps: unknown };

function simuler(liste: Reponse, actions: Record<string, Reponse> = {}) {
  const appels: { methode: string; chemin: string; corps: unknown }[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string, init: RequestInit = {}) => {
      const chemin = new URL(url).pathname;
      const methode = init.method ?? 'GET';
      appels.push({ methode, chemin, corps: init.body ? JSON.parse(String(init.body)) : null });
      if (methode === 'POST') {
        const r = actions[chemin.split('/').pop()!];
        return new Response(JSON.stringify(r.corps), { status: r.statut });
      }
      if (chemin === '/backoffice/demandes') return new Response(JSON.stringify(liste.corps), { status: liste.statut });
      if (chemin === '/backoffice/rendez-vous') return new Response(JSON.stringify({ rendezVous: [] }), { status: 200 });
      if (chemin === '/rendez-vous/disponibilites') return new Response('', { status: 500 });
      return new Response(JSON.stringify({ demande: detail }), { status: 200 });
    }),
  );
  return appels;
}

function Ici() {
  const { pathname, search } = useLocation();
  return <p>Connexion : {pathname + search}</p>;
}

function afficher() {
  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/mon-espace/connexion" element={<Ici />} />
      </Routes>
    </MemoryRouter>,
  );
}

const avecListe = { statut: 200, corps: { demandes: [ligne, autre] } };

/** Le planning s'ouvre d'abord : on passe à l'onglet Demandes. */
async function allerAuxDemandes() {
  await userEvent.click(await screen.findByRole('button', { name: 'Demandes' }));
}

async function ouvrirLaDemande() {
  await userEvent.click(await screen.findByRole('button', { name: 'Ouvrir la demande 2026-014' }));
  await screen.findByRole('heading', { name: 'Site avec rendez-vous' });
}

afterEach(() => vi.unstubAllGlobals());

describe('Back-office : accès', () => {
  it('sans session, renvoie vers la connexion en gardant le retour', async () => {
    simuler({ statut: 401, corps: {} });
    afficher();
    expect(await screen.findByText('Connexion : /mon-espace/connexion?retour=%2Fadmin')).toBeInTheDocument();
  });

  it('un compte non autorisé voit un refus, sans aucune demande', async () => {
    simuler({ statut: 403, corps: { erreur: 'Accès réservé.' } });
    afficher();
    expect(await screen.findByRole('heading', { name: 'Accès réservé' })).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('signale une panne', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Promise.reject(new Error('réseau'))));
    afficher();
    expect(await screen.findByRole('alert')).toHaveTextContent('ne répond pas');
  });
});

describe('Back-office : demandes', () => {
  it('liste et filtre par statut', async () => {
    simuler(avecListe);
    afficher();
    await allerAuxDemandes();
    expect(await screen.findByText('Marie Dupont, Dupont Jardins')).toBeInTheDocument();
    expect(screen.getByText('Paul Martin')).toBeInTheDocument();

    await userEvent.selectOptions(screen.getByLabelText('Filtrer par statut'), 'en_etude');

    expect(screen.queryByText('Marie Dupont, Dupont Jardins')).not.toBeInTheDocument();
    expect(screen.getByText('Paul Martin')).toBeInTheDocument();
  });

  it('annonce une liste vide', async () => {
    simuler({ statut: 200, corps: { demandes: [] } });
    afficher();
    await allerAuxDemandes();
    expect(await screen.findByText('Aucune demande pour le moment.')).toBeInTheDocument();
  });

  it('ouvre le détail avec les coordonnées et le fil', async () => {
    simuler(avecListe);
    afficher();
    await allerAuxDemandes();
    await ouvrirLaDemande();

    expect(screen.getByRole('link', { name: 'marie@exemple.fr' })).toHaveAttribute('href', 'mailto:marie@exemple.fr');
    expect(screen.getByRole('link', { name: '06 12 34 56 78' })).toHaveAttribute('href', 'tel:0612345678');
    expect(screen.getByText('Activité : Paysagiste')).toBeInTheDocument();
    expect(screen.getByText(/Marie Dupont \(par mail\)/)).toBeInTheDocument();
  });

  it('enregistre le statut', async () => {
    const appels = simuler(avecListe, { statut: { statut: 200, corps: { demande: { ...detail, statut: 'en_etude' } } } });
    afficher();
    await allerAuxDemandes();
    await ouvrirLaDemande();

    await userEvent.selectOptions(screen.getByLabelText('Statut'), 'en_etude');
    await userEvent.click(screen.getByRole('button', { name: 'Enregistrer le statut' }));

    expect(await screen.findByRole('status')).toHaveTextContent('Statut enregistré.');
    expect(appels.at(-1)).toEqual({ methode: 'POST', chemin: '/backoffice/demandes/d1/statut', corps: { statut: 'en_etude' } });
  });

  it('affiche le refus de l’API et remet le statut d’origine', async () => {
    simuler(avecListe, { statut: { statut: 409, corps: { erreur: 'Établissez d’abord le devis.' } } });
    afficher();
    await allerAuxDemandes();
    await ouvrirLaDemande();

    await userEvent.selectOptions(screen.getByLabelText('Statut'), 'devis_envoye');
    await userEvent.click(screen.getByRole('button', { name: 'Enregistrer le statut' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Établissez d’abord le devis.');
    expect(screen.getByLabelText('Statut')).toHaveValue('recue');
  });

  it('répond au client, ou note un appel', async () => {
    const appels = simuler(avecListe, { messages: { statut: 200, corps: { demande: detail } } });
    afficher();
    await allerAuxDemandes();
    await ouvrirLaDemande();

    await userEvent.click(screen.getByRole('button', { name: 'Envoyer' }));
    expect(await screen.findByText('Écrivez votre message.')).toBeInTheDocument();
    expect(appels.filter((a) => a.methode === 'POST')).toEqual([]);

    await userEvent.type(screen.getByLabelText(/Votre réponse/), 'Bonjour Marie');
    await userEvent.click(screen.getByRole('button', { name: 'Envoyer' }));
    expect(appels.at(-1)?.corps).toEqual({ corps: 'Bonjour Marie', note: false });

    await userEvent.type(screen.getByLabelText(/Votre réponse/), 'Appel');
    await userEvent.click(screen.getByLabelText(/Note d’appel/));
    await userEvent.click(screen.getByRole('button', { name: 'Ajouter la note' }));
    expect(appels.at(-1)?.corps).toEqual({ corps: 'Appel', note: true });
  });
});

describe('Back-office : devis', () => {
  async function saisir() {
    await userEvent.type(screen.getByLabelText(/Libellé 1/), 'Site fonctionnel');
    await userEvent.type(screen.getByLabelText(/Prix \(€\) 1/), '989');
  }

  it('refuse une ligne incomplète ou un prix non entier', async () => {
    const appels = simuler(avecListe);
    afficher();
    await allerAuxDemandes();
    await ouvrirLaDemande();

    await userEvent.type(screen.getByLabelText(/Libellé 1/), 'Site');
    await userEvent.type(screen.getByLabelText(/Prix \(€\) 1/), '98,5');
    await userEvent.click(screen.getByRole('button', { name: 'Envoyer le devis' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Chaque ligne');
    expect(appels.filter((a) => a.methode === 'POST')).toEqual([]);
  });

  it('additionne les lignes, demande confirmation, puis envoie', async () => {
    const accepte = { ...detail, statut: 'devis_envoye', devis: { numero: '2026-014', lignes: [{ libelle: 'Site fonctionnel', prix: 989 }, { libelle: 'Rendez-vous', prix: 400 }], total: 1389, statut: 'envoye', envoyeLe: '2026-11-06T10:00:00+01:00', accepteLe: null } };
    const appels = simuler(avecListe, { devis: { statut: 200, corps: { demande: accepte } } });
    afficher();
    await allerAuxDemandes();
    await ouvrirLaDemande();

    await saisir();
    await userEvent.click(screen.getByRole('button', { name: 'Ajouter une ligne' }));
    await userEvent.type(screen.getByLabelText(/Libellé 2/), 'Rendez-vous');
    await userEvent.type(screen.getByLabelText(/Prix \(€\) 2/), '400');
    await userEvent.click(screen.getByRole('button', { name: 'Envoyer le devis' }));

    expect(screen.getByText(/Il ne pourra plus être modifié/)).toBeInTheDocument();
    expect(appels.filter((a) => a.methode === 'POST')).toEqual([]);

    await userEvent.click(screen.getByRole('button', { name: 'Oui, envoyer' }));

    expect(await screen.findByRole('status')).toHaveTextContent('le client est prévenu');
    expect(appels.at(-1)?.corps).toEqual({ lignes: [{ libelle: 'Site fonctionnel', prix: 989 }, { libelle: 'Rendez-vous', prix: 400 }] });
    expect(screen.getByText('Devis n° 2026-014')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Envoyer le devis' })).not.toBeInTheDocument();
  });

  it('modifier une ligne annule la confirmation', async () => {
    simuler(avecListe);
    afficher();
    await allerAuxDemandes();
    await ouvrirLaDemande();

    await saisir();
    await userEvent.click(screen.getByRole('button', { name: 'Envoyer le devis' }));
    await userEvent.type(screen.getByLabelText(/Prix \(€\) 1/), '0');

    expect(screen.queryByRole('button', { name: 'Oui, envoyer' })).not.toBeInTheDocument();
  });

  it('s’ouvre sur le planning', async () => {
    simuler(avecListe);
    afficher();
    expect(await screen.findByRole('heading', { name: 'Planning de la semaine' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Planning', pressed: true })).toBeInTheDocument();
  });
});
