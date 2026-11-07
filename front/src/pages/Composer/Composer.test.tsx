import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../../app/routes';
import { pages } from '../../data/pages';
import { CLE_STOCKAGE, CLE_VISITE } from './stockage';

function renderComposer(path: string = pages.composer.path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

const estimation = () => screen.getByRole('complementary', { name: 'Votre estimation' });
const stocke = () => JSON.parse(window.localStorage.getItem(CLE_STOCKAGE) ?? '{}');
const total = () => within(estimation()).getByText((_, el) => el?.getAttribute('aria-live') === 'polite');

/** Écrit le métier ; avec `choix`, clique la suggestion proposée. */
async function ecrireMetier(user: ReturnType<typeof userEvent.setup>, texte: string, choix?: string) {
  await user.type(screen.getByRole('combobox', { name: 'Votre métier' }), texte);
  if (choix) await user.click(screen.getByRole('option', { name: choix }));
}

describe('Configurateur /composer', () => {
  beforeEach(() => window.localStorage.clear());

  it('ouvre les étapes l’une après l’autre ; le métier se tape, avec des suggestions', async () => {
    const user = userEvent.setup();
    renderComposer();
    expect(screen.getByRole('heading', { level: 1, name: pages.composer.heading })).toBeInTheDocument();
    expect(screen.queryByRole('combobox', { name: 'Votre métier' })).not.toBeInTheDocument();
    expect(screen.queryByRole('complementary', { name: 'Votre estimation' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: /^Fonctionnel/ }));
    // Le Fonctionnel attend le métier avant de proposer des options.
    expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
    expect(estimation()).toHaveTextContent('Indiquez votre métier pour valider votre estimation.');

    await user.type(screen.getByRole('combobox', { name: 'Votre métier' }), 'me');
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(expect.arrayContaining(['Menuisier', 'Mécanicien']));
    await user.click(screen.getByRole('option', { name: 'Menuisier' }));
    expect(screen.getByRole('combobox', { name: 'Votre métier' })).toHaveValue('Menuisier');
    // Artisan : ses gros modules, puis les petites options.
    expect(screen.getByRole('checkbox', { name: /Rendez-vous en ligne/ })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /Logo simple/ })).toBeInTheDocument();
    expect(within(estimation()).getByRole('button', { name: 'Valider et recevoir mon devis' })).toBeInTheDocument();
    expect(within(estimation()).getByRole('link', { name: 'En parler en rendez-vous' })).toHaveAttribute('href', pages.rendezVous.path);
  });

  it('inclut une petite option en Vitrine ; la suivante est payante', async () => {
    const user = userEvent.setup();
    renderComposer();
    await user.click(screen.getByRole('radio', { name: /^Vitrine\s*à partir de 99/ }));
    const groupe = screen.getByRole('group', { name: /Envie d'ajouter quelque chose/ });
    expect(groupe).toHaveTextContent('1 option incluse dans la formule');
    await user.click(screen.getByRole('checkbox', { name: /Galerie photos/ }));
    expect(screen.getByRole('checkbox', { name: /Galerie photos/ })).toHaveAccessibleName(/Inclus/);
    expect(total()).toHaveTextContent(/99\s€/);
    expect(groupe).toHaveTextContent('Options incluses choisies');
    await user.click(screen.getByRole('checkbox', { name: /Page supplémentaire/ }));
    expect(total()).toHaveTextContent(/149\s€/);
    expect(estimation()).not.toHaveTextContent('Fourchette');
  });

  it('pose les précisions des options concernées et ajoute leur supplément', async () => {
    const user = userEvent.setup();
    renderComposer();
    await user.click(screen.getByRole('radio', { name: /^Fonctionnel/ }));
    await ecrireMetier(user, 'pizz', 'Pizzeria');
    await user.click(screen.getByRole('checkbox', { name: /Réservation de table/ }));
    const question = screen.getByRole('group', { name: /Un acompte pour les grandes tablées/ });
    await user.click(within(question).getByRole('radio', { name: /Oui \(\+ 150/ }));
    expect(screen.getByText(/Acompte demandé au-delà d'un nombre de couverts/)).toBeInTheDocument();
    expect(estimation()).toHaveTextContent('Réservation de table · Oui');
  });

  it('Vitrine+ : deux petites options incluses ; un gros module n’est jamais inclus', async () => {
    const user = userEvent.setup();
    renderComposer();
    await user.click(screen.getByRole('radio', { name: /^Vitrine\+/ }));
    for (const nom of [/Logo simple/, /SEO avancé/, /Site en anglais/]) await user.click(screen.getByRole('checkbox', { name: nom }));
    expect(total()).toHaveTextContent(/540\s€/);
    expect(estimation()).toHaveTextContent(/Valeur 840\s€/);

    await user.click(screen.getByRole('radio', { name: /^Fonctionnel/ }));
    await ecrireMetier(user, 'Ostéopathe');
    await user.click(screen.getByRole('checkbox', { name: /Rendez-vous en ligne/ }));
    expect(screen.getByRole('checkbox', { name: /Rendez-vous en ligne/ })).not.toHaveAccessibleName(/Inclus/);
  });

  it('compare au marché en citant la source', async () => {
    const user = userEvent.setup();
    renderComposer();
    await user.click(screen.getByRole('radio', { name: /^Vitrine\+/ }));
    expect(estimation()).toHaveTextContent('Marché : 800 – 4 000 €');
    expect(estimation()).toHaveTextContent(/Soit 410\s€ de moins que le bas de la fourchette du marché\./);
    expect(estimation()).toHaveTextContent('Source : Plateya, 2026.');
  });

  it('préremplit la formule depuis l’adresse et mémorise les choix', async () => {
    const user = userEvent.setup();
    renderComposer('/composer?formule=vitrinePlus');
    expect(screen.getByRole('radio', { name: /^Vitrine\+/ })).toBeChecked();
    await user.click(screen.getByRole('checkbox', { name: /SEO avancé/ }));
    expect(stocke().config).toMatchObject({ formule: 'vitrinePlus', options: ['seo'] });
  });

  it('reprend une configuration enregistrée, puis recommence à zéro', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      CLE_STOCKAGE,
      JSON.stringify({ config: { formule: 'fonctionnel', metier: 'artisan', options: ['rdv'], precisions: {} } }),
    );
    renderComposer();
    expect(screen.getByRole('checkbox', { name: /Rendez-vous en ligne/ })).toBeChecked();
    await user.click(within(estimation()).getByRole('button', { name: 'Recommencer' }));
    expect(screen.getAllByRole('radio').every((radio) => !(radio as HTMLInputElement).checked)).toBe(true);
    expect(stocke().config).toEqual({ formule: null, metier: null, options: [], precisions: {} });
  });

  describe('aperçu en direct', () => {
    const apercu = () => screen.getByRole('complementary', { name: 'Aperçu de votre futur site' });

    it('se remplit au fil des choix et annonce ce qu’il montre', async () => {
      const user = userEvent.setup();
      renderComposer();
      expect(apercu()).toHaveTextContent("Choisissez un type de site : l'aperçu se remplit au fil de vos choix.");

      await user.click(screen.getByRole('radio', { name: /^Fonctionnel/ }));
      await ecrireMetier(user, 'Ostéopathe');
      expect(apercu()).toHaveTextContent('Studio Équilibre');
      // Un squelette d'exemple, pas le site final.
      expect(apercu()).toHaveTextContent('Exemple · squelette sans style');
      expect(apercu()).toHaveTextContent('www.studio-equilibre.fr');

      await user.click(screen.getByRole('checkbox', { name: /Rendez-vous en ligne/ }));
      expect(apercu()).toHaveTextContent('Réservez en ligne');
      expect(within(apercu()).getByText(/Aperçu d'exemple du site « Studio Équilibre », avec : rendez-vous en ligne\./)).toHaveAttribute(
        'aria-live',
        'polite',
      );
    });

    it('laisse place au « bon à savoir » dans l’onglet informatique', async () => {
      const user = userEvent.setup();
      renderComposer();
      await user.click(screen.getByRole('tab', { name: 'Informatique sur place' }));
      expect(screen.queryByRole('complementary', { name: 'Aperçu de votre futur site' })).not.toBeInTheDocument();
      const bon = screen.getByRole('complementary', { name: 'Bon à savoir' });
      expect(bon).toHaveTextContent('Windows 10 n\'est plus mis à jour depuis octobre 2025.');
      expect(within(bon).getAllByRole('listitem')).toHaveLength(3);
    });
  });

  describe('onglets', () => {
    it('passe à l’informatique au clavier, avec les flèches', async () => {
      const user = userEvent.setup();
      renderComposer();
      const web = screen.getByRole('tab', { name: 'Sites & applis' });
      expect(web).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('tabpanel')).toHaveAccessibleName('Sites & applis');
      web.focus();
      await user.keyboard('{ArrowRight}');
      const informatique = screen.getByRole('tab', { name: 'Informatique sur place' });
      expect(informatique).toHaveAttribute('aria-selected', 'true');
      expect(informatique).toHaveFocus();
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Votre informatique, installée et réglée chez vous.');
    });

    it('informatique : prestations sans prix, réseau bientôt disponible', async () => {
      const user = userEvent.setup();
      renderComposer();
      await user.click(screen.getByRole('tab', { name: 'Informatique sur place' }));
      const demande = screen.getByRole('complementary', { name: 'Votre demande' });
      expect(demande).toHaveTextContent('Tarif sur devis');
      expect(demande).toHaveTextContent('Choisissez une ou plusieurs prestations.');

      await user.click(screen.getByRole('radio', { name: 'Professionnel' }));
      await user.click(screen.getByRole('checkbox', { name: /Passage de Windows à Linux/ }));
      expect(demande).toHaveTextContent('Votre demande · professionnel');
      expect(within(demande).getByRole('listitem')).toHaveTextContent('Passage de Windows à Linux');
      expect(screen.getByRole('checkbox', { name: /Réseau et NAS/ })).toBeDisabled();
      expect(within(demande).getByRole('link', { name: 'Prendre rendez-vous (gratuit)' })).toHaveAttribute(
        'href',
        pages.rendezVous.path,
      );
    });
  });

  it('un métier hors de la liste est gardé tel qu’il est écrit, repris dans l’estimation', async () => {
    const user = userEvent.setup();
    renderComposer();
    await user.click(screen.getByRole('radio', { name: /^Fonctionnel/ }));
    await ecrireMetier(user, 'Sculpteur sur bois');
    expect(estimation()).toHaveTextContent('sculpteur sur bois');
    expect(stocke().config).toMatchObject({ metier: 'autre', metierAutre: 'Sculpteur sur bois' });
  });

  it('« Valider » ouvre le formulaire, avec l’estimation jointe et le métier repris, puis l’envoie comme une demande de devis', async () => {
    const user = userEvent.setup();
    const envoi = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal('fetch', envoi);
    renderComposer();
    await user.click(screen.getByRole('radio', { name: /^Vitrine\+/ }));
    await ecrireMetier(user, 'plomb', 'Plombier');
    await user.click(screen.getByRole('checkbox', { name: /Logo simple/ }));
    await user.click(within(estimation()).getByRole('button', { name: 'Valider et recevoir mon devis' }));

    const formulaire = screen.getByRole('form', { name: 'Où vous envoyer votre devis ?' });
    expect(formulaire).toHaveTextContent('Votre estimation, jointe à la demande');
    expect(formulaire).toHaveTextContent('Site Vitrine+');
    expect(within(formulaire).getByRole('combobox', { name: /Votre métier ou activité/ })).toHaveValue('Plombier');
    await user.type(within(formulaire).getByRole('textbox', { name: /Prénom et nom/ }), 'Marie Dupont');
    await user.type(within(formulaire).getByRole('textbox', { name: /E-mail/ }), 'marie@exemple.fr');
    await user.type(within(formulaire).getByRole('textbox', { name: /Téléphone/ }), '06 12 34 56 78');
    await user.click(within(formulaire).getByRole('checkbox', { name: /J'accepte/ }));
    await user.click(within(formulaire).getByRole('button', { name: 'Envoyer ma demande' }));

    expect(await screen.findByText('Merci, c’est bien reçu !')).toBeInTheDocument();
    const donnees = envoi.mock.calls[0][1].body as FormData;
    expect(donnees.get('titre')).toBe('Site Vitrine+ · Logo simple');
    expect(String(donnees.get('recapitulatif'))).toContain('Origine : Estimation en ligne');
    expect(String(donnees.get('predevis'))).toContain('Logo simple (incluse)');
    vi.unstubAllGlobals();
  }, 20_000);

  describe('reprendre là où l’on en était', () => {
    const precedente = { onglet: 'web', config: { formule: 'fonctionnel', metier: 'artisan', options: ['rdv'], precisions: {} } };
    const fenetre = () => screen.queryByRole('dialog', { name: 'Voulez-vous reprendre là où vous en étiez ?' });
    beforeEach(() => {
      window.sessionStorage.clear();
      window.localStorage.setItem(CLE_STOCKAGE, JSON.stringify(precedente));
    });

    it('nouvelle visite : demande, avec le résumé, et « Oui » reprend l’estimation', async () => {
      const user = userEvent.setup();
      renderComposer();
      expect(fenetre()).toHaveTextContent('Site Fonctionnel · artisan à domicile · 1 option');
      expect(screen.getByRole('button', { name: 'Oui, reprendre' })).toHaveFocus();
      await user.click(screen.getByRole('button', { name: 'Oui, reprendre' }));
      expect(fenetre()).not.toBeInTheDocument();
      expect(screen.getByRole('checkbox', { name: /Rendez-vous en ligne/ })).toBeChecked();
      expect(window.sessionStorage.getItem(CLE_VISITE)).toBe('1');
    });

    it('« Non » repart de zéro, en gardant la formule demandée par le lien', async () => {
      const user = userEvent.setup();
      renderComposer(`${pages.composer.path}?formule=vitrine`);
      await user.click(screen.getByRole('button', { name: 'Non, recommencer' }));
      expect(fenetre()).not.toBeInTheDocument();
      expect(stocke().config).toEqual({ formule: 'vitrine', metier: null, options: [], precisions: {} });
    });

    it('Échap reprend sans rien effacer ; le focus reste dans la fenêtre', async () => {
      const user = userEvent.setup();
      renderComposer();
      await user.tab();
      expect(screen.getByRole('button', { name: 'Non, recommencer' })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('button', { name: 'Oui, reprendre' })).toHaveFocus();
      await user.keyboard('{Escape}');
      expect(fenetre()).not.toBeInTheDocument();
      expect(stocke().config.options).toEqual(['rdv']);
    });

    it('même visite, ou rien d’enregistré : pas de question', () => {
      window.sessionStorage.setItem(CLE_VISITE, '1');
      const { unmount } = renderComposer();
      expect(fenetre()).not.toBeInTheDocument();
      unmount();
      window.sessionStorage.clear();
      window.localStorage.clear();
      renderComposer();
      expect(fenetre()).not.toBeInTheDocument();
    });
  });
});
