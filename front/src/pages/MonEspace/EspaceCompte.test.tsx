import { StrictMode } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { pages } from '../../data/pages';
import { ConfirmerEmail, ConfirmerSuppression } from '.';
import type { Compte } from './compte';
import { Confidentialite } from './Confidentialite';
import { MonCompteSection } from './MonCompteSection';
import { ZoneDanger } from './ZoneDanger';

const compte: Compte = {
  id: 'c1',
  email: 'marie@exemple.fr',
  nom: 'Marie Dupont',
  entreprise: '',
  telephone: '',
  adresse: '',
  notifications: true,
  statut: 'actif',
  motDePasse: false,
  motDePasseModifieLe: null,
};

type Appel = { chemin: string; corps: Record<string, unknown> };

/** Simule l'API : `reponses[chemin]` donne le code et le corps de la réponse. */
function simuler(reponses: Record<string, { statut: number; corps?: unknown }>) {
  const appels: Appel[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string, init: RequestInit = {}) => {
      const chemin = new URL(url).pathname;
      appels.push({ chemin, corps: init.body ? JSON.parse(String(init.body)) : {} });
      const r = reponses[chemin] ?? { statut: 404 };
      return new Response(r.corps === undefined ? null : JSON.stringify(r.corps), { status: r.statut });
    }),
  );
  return appels;
}

const dans = (element: React.ReactElement, chemin = '/') =>
  render(
    <StrictMode>
      <MemoryRouter initialEntries={[chemin]}>
        <Routes>
          <Route path="*" element={element} />
        </Routes>
      </MemoryRouter>
    </StrictMode>,
  );

afterEach(() => vi.unstubAllGlobals());

describe('Mon compte', () => {
  it('enregistre les coordonnées et prévient le parent', async () => {
    const user = userEvent.setup();
    const misAJour = { ...compte, entreprise: 'Dupont Jardins' };
    const appels = simuler({ '/auth/compte': { statut: 200, corps: { compte: misAJour } } });
    const onChange = vi.fn();
    dans(<MonCompteSection compte={compte} onChange={onChange} />);

    await user.type(screen.getByLabelText('Entreprise'), 'Dupont Jardins');
    await user.click(screen.getByRole('button', { name: 'Enregistrer' }));

    expect(await screen.findByText('Vos informations sont enregistrées.')).toBeInTheDocument();
    expect(appels[0].corps).toEqual({ nom: 'Marie Dupont', entreprise: 'Dupont Jardins', telephone: '', adresse: '', notifications: true });
    expect(onChange).toHaveBeenCalledWith(misAJour);
  });

  it('affiche les erreurs renvoyées par l’API sous chaque champ', async () => {
    const user = userEvent.setup();
    simuler({ '/auth/compte': { statut: 400, corps: { erreurs: { telephone: 'Numéro de téléphone invalide.' } } } });
    dans(<MonCompteSection compte={compte} onChange={vi.fn()} />);

    await user.type(screen.getByLabelText('Téléphone'), 'abc');
    await user.click(screen.getByRole('button', { name: 'Enregistrer' }));

    expect(await screen.findByText('Numéro de téléphone invalide.')).toBeInTheDocument();
    expect(screen.getByLabelText('Téléphone')).toHaveAttribute('aria-invalid', 'true');
  });

  it('envoie le lien de changement d’e-mail à la nouvelle adresse', async () => {
    const user = userEvent.setup();
    const appels = simuler({ '/auth/email': { statut: 202, corps: { ok: true } } });
    dans(<MonCompteSection compte={compte} onChange={vi.fn()} />);

    await user.type(screen.getByLabelText(/Nouvelle adresse e-mail/), 'marie@nouvelle.fr');
    await user.click(screen.getByRole('button', { name: 'Envoyer le lien de confirmation' }));

    expect(await screen.findByText(/Un lien de confirmation vient de partir à marie@nouvelle.fr/)).toBeInTheDocument();
    expect(appels[0]).toEqual({ chemin: '/auth/email', corps: { email: 'marie@nouvelle.fr' } });
  });

  it('explique pourquoi un changement d’e-mail est refusé', async () => {
    const user = userEvent.setup();
    simuler({ '/auth/email': { statut: 400, corps: { erreurs: { email: 'Cette adresse est déjà utilisée par un autre compte.' } } } });
    dans(<MonCompteSection compte={compte} onChange={vi.fn()} />);

    await user.type(screen.getByLabelText(/Nouvelle adresse e-mail/), 'paul@exemple.fr');
    await user.click(screen.getByRole('button', { name: 'Envoyer le lien de confirmation' }));

    expect(await screen.findByText('Cette adresse est déjà utilisée par un autre compte.')).toBeInTheDocument();
  });
});

describe('Confidentialité et préférences', () => {
  it('montre que la localisation a été refusée et explique comment la réactiver', async () => {
    vi.stubGlobal('navigator', { ...navigator, permissions: { query: vi.fn().mockResolvedValue({ state: 'denied' }) } });
    simuler({});
    dans(<Confidentialite compte={compte} onChange={vi.fn()} />);

    expect(await screen.findByText('Désactivée : vous l’avez refusée.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Autoriser la localisation' })).toBeInTheDocument();
    expect(screen.getByText(/icône cadenas/)).toBeInTheDocument();
  });

  it('enregistre la préférence de notifications', async () => {
    const user = userEvent.setup();
    const appels = simuler({ '/auth/compte': { statut: 200, corps: { compte: { ...compte, notifications: false } } } });
    const onChange = vi.fn();
    dans(<Confidentialite compte={compte} onChange={onChange} />);

    await user.click(screen.getByRole('checkbox', { name: /Rappels et notifications par mail/ }));

    expect(await screen.findByText('Préférence enregistrée.')).toBeInTheDocument();
    expect(appels[0].corps).toMatchObject({ notifications: false, nom: 'Marie Dupont' });
    expect(onChange).toHaveBeenCalledWith({ ...compte, notifications: false });
  });

  it('propose de télécharger toutes ses données', () => {
    simuler({});
    dans(<Confidentialite compte={compte} onChange={vi.fn()} />);

    expect(screen.getByRole('link', { name: 'Télécharger mes données' })).toHaveAttribute('href', 'https://api.bsandoz.fr/espace/donnees');
  });
});

describe('Zone danger', () => {
  it('demande confirmation, puis envoie le mail de confirmation', async () => {
    const user = userEvent.setup();
    const appels = simuler({ '/auth/suppression': { statut: 202, corps: { ok: true } } });
    dans(<ZoneDanger compte={compte} />);

    await user.click(screen.getByRole('button', { name: 'Supprimer mon compte' }));
    await user.click(screen.getByRole('button', { name: 'Garder mon compte' }));
    expect(appels).toHaveLength(0);

    await user.click(screen.getByRole('button', { name: 'Supprimer mon compte' }));
    await user.click(screen.getByRole('button', { name: 'Oui, m’envoyer le mail de confirmation' }));

    expect(await screen.findByRole('status')).toHaveTextContent('Un mail de confirmation vient de partir à marie@exemple.fr.');
    expect(appels.map((a) => a.chemin)).toEqual(['/auth/suppression']);
  });
});

describe('Confirmer la nouvelle adresse', () => {
  it('confirme une seule fois (même en StrictMode)', async () => {
    const appels = simuler({ '/auth/email/confirmer': { statut: 200, corps: { compte: { ...compte, email: 'marie@nouvelle.fr' } } } });
    dans(<ConfirmerEmail />, `${pages.confirmerEmail.path}?jeton=${'a'.repeat(64)}`);

    expect(await screen.findByText(/votre espace client utilise désormais marie@nouvelle.fr/)).toHaveAttribute('role', 'status');
    expect(appels).toHaveLength(1);
  });

  it('signale un lien expiré ou une adresse déjà prise', async () => {
    simuler({ '/auth/email/confirmer': { statut: 410 } });
    const { unmount } = dans(<ConfirmerEmail />, `${pages.confirmerEmail.path}?jeton=${'a'.repeat(64)}`);
    expect(await screen.findByRole('alert')).toHaveTextContent('Ce lien a expiré ou a déjà servi.');
    unmount();

    simuler({ '/auth/email/confirmer': { statut: 400, corps: { erreurs: { email: 'x' } } } });
    dans(<ConfirmerEmail />, `${pages.confirmerEmail.path}?jeton=${'b'.repeat(64)}`);
    expect(await screen.findByRole('alert')).toHaveTextContent('Cette adresse est déjà utilisée par un autre compte.');
  });
});

describe('Confirmer la suppression', () => {
  it('ne supprime rien à l’ouverture du lien, seulement au clic', async () => {
    const user = userEvent.setup();
    const appels = simuler({ '/auth/suppression/confirmer': { statut: 204 } });
    dans(<ConfirmerSuppression />, `${pages.suppression.path}?jeton=${'c'.repeat(64)}`);

    expect(screen.getByText(/supprimer définitivement votre espace client/)).toBeInTheDocument();
    expect(appels).toHaveLength(0);
    expect(screen.getByRole('link', { name: 'Garder mon compte' })).toHaveAttribute('href', pages.monEspace.path);

    await user.click(screen.getByRole('button', { name: 'Supprimer définitivement mon compte' }));

    expect(await screen.findByRole('status')).toHaveTextContent('Votre compte est supprimé.');
    expect(appels[0]).toEqual({ chemin: '/auth/suppression/confirmer', corps: { jeton: 'c'.repeat(64) } });
  });

  it('signale un lien expiré', async () => {
    const user = userEvent.setup();
    simuler({ '/auth/suppression/confirmer': { statut: 410 } });
    dans(<ConfirmerSuppression />, `${pages.suppression.path}?jeton=${'d'.repeat(64)}`);

    await user.click(screen.getByRole('button', { name: 'Supprimer définitivement mon compte' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Ce lien a expiré ou a déjà servi.');
  });
});
