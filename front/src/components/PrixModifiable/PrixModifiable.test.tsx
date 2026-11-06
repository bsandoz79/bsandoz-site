import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CLE_SESSION, reinitialiserEdition } from '../../app/edition';
import { formatPrix, formuleParId } from '../../data/offres';
import { reinitialiserPrix } from '../../data/prixEnLigne';
import { PrixModifiable } from './PrixModifiable';

const vitrine = formuleParId('vitrine');

function afficher() {
  return render(
    <PrixModifiable cle="formule.vitrine" nom="Vitrine" montant={() => vitrine.prix}>
      {() => <p>{formatPrix(vitrine.prix)}</p>}
    </PrixModifiable>,
  );
}

/** API simulée : accès au back-office selon `acces`, enregistrement selon `enregistrement`. */
function api({ acces = 200, enregistrement = 200 } = {}) {
  const envois: unknown[] = [];
  const fetchMock = vi.fn(async (url: string, init: RequestInit = {}) => {
    if (String(url).endsWith('/backoffice/demandes')) return new Response(JSON.stringify({ demandes: [] }), { status: acces });
    envois.push(JSON.parse(String(init.body)));
    return new Response('{}', { status: enregistrement });
  });
  vi.stubGlobal('fetch', fetchMock);
  return { envois, fetchMock };
}

const crayon = () => screen.findByRole('button', { name: 'Modifier le prix : Vitrine' });
const champ = () => screen.getByRole('textbox', { name: 'Nouveau prix, en euros : Vitrine' });

describe('PrixModifiable', () => {
  beforeEach(() => {
    window.localStorage.clear();
    reinitialiserEdition();
    reinitialiserPrix();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    reinitialiserPrix();
  });

  it('visiteur sans session : le prix seul, et aucun appel à l’API', async () => {
    const { fetchMock } = api();
    afficher();
    expect(screen.getByText(/99/)).toBeInTheDocument();
    await new Promise((r) => setTimeout(r, 0));
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('compte connecté sans le rôle : pas de crayon', async () => {
    window.localStorage.setItem(CLE_SESSION, '1');
    const { fetchMock } = api({ acces: 403 });
    afficher();
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    await new Promise((r) => setTimeout(r, 0));
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('session expirée : pas de crayon, et on ne redemande plus', async () => {
    window.localStorage.setItem(CLE_SESSION, '1');
    api({ acces: 401 });
    afficher();
    await waitFor(() => expect(window.localStorage.getItem(CLE_SESSION)).toBeNull());
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('bon rôle : crayon, nouveau montant, Entrée, et le prix change sur place', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(CLE_SESSION, '1');
    const { envois } = api();
    afficher();
    await user.click(await crayon());
    expect(champ()).toHaveValue('99');
    await user.clear(champ());
    await user.type(champ(), '129{Enter}');
    expect(await screen.findByText(/129/)).toBeInTheDocument();
    expect(envois).toEqual([{ prix: { 'formule.vitrine': 129 } }]);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('revenir au prix du code le retire des prix modifiés', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(CLE_SESSION, '1');
    const { envois } = api();
    vitrine.prix = 129;
    afficher();
    await user.click(await crayon());
    await user.clear(champ());
    await user.type(champ(), '99{Enter}');
    await screen.findByText(/99/);
    expect(envois).toEqual([{ prix: {} }]);
  });

  it('Échap et Annuler referment sans rien enregistrer', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(CLE_SESSION, '1');
    const { envois } = api();
    afficher();
    await user.click(await crayon());
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    await user.click(await crayon());
    await user.click(screen.getByRole('button', { name: 'Annuler' }));
    expect(screen.getByText(/99/)).toBeInTheDocument();
    expect(envois).toEqual([]);
  });

  it('refuse un montant invalide, et signale un échec de l’API sans changer le prix', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(CLE_SESSION, '1');
    const { envois } = api({ enregistrement: 403 });
    afficher();
    await user.click(await crayon());
    await user.clear(champ());
    await user.type(champ(), 'abc{Enter}');
    expect(screen.getByRole('alert')).toHaveTextContent('euros entiers');
    expect(envois).toEqual([]);

    await user.clear(champ());
    await user.type(champ(), '150{Enter}');
    expect(await screen.findByRole('alert')).toHaveTextContent('n’a pas abouti');
    expect(vitrine.prix).toBe(99);
  });
});
