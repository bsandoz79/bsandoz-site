import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CLE_SESSION, reinitialiserEdition } from '../../app/edition';
import { hero } from '../../data/accueil';
import { blocs } from '../../data/blocs';
import { medias } from '../../data/medias';
import { formatPrix, formuleParId, prixDepart } from '../../data/offres';
import { reinitialiserPrix } from '../../data/prixEnLigne';
import { BlocModifiable } from './BlocModifiable';

vi.mock('../../app/image', () => ({ imageEnBase64: vi.fn(async () => 'QUJD') }));

const vitrinePlus = formuleParId('vitrinePlus');
const badgeInitial = hero.badge;
const portraitInitial = medias.portrait;

function Carte() {
  return (
    <article>
      <h3>{hero.badge}</h3>
      <p>{formatPrix(prixDepart())}</p>
    </article>
  );
}
function Photo() {
  return <img src={medias.portrait} alt="Photo affichée" />;
}
const afficherCarte = () =>
  render(
    <BlocModifiable id="accueil.hero">
      <Carte />
    </BlocModifiable>,
  );

/** API simulée : accès au back-office selon `acces`, enregistrements selon `enregistrement`. */
function api({ acces = 200, enregistrement = 200 } = {}) {
  const envois: Record<string, unknown[]> = {};
  const fetchMock = vi.fn(async (url: string, init: RequestInit = {}) => {
    const chemin = new URL(String(url)).pathname;
    if (chemin === '/backoffice/demandes') return new Response(JSON.stringify({ demandes: [] }), { status: acces });
    (envois[chemin] ??= []).push(JSON.parse(String(init.body)));
    if (chemin === '/backoffice/images') return new Response(JSON.stringify({ url: 'https://api.exemple.fr/medias/x.webp' }), { status: enregistrement });
    return new Response('{}', { status: enregistrement });
  });
  vi.stubGlobal('fetch', fetchMock);
  return { envois, fetchMock };
}

const crayon = (titre = 'Haut de page') => screen.findByRole('button', { name: `Modifier ce bloc : ${titre}` });
const panneau = () => screen.findByRole('dialog');

describe('BlocModifiable', () => {
  beforeEach(() => {
    window.localStorage.clear();
    reinitialiserEdition();
    reinitialiserPrix();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    reinitialiserPrix();
    hero.badge = badgeInitial;
    medias.portrait = portraitInitial;
  });

  it('visiteur sans session : le bloc seul, sans élément en plus et sans appel', async () => {
    const { fetchMock } = api();
    const { container } = afficherCarte();
    await new Promise((r) => setTimeout(r, 0));
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(container.firstElementChild?.tagName).toBe('ARTICLE');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('compte sans le rôle : pas de crayon', async () => {
    window.localStorage.setItem(CLE_SESSION, '1');
    const { fetchMock } = api({ acces: 403 });
    afficherCarte();
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    await new Promise((r) => setTimeout(r, 0));
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('session expirée : pas de crayon, et on ne redemande plus', async () => {
    window.localStorage.setItem(CLE_SESSION, '1');
    api({ acces: 401 });
    afficherCarte();
    await waitFor(() => expect(window.localStorage.getItem(CLE_SESSION)).toBeNull());
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('bon rôle : le panneau montre tout le bloc, et enregistre texte et prix d’un coup', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(CLE_SESSION, '1');
    const { envois } = api();
    afficherCarte();
    await user.click(await crayon());
    const fenetre = within(await panneau());
    expect(fenetre.getByRole('textbox', { name: 'Grand titre' })).toBeInTheDocument();
    expect(fenetre.getByRole('textbox', { name: 'Garantie 1' })).toBeInTheDocument();

    const nom = fenetre.getByRole('textbox', { name: 'Petite étiquette' });
    await user.clear(nom);
    await user.type(nom, 'Essentiel');
    const prix = fenetre.getByRole('textbox', { name: 'Prix « à partir de » (€)' });
    await user.clear(prix);
    await user.type(prix, '429');
    await user.click(fenetre.getByRole('button', { name: 'Enregistrer' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(envois['/backoffice/contenus']).toEqual([{ contenus: { 'accueil.hero.badge': 'Essentiel' } }]);
    expect(envois['/backoffice/prix']).toEqual([{ prix: { 'formule.vitrinePlus': 429 } }]);
    // La page change sur place.
    expect(screen.getByRole('heading', { name: 'Essentiel' })).toBeInTheDocument();
    expect(screen.getByText(/429/)).toBeInTheDocument();
  });

  it('revenir au texte du code efface la modification', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(CLE_SESSION, '1');
    const { envois } = api();
    hero.badge = 'Essentiel';
    afficherCarte();
    await user.click(await crayon());
    const nom = within(await panneau()).getByRole('textbox', { name: 'Petite étiquette' });
    await user.clear(nom);
    await user.type(nom, badgeInitial);
    await user.click(screen.getByRole('button', { name: 'Enregistrer' }));
    await waitFor(() => expect(envois['/backoffice/contenus']).toEqual([{ contenus: { 'accueil.hero.badge': null } }]));
  });

  it('remplace une image : envoi immédiat, puis enregistrée avec le reste', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(CLE_SESSION, '1');
    const { envois } = api();
    render(
      <BlocModifiable id="accueil.hero">
        <Photo />
      </BlocModifiable>,
    );
    await user.click(await crayon('Haut de page'));
    const fenetre = await panneau();
    await user.upload(fenetre.querySelector('input[type="file"]') as HTMLInputElement, new File(['x'], 'photo.png', { type: 'image/png' }));
    await waitFor(() => expect(envois['/backoffice/images']).toEqual([{ image: 'QUJD' }]));
    await waitFor(() => expect(fenetre.querySelector('img')).toHaveAttribute('src', 'https://api.exemple.fr/medias/x.webp'));
    await user.click(within(fenetre).getByRole('button', { name: 'Enregistrer' }));
    await waitFor(() => expect(screen.getByRole('img', { name: 'Photo affichée' })).toHaveAttribute('src', 'https://api.exemple.fr/medias/x.webp'));
    expect(envois['/backoffice/contenus']).toEqual([{ contenus: { 'media.portrait': 'https://api.exemple.fr/medias/x.webp' } }]);
  });

  it('Échap et Annuler referment sans rien enregistrer', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(CLE_SESSION, '1');
    const { envois } = api();
    afficherCarte();
    await user.click(await crayon());
    await panneau();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(await crayon());
    await user.click(within(await panneau()).getByRole('button', { name: 'Annuler' }));
    expect(envois).toEqual({});
  });

  it('refuse un prix invalide, et signale un échec de l’API sans rien changer', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(CLE_SESSION, '1');
    const { envois } = api({ enregistrement: 403 });
    afficherCarte();
    await user.click(await crayon());
    const fenetre = within(await panneau());
    const prix = fenetre.getByRole('textbox', { name: 'Prix « à partir de » (€)' });
    await user.clear(prix);
    await user.type(prix, 'abc');
    await user.click(fenetre.getByRole('button', { name: 'Enregistrer' }));
    expect(fenetre.getByRole('alert')).toHaveTextContent('euros entiers');
    expect(envois).toEqual({});

    await user.clear(prix);
    await user.type(prix, '150');
    await user.click(fenetre.getByRole('button', { name: 'Enregistrer' }));
    expect(await fenetre.findByRole('alert')).toHaveTextContent('n’a pas abouti');
    expect(vitrinePlus.prix).toBe(390);
  });

  it('chaque bloc du registre a des champs lisibles', () => {
    for (const bloc of Object.values(blocs)) {
      expect(bloc.champs.length).toBeGreaterThan(0);
      for (const c of bloc.champs) expect(c.lire()).not.toBe('undefined');
    }
  });
});
