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

const vitrine = formuleParId('vitrine');
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

  it('bon rôle : « Modifier » encadre ce qui se modifie ; un clic sur le texte puis sur le prix, et on enregistre', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(CLE_SESSION, '1');
    const { envois } = api();
    afficherCarte();
    await user.click(await crayon());
    // Plus de panneau latéral : une barre sur le bloc, et un cadre sur chaque texte et prix affichés.
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    const barre = await screen.findByRole('group', { name: 'Modification : Haut de page' });

    await user.click(screen.getByRole('button', { name: 'Modifier : Petite étiquette' }));
    const texte = screen.getByRole('textbox', { name: 'Petite étiquette' });
    expect(texte).toHaveValue(badgeInitial);
    await user.clear(texte);
    await user.type(texte, 'Essentiel');
    await user.click(screen.getByRole('button', { name: 'Valider' }));
    // Le changement se voit tout de suite dans la page.
    expect(screen.getByRole('heading', { name: 'Essentiel' })).toBeInTheDocument();

    await user.click(await screen.findByRole('button', { name: 'Modifier : Prix « à partir de » (€)' }));
    const prix = screen.getByRole('textbox', { name: 'Prix « à partir de » (€)' });
    await user.clear(prix);
    await user.type(prix, '129');
    await user.click(screen.getByRole('button', { name: 'Valider' }));
    expect(screen.getByText(/129/)).toBeInTheDocument();
    expect(barre).toHaveTextContent('2 changements à enregistrer');

    await user.click(within(barre).getByRole('button', { name: 'Enregistrer' }));
    await waitFor(() => expect(screen.queryByRole('group', { name: /Modification/ })).not.toBeInTheDocument());
    expect(envois['/backoffice/contenus']).toEqual([{ contenus: { 'accueil.hero.badge': 'Essentiel' } }]);
    expect(envois['/backoffice/prix']).toEqual([{ prix: { 'formule.vitrine': 129 } }]);
    expect(screen.getByRole('heading', { name: 'Essentiel' })).toBeInTheDocument();
  });

  it('revenir au texte du code efface la modification', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(CLE_SESSION, '1');
    const { envois } = api();
    hero.badge = 'Essentiel';
    afficherCarte();
    await user.click(await crayon());
    await user.click(await screen.findByRole('button', { name: 'Modifier : Petite étiquette' }));
    const texte = screen.getByRole('textbox', { name: 'Petite étiquette' });
    await user.clear(texte);
    await user.type(texte, badgeInitial);
    await user.click(screen.getByRole('button', { name: 'Valider' }));
    await user.click(screen.getByRole('button', { name: 'Enregistrer' }));
    await waitFor(() => expect(envois['/backoffice/contenus']).toEqual([{ contenus: { 'accueil.hero.badge': null } }]));
  });

  it('remplace une image d’un clic dessus, puis l’enregistre avec le reste', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(CLE_SESSION, '1');
    const { envois } = api();
    render(
      <BlocModifiable id="accueil.hero">
        <Photo />
      </BlocModifiable>,
    );
    await user.click(await crayon('Haut de page'));
    await user.click(await screen.findByRole('button', { name: 'Modifier : Grande photo' }));
    const bulle = screen.getByRole('form', { name: 'Modifier : Grande photo' });
    await user.upload(bulle.querySelector('input[type="file"]') as HTMLInputElement, new File(['x'], 'photo.png', { type: 'image/png' }));
    await waitFor(() => expect(envois['/backoffice/images']).toEqual([{ image: 'QUJD' }]));
    await waitFor(() => expect(screen.getByRole('img', { name: 'Photo affichée' })).toHaveAttribute('src', 'https://api.exemple.fr/medias/x.webp'));
    await user.click(screen.getByRole('button', { name: 'Enregistrer' }));
    await waitFor(() => expect(envois['/backoffice/contenus']).toEqual([{ contenus: { 'media.portrait': 'https://api.exemple.fr/medias/x.webp' } }]));
  });

  it('Annuler et Échap remettent la page comme avant, sans rien enregistrer', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(CLE_SESSION, '1');
    const { envois } = api();
    afficherCarte();
    await user.click(await crayon());
    await user.click(await screen.findByRole('button', { name: 'Modifier : Petite étiquette' }));
    const texte = screen.getByRole('textbox', { name: 'Petite étiquette' });
    await user.clear(texte);
    await user.type(texte, 'Brouillon');
    await user.click(screen.getByRole('button', { name: 'Valider' }));
    expect(screen.getByRole('heading', { name: 'Brouillon' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Annuler' }));
    expect(screen.getByRole('heading', { name: badgeInitial })).toBeInTheDocument();
    expect(hero.badge).toBe(badgeInitial);

    await user.click(await crayon());
    await screen.findByRole('group', { name: /Modification/ });
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('group', { name: /Modification/ })).not.toBeInTheDocument();
    expect(envois).toEqual({});
  });

  it('montre les textes invisibles sur la page dans « Autres textes »', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(CLE_SESSION, '1');
    api();
    afficherCarte();
    await user.click(await crayon());
    const autres = await screen.findByRole('button', { name: /Autres textes/ });
    await user.click(autres);
    expect(screen.getByRole('textbox', { name: 'Grand titre' })).toBeInTheDocument();
  });

  it('refuse un prix invalide, et signale un échec de l’API sans rien enregistrer', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(CLE_SESSION, '1');
    const { envois } = api({ enregistrement: 403 });
    afficherCarte();
    await user.click(await crayon());
    await user.click(await screen.findByRole('button', { name: 'Modifier : Prix « à partir de » (€)' }));
    const prix = screen.getByRole('textbox', { name: 'Prix « à partir de » (€)' });
    await user.clear(prix);
    await user.type(prix, 'abc');
    await user.click(screen.getByRole('button', { name: 'Valider' }));
    expect(screen.getByRole('alert')).toHaveTextContent('euros entiers');

    await user.clear(prix);
    await user.type(prix, '150');
    await user.click(screen.getByRole('button', { name: 'Valider' }));
    await user.click(screen.getByRole('button', { name: 'Enregistrer' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('n’a pas abouti');
    // L'envoi a été refusé : on reste en modification, rien n'est perdu.
    expect(envois['/backoffice/prix']).toEqual([{ prix: { 'formule.vitrine': 150 } }]);
    expect(screen.getByRole('group', { name: 'Modification : Haut de page' })).toBeInTheDocument();
    expect(vitrine.prix).toBe(150);
  });

  it('chaque bloc du registre a des champs lisibles', () => {
    for (const bloc of Object.values(blocs)) {
      expect(bloc.champs.length).toBeGreaterThan(0);
      for (const c of bloc.champs) expect(c.lire()).not.toBe('undefined');
    }
  });
});
