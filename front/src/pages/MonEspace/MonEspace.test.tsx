import { StrictMode } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { pages } from '../../data/pages';
import { Connexion, Lien, MonEspace, MotDePasse } from '.';
import { erreurMotDePasse } from './compte';

const compte = {
  id: 'c1',
  email: 'marie@exemple.fr',
  nom: 'Marie Dupont',
  statut: 'actif',
  motDePasse: false,
  motDePasseModifieLe: null,
};

type Reponse = { statut: number; corps?: unknown };
type Routeur = (chemin: string, methode: string, corps: Record<string, unknown>) => Reponse;

/** Simule l'API : chaque appel est noté, la réponse vient de `routeur`. */
function simulerApi(routeur: Routeur) {
  const appels: { chemin: string; methode: string; corps: Record<string, unknown>; credentials?: RequestCredentials }[] = [];
  const fetchMock = vi.fn(async (url: string, init: RequestInit = {}) => {
    const chemin = new URL(url).pathname;
    const methode = init.method ?? 'GET';
    const corps = init.body ? (JSON.parse(String(init.body)) as Record<string, unknown>) : {};
    appels.push({ chemin, methode, corps, credentials: init.credentials });
    const { statut, corps: reponse } = routeur(chemin, methode, corps);
    return new Response(reponse === undefined ? null : JSON.stringify(reponse), { status: statut });
  });
  vi.stubGlobal('fetch', fetchMock);
  return appels;
}

function afficher(chemin: string) {
  return render(
    <StrictMode>
      <MemoryRouter initialEntries={[chemin]}>
        <Routes>
          <Route path={pages.monEspace.path} element={<MonEspace />} />
          <Route path={pages.connexion.path} element={<Connexion />} />
          <Route path={pages.lienConnexion.path} element={<Lien />} />
          <Route path={pages.motDePasse.path} element={<MotDePasse />} />
        </Routes>
      </MemoryRouter>
    </StrictMode>,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Connexion', () => {
  it('connecte avec e-mail et mot de passe, cookie compris, puis ouvre l’espace', async () => {
    const user = userEvent.setup();
    let connecte = false;
    const appels = simulerApi((chemin) => {
      if (chemin === '/auth/connexion') {
        connecte = true;
        return { statut: 200, corps: { compte } };
      }
      if (chemin === '/auth/moi') return connecte ? { statut: 200, corps: { compte } } : { statut: 401 };
      if (chemin === '/auth/appareils') return { statut: 200, corps: { appareils: [] } };
      return { statut: 404 };
    });
    afficher(pages.connexion.path);

    await user.type(screen.getByLabelText(/E-mail/), 'marie@exemple.fr');
    await user.type(screen.getByLabelText('Mot de passe'), 'une phrase de passe');
    await user.click(screen.getByRole('button', { name: 'Se connecter' }));

    expect(await screen.findByRole('heading', { level: 1, name: 'Bonjour Marie Dupont' })).toBeInTheDocument();
    const connexion = appels.find((a) => a.chemin === '/auth/connexion');
    expect(connexion?.corps).toEqual({ email: 'marie@exemple.fr', motDePasse: 'une phrase de passe' });
    expect(appels.every((a) => a.credentials === 'include')).toBe(true);
  });

  it('signale des identifiants incorrects sans dire lequel', async () => {
    const user = userEvent.setup();
    simulerApi((chemin) => (chemin === '/auth/connexion' ? { statut: 401 } : { statut: 401 }));
    afficher(pages.connexion.path);

    await user.type(screen.getByLabelText(/E-mail/), 'marie@exemple.fr');
    await user.type(screen.getByLabelText('Mot de passe'), 'mauvais');
    await user.click(screen.getByRole('button', { name: 'Se connecter' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('E-mail ou mot de passe incorrect.');
  });

  it('demande de patienter après trop d’essais', async () => {
    const user = userEvent.setup();
    simulerApi((chemin) => (chemin === '/auth/connexion' ? { statut: 429 } : { statut: 401 }));
    afficher(pages.connexion.path);

    await user.type(screen.getByLabelText(/E-mail/), 'marie@exemple.fr');
    await user.type(screen.getByLabelText('Mot de passe'), 'x');
    await user.click(screen.getByRole('button', { name: 'Se connecter' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Trop d’essais');
  });

  it('envoie un lien de connexion par mail, avec la même réponse pour toute adresse', async () => {
    const user = userEvent.setup();
    const appels = simulerApi((chemin) => (chemin === '/auth/lien' ? { statut: 202, corps: { ok: true } } : { statut: 401 }));
    afficher(pages.connexion.path);

    await user.click(screen.getByRole('button', { name: 'Recevoir un lien de connexion' }));
    expect(screen.getByText('Indiquez votre adresse e-mail pour recevoir le lien.')).toBeInTheDocument();

    await user.type(screen.getByLabelText(/E-mail/), ' marie@exemple.fr ');
    await user.click(screen.getByRole('button', { name: 'Recevoir un lien de connexion' }));

    expect(await screen.findByRole('status')).toHaveTextContent('Si un compte existe pour marie@exemple.fr, un lien de connexion vient de partir.');
    expect(appels.find((a) => a.chemin === '/auth/lien')?.corps).toEqual({ email: 'marie@exemple.fr', usage: 'connexion' });
  });

  it('prévient si le serveur ne répond pas', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    afficher(pages.connexion.path);

    await user.type(screen.getByLabelText(/E-mail/), 'marie@exemple.fr');
    await user.click(screen.getByRole('button', { name: 'Se connecter' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Le serveur ne répond pas.');
  });

  it('envoie directement dans l’espace si l’on est déjà connecté', async () => {
    simulerApi((chemin) =>
      chemin === '/auth/moi' ? { statut: 200, corps: { compte } } : { statut: 200, corps: { appareils: [] } },
    );
    afficher(pages.connexion.path);

    expect(await screen.findByRole('heading', { level: 1, name: 'Bonjour Marie Dupont' })).toBeInTheDocument();
  });
});

describe('Lien reçu par mail', () => {
  it('utilise le lien une seule fois (même en StrictMode) puis ouvre l’espace', async () => {
    let connecte = false;
    const appels = simulerApi((chemin) => {
      if (chemin === '/auth/lien/utiliser') {
        connecte = true;
        return { statut: 200, corps: { compte } };
      }
      if (chemin === '/auth/moi') return connecte ? { statut: 200, corps: { compte } } : { statut: 401 };
      return { statut: 200, corps: { appareils: [] } };
    });
    afficher(`${pages.lienConnexion.path}?jeton=${'a'.repeat(64)}`);

    expect(await screen.findByRole('heading', { level: 1, name: 'Bonjour Marie Dupont' })).toBeInTheDocument();
    const utilisations = appels.filter((a) => a.chemin === '/auth/lien/utiliser');
    expect(utilisations).toHaveLength(1);
    expect(utilisations[0].corps).toEqual({ jeton: 'a'.repeat(64) });
  });

  it('explique qu’un lien a expiré et propose d’en recevoir un nouveau', async () => {
    simulerApi(() => ({ statut: 410 }));
    afficher(`${pages.lienConnexion.path}?jeton=${'b'.repeat(64)}`);

    expect(await screen.findByRole('alert')).toHaveTextContent('Ce lien a expiré ou a déjà servi.');
    expect(screen.getByRole('link', { name: 'Recevoir un nouveau lien' })).toHaveAttribute('href', pages.connexion.path);
  });

  it('signale un lien incomplet sans appeler l’API', () => {
    const appels = simulerApi(() => ({ statut: 500 }));
    afficher(pages.lienConnexion.path);

    expect(screen.getByRole('alert')).toHaveTextContent('Ce lien est incomplet.');
    expect(appels).toHaveLength(0);
  });
});

describe('Mot de passe', () => {
  it('sans lien : demande le lien par mail', async () => {
    const user = userEvent.setup();
    const appels = simulerApi(() => ({ statut: 202, corps: { ok: true } }));
    afficher(pages.motDePasse.path);

    await user.type(screen.getByLabelText(/E-mail/), 'marie@exemple.fr');
    await user.click(screen.getByRole('button', { name: 'Recevoir le lien par mail' }));

    expect(await screen.findByRole('status')).toHaveTextContent('Il est valable 1 heure.');
    expect(appels[0].corps).toEqual({ email: 'marie@exemple.fr', usage: 'mot_de_passe' });
  });

  it('avec le lien : vérifie puis enregistre le nouveau mot de passe', async () => {
    const user = userEvent.setup();
    const appels = simulerApi(() => ({ statut: 204 }));
    afficher(`${pages.motDePasse.path}?jeton=${'c'.repeat(64)}`);

    await user.type(screen.getByLabelText(/Nouveau mot de passe/), 'court');
    await user.type(screen.getByLabelText(/Confirmez/), 'court');
    await user.click(screen.getByRole('button', { name: 'Enregistrer le mot de passe' }));
    expect(screen.getByText('Le mot de passe doit contenir au moins 12 caractères.')).toBeInTheDocument();
    expect(appels).toHaveLength(0);

    await user.clear(screen.getByLabelText(/Nouveau mot de passe/));
    await user.clear(screen.getByLabelText(/Confirmez/));
    await user.type(screen.getByLabelText(/Nouveau mot de passe/), 'une phrase de passe');
    await user.type(screen.getByLabelText(/Confirmez/), 'une phrase de passe');
    await user.click(screen.getByRole('button', { name: 'Enregistrer le mot de passe' }));

    expect(await screen.findByRole('status')).toHaveTextContent('Votre mot de passe est enregistré.');
    expect(appels[0].corps).toEqual({ jeton: 'c'.repeat(64), motDePasse: 'une phrase de passe' });
    expect(screen.getByRole('link', { name: 'Se connecter' })).toHaveAttribute('href', pages.connexion.path);
  });

  it('avec un lien expiré : propose d’en redemander un', async () => {
    const user = userEvent.setup();
    simulerApi(() => ({ statut: 410 }));
    afficher(`${pages.motDePasse.path}?jeton=${'d'.repeat(64)}`);

    await user.type(screen.getByLabelText(/Nouveau mot de passe/), 'une phrase de passe');
    await user.type(screen.getByLabelText(/Confirmez/), 'une phrase de passe');
    await user.click(screen.getByRole('button', { name: 'Enregistrer le mot de passe' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Ce lien a expiré ou a déjà servi.');
  });

  it('règle du mot de passe identique à celle de l’API', () => {
    expect(erreurMotDePasse('une phrase de passe', 'une phrase de passe')).toBeUndefined();
    expect(erreurMotDePasse('é'.repeat(12), 'é'.repeat(12))).toBeUndefined();
    expect(erreurMotDePasse(' '.repeat(12), ' '.repeat(12))).toMatch(/12 caractères/);
    expect(erreurMotDePasse('une phrase de passe', 'autre chose')).toBe('Les deux mots de passe ne sont pas identiques.');
  });
});

describe('Mon espace', () => {
  it('renvoie vers la connexion si personne n’est connecté', async () => {
    simulerApi(() => ({ statut: 401 }));
    afficher(pages.monEspace.path);

    expect(await screen.findByRole('heading', { level: 1, name: 'Connexion à votre espace' })).toBeInTheDocument();
  });

  it('affiche le compte, la sécurité et les appareils, puis déconnecte les autres', async () => {
    const user = userEvent.setup();
    let appareils = [
      { id: 's1', appareil: 'Firefox sur Linux', connecteLe: '2026-11-05T10:00:00+01:00', derniereActivite: '2026-11-05T10:00:00+01:00', courant: true },
      { id: 's2', appareil: 'Chrome sur Android', connecteLe: '2026-11-01T10:00:00+01:00', derniereActivite: '2026-11-03T10:00:00+01:00', courant: false },
    ];
    simulerApi((chemin) => {
      if (chemin === '/auth/moi') return { statut: 200, corps: { compte } };
      if (chemin === '/auth/appareils') return { statut: 200, corps: { appareils } };
      if (chemin === '/auth/appareils/deconnecter-les-autres') {
        appareils = appareils.filter((a) => a.courant);
        return { statut: 200, corps: { deconnectes: 1 } };
      }
      if (chemin === '/auth/lien') return { statut: 202, corps: { ok: true } };
      return { statut: 404 };
    });
    afficher(pages.monEspace.path);

    expect(await screen.findByRole('heading', { level: 1, name: 'Bonjour Marie Dupont' })).toBeInTheDocument();
    expect(screen.getByText(/Vous n’avez pas encore de mot de passe/)).toBeInTheDocument();
    expect(await screen.findByText('Chrome sur Android')).toBeInTheDocument();
    expect(screen.getByText('cet appareil')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Recevoir le lien par mail' }));
    expect(await screen.findByText('Lien envoyé à marie@exemple.fr. Pensez à vérifier vos indésirables.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Déconnecter les autres appareils' }));
    expect(await screen.findByText('1 appareil a été déconnecté.')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText('Chrome sur Android')).not.toBeInTheDocument());
    expect(screen.queryByRole('button', { name: 'Déconnecter les autres appareils' })).not.toBeInTheDocument();
  });

  it('indique la date du dernier changement de mot de passe', async () => {
    simulerApi((chemin) =>
      chemin === '/auth/moi'
        ? { statut: 200, corps: { compte: { ...compte, motDePasse: true, motDePasseModifieLe: '2026-09-02T10:00:00+02:00' } } }
        : { statut: 200, corps: { appareils: [] } },
    );
    afficher(pages.monEspace.path);

    expect(await screen.findByText(/Modifié le 2 septembre 2026\./)).toBeInTheDocument();
  });

  it('se déconnecte puis revient à la connexion', async () => {
    const user = userEvent.setup();
    let connecte = true;
    const appels = simulerApi((chemin) => {
      if (chemin === '/auth/deconnexion') {
        connecte = false;
        return { statut: 204 };
      }
      if (chemin === '/auth/moi') return connecte ? { statut: 200, corps: { compte } } : { statut: 401 };
      return { statut: 200, corps: { appareils: [] } };
    });
    afficher(pages.monEspace.path);

    await user.click(await screen.findByRole('button', { name: 'Se déconnecter' }));

    expect(await screen.findByRole('heading', { level: 1, name: 'Connexion à votre espace' })).toBeInTheDocument();
    expect(appels.find((a) => a.chemin === '/auth/deconnexion')?.methode).toBe('POST');
  });
});
