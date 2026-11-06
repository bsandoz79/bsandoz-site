import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../../app/routes';
import { pages } from '../../data/pages';
import { CLE_STOCKAGE } from '../Composer/stockage';
import { CLE_BROUILLON } from './demande';

function renderDevis() {
  return render(
    <MemoryRouter initialEntries={[pages.devis.path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

const continuer = () => screen.getByRole('button', { name: 'Continuer →' });
const etapeEnCours = () =>
  within(screen.getByRole('list', { name: 'Étapes de la demande' })).getByRole('listitem', { current: 'step' });

/** Réseau simulé : le géocodage trouve Abbeville (dans la zone), l'envoi du devis répond `envoi`. */
function reseau(envoi: () => Promise<Response>) {
  return vi.fn((url: string) =>
    String(url).includes('geopf')
      ? Promise.resolve(
          new Response(
            JSON.stringify({
              features: [{ geometry: { coordinates: [1.8336, 50.1054] }, properties: { city: 'Abbeville', label: '12 rue de la Gare 80100 Abbeville', score: 0.9 } }],
            }),
          ),
        )
      : envoi(),
  );
}

const appelsDevis = (fetchMock: ReturnType<typeof vi.fn>) => fetchMock.mock.calls.filter(([url]) => url === '/api/devis.php');

async function remplirJusquAuxCoordonnees(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('radio', { name: 'Artisan à domicile' }));
  await user.click(continuer());
  await user.click(screen.getByRole('checkbox', { name: /Prendre des rendez-vous/ }));
  await user.click(continuer());
  await user.type(screen.getByRole('textbox', { name: /Votre projet/ }), 'Je fais du detailing auto à domicile.');
  await user.click(continuer());
  await user.click(screen.getByRole('radio', { name: '1 000 à 2 000 €' }));
  await user.click(screen.getByRole('radio', { name: 'Dans le mois' }));
  await user.click(continuer());
}

describe('Parcours de demande de devis', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('avance étape par étape, avec la progression', async () => {
    const user = userEvent.setup();
    renderDevis();
    expect(etapeEnCours()).toHaveTextContent('Activité');
    await remplirJusquAuxCoordonnees(user);
    expect(etapeEnCours()).toHaveTextContent('Coordonnées');
    expect(screen.getByRole('heading', { level: 2, name: 'Où vous répondre ?' })).toHaveFocus();
  });

  it('bloque l’étape tant qu’elle est incomplète et explique pourquoi', async () => {
    const user = userEvent.setup();
    renderDevis();
    await user.click(continuer());
    expect(screen.getByRole('alert')).toHaveTextContent('Un champ est à corriger.');
    expect(screen.getByText('Choisissez votre activité.')).toBeInTheDocument();
    expect(etapeEnCours()).toHaveTextContent('Activité');

    await user.click(screen.getByRole('radio', { name: 'Commerce / e-commerce' }));
    expect(screen.queryByText('Choisissez votre activité.')).not.toBeInTheDocument();
  });

  it('revient en arrière sans perdre les réponses', async () => {
    const user = userEvent.setup();
    renderDevis();
    await user.click(screen.getByRole('radio', { name: 'Restaurant / bar' }));
    await user.click(continuer());
    await user.click(screen.getByRole('button', { name: '← Retour' }));
    expect(screen.getByRole('radio', { name: 'Restaurant / bar' })).toBeChecked();
  });

  it('garde un brouillon dans le navigateur et le reprend', async () => {
    const user = userEvent.setup();
    const { unmount } = renderDevis();
    await user.click(screen.getByRole('radio', { name: 'Santé / bien-être' }));
    await user.click(continuer());
    unmount();
    expect(JSON.parse(window.localStorage.getItem(CLE_BROUILLON) ?? '{}')).toMatchObject({
      etape: 1,
      demande: { metier: 'sante' },
    });
    renderDevis();
    expect(etapeEnCours()).toHaveTextContent('Besoins');
    expect(screen.getByRole('complementary', { name: 'Votre projet' })).toHaveTextContent('Santé / bien-être');
  });

  it('reprend l’estimation : choix déjà cochés, ouverture sur la première question à remplir', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      CLE_STOCKAGE,
      JSON.stringify({ config: { formule: 'fonctionnel', metier: 'artisan', options: ['rdv'], precisions: {} } }),
    );
    renderDevis();
    expect(screen.getByRole('status')).toHaveTextContent('Repris de votre estimation : Site Fonctionnel · Rendez-vous en ligne');
    expect(screen.getByRole('complementary', { name: 'Votre projet' })).toHaveTextContent(/1\s320\s€ – 1\s530\s€/);
    expect(etapeEnCours()).toHaveTextContent('Avec vos mots');
    // L'estimation dit déjà ce que le site doit faire : pas d'étape « Besoins ».
    const etapes = within(screen.getByRole('list', { name: 'Étapes de la demande' })).getAllByRole('listitem');
    expect(etapes.map((e) => e.textContent)).not.toContain(expect.stringContaining('Besoins'));
    expect(etapes).toHaveLength(4);
    expect(screen.getByText('Étape 2 sur 4')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '← Retour' }));
    expect(screen.getByRole('radio', { name: 'Artisan à domicile' })).toBeChecked();
    expect(screen.queryByRole('checkbox', { name: /Prendre des rendez-vous/ })).not.toBeInTheDocument();
  });

  it('une autre simulation repart de zéro (rien des essais précédents) ; la même estimation reprend là où l’on s’était arrêté', async () => {
    const user = userEvent.setup();
    const estimation = (options: string[]) =>
      window.localStorage.setItem(CLE_STOCKAGE, JSON.stringify({ config: { formule: 'fonctionnel', metier: 'artisan', options, precisions: {} } }));
    estimation(['rdv']);
    const { unmount } = renderDevis();
    await user.type(screen.getByRole('textbox', { name: /Votre projet/ }), 'Je fais du detailing auto à domicile.');
    await user.click(continuer());
    expect(etapeEnCours()).toHaveTextContent('Budget et délai');
    unmount();

    // Même estimation : on revient à la même étape.
    const second = renderDevis();
    expect(etapeEnCours()).toHaveTextContent('Budget et délai');
    second.unmount();

    // Nouvelle simulation (calculateur de prix) : devis neuf, seuls les choix de cette simulation sont cochés.
    estimation(['calcul']);
    renderDevis();
    expect(screen.getByRole('status')).toHaveTextContent('Calculateur de prix');
    expect(etapeEnCours()).toHaveTextContent('Avec vos mots');
    expect(screen.getByRole('textbox', { name: /Votre projet/ })).toHaveValue('');
  });

  it('« Repartir de zéro » revient à la première question, sans les choix', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      CLE_STOCKAGE,
      JSON.stringify({ config: { formule: 'fonctionnel', metier: 'artisan', options: ['rdv'], precisions: {} } }),
    );
    renderDevis();
    await user.click(screen.getByRole('button', { name: 'Repartir de zéro' }));
    expect(etapeEnCours()).toHaveTextContent('Activité');
    expect(screen.getByRole('radio', { name: 'Artisan à domicile' })).not.toBeChecked();
    expect(screen.queryByRole('button', { name: 'Repartir de zéro' })).not.toBeInTheDocument();
    // Sans estimation reprise, l'étape « Besoins » revient.
    await user.click(screen.getByRole('radio', { name: 'Artisan à domicile' }));
    await user.click(continuer());
    expect(etapeEnCours()).toHaveTextContent('Besoins');
  });

  it('exige les coordonnées et le consentement, puis envoie la demande', async () => {
    const user = userEvent.setup();
    const fetchMock = reseau(() => Promise.resolve(new Response(JSON.stringify({ ok: true }), { status: 200 })));
    vi.stubGlobal('fetch', fetchMock);
    renderDevis();
    await remplirJusquAuxCoordonnees(user);

    await user.click(screen.getByRole('button', { name: 'Envoyer ma demande' }));
    expect(screen.getByRole('alert')).toHaveTextContent('4 champs sont à corriger.');
    expect(fetchMock).not.toHaveBeenCalled();

    await user.type(screen.getByRole('textbox', { name: /Nom et prénom/ }), 'Marie Dupont');
    await user.type(screen.getByRole('textbox', { name: /E-mail/ }), 'marie@exemple.fr');
    await user.type(screen.getByRole('textbox', { name: /Votre adresse/ }), '12 rue de la Gare, Abbeville');
    await user.tab();
    // Sous le champ et dans le récapitulatif.
    expect(await screen.findAllByText(/Gratuit : à moins d’1 km d’Abbeville/)).toHaveLength(2);
    expect(screen.getByText('Je fais du detailing auto à domicile.')).toBeInTheDocument();
    await user.click(screen.getByRole('checkbox', { name: /J'accepte que mes informations/ }));
    await user.click(screen.getByRole('button', { name: 'Envoyer ma demande' }));

    expect(fetchMock).toHaveBeenCalledWith('/api/devis.php', expect.objectContaining({ method: 'POST' }));
    const envoi = (appelsDevis(fetchMock)[0] as unknown as [string, RequestInit])[1].body as FormData;
    expect(envoi.get('recapitulatif')).toContain('Activité : Artisan à domicile');
    expect(envoi.get('recapitulatif')).toContain('Adresse : 12 rue de la Gare, Abbeville');
    expect(envoi.get('recapitulatif')).toContain('Déplacement : Gratuit');
    expect(envoi.get('predevis')).toContain('Déplacement : Gratuit');
    expect(envoi.get('site_web')).toBe('');
    expect(envoi.get('predevis')).toContain('Formule conseillée : Fonctionnel');
    expect(await screen.findByRole('heading', { level: 1, name: 'Merci, votre demande est envoyée !' })).toBeInTheDocument();
    expect(screen.getByText(/première estimation, calculée d’après vos réponses/)).toBeInTheDocument();
    expect(window.localStorage.getItem(CLE_BROUILLON)).toBeNull();
  });

  it('garde les réponses et propose une solution si l’envoi échoue', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('réseau')));
    renderDevis();
    await remplirJusquAuxCoordonnees(user);
    await user.type(screen.getByRole('textbox', { name: /Nom et prénom/ }), 'Marie');
    await user.type(screen.getByRole('textbox', { name: /E-mail/ }), 'marie@exemple.fr');
    await user.type(screen.getByRole('textbox', { name: /Votre adresse/ }), 'Abbeville');
    await user.click(screen.getByRole('checkbox', { name: /J'accepte/ }));
    await user.click(screen.getByRole('button', { name: 'Envoyer ma demande' }));
    expect(await screen.findByText("La demande n'a pas pu être envoyée.")).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('contact@bsandoz.fr');
    expect(screen.getByRole('textbox', { name: /Nom et prénom/ })).toHaveValue('Marie');
  });

  it('demande de patienter entre deux envois', async () => {
    const user = userEvent.setup();
    const fetchMock = reseau(() => Promise.resolve(new Response('{}')));
    vi.stubGlobal('fetch', fetchMock);
    window.localStorage.setItem('bsandoz.devis.dernierEnvoi', String(Date.now()));
    renderDevis();
    await remplirJusquAuxCoordonnees(user);
    await user.type(screen.getByRole('textbox', { name: /Nom et prénom/ }), 'Marie');
    await user.type(screen.getByRole('textbox', { name: /E-mail/ }), 'marie@exemple.fr');
    await user.type(screen.getByRole('textbox', { name: /Votre adresse/ }), 'Abbeville');
    await user.click(screen.getByRole('checkbox', { name: /J'accepte/ }));
    await user.click(screen.getByRole('button', { name: 'Envoyer ma demande' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Merci de patienter une minute avant un nouvel envoi.');
    expect(appelsDevis(fetchMock)).toHaveLength(0);
  });

  it('« Autre activité » demande de préciser l’activité avant de continuer', async () => {
    const user = userEvent.setup();
    renderDevis();
    expect(screen.queryByRole('textbox', { name: /Précisez votre activité/ })).not.toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: 'Autre activité' }));
    const champ = screen.getByRole('textbox', { name: /Précisez votre activité/ });
    await user.click(continuer());
    expect(etapeEnCours()).toHaveTextContent('Activité');
    expect(screen.getByText('Précisez votre activité en quelques mots.')).toBeInTheDocument();
    await user.type(champ, 'Toiletteur canin');
    await user.click(continuer());
    expect(etapeEnCours()).toHaveTextContent('Besoins');
    expect(screen.getByRole('complementary', { name: 'Votre projet' })).toHaveTextContent('Toiletteur canin');
  });
});
