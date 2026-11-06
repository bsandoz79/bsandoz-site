import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../../app/routes';
import { pages } from '../../data/pages';
import { CLE_STOCKAGE } from './stockage';

function renderComposer(path: string = pages.composer.path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

const estimation = () => screen.getByRole('complementary', { name: 'Votre estimation' });
const stocke = () => JSON.parse(window.localStorage.getItem(CLE_STOCKAGE) ?? '{}');

describe('Configurateur /composer', () => {
  beforeEach(() => window.localStorage.clear());

  it('ouvre les étapes l’une après l’autre', async () => {
    const user = userEvent.setup();
    renderComposer();
    expect(screen.getByRole('heading', { level: 1, name: pages.composer.heading })).toBeInTheDocument();
    expect(screen.queryByRole('group', { name: /Quelle est votre activité/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('complementary', { name: 'Votre estimation' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: /^Fonctionnel/ }));
    expect(screen.getByRole('group', { name: /Quelle est votre activité/ })).toBeInTheDocument();
    // Le Fonctionnel attend l'activité avant de proposer des options.
    expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
    expect(estimation()).toHaveTextContent('Choisissez votre activité pour recevoir votre devis détaillé.');

    await user.click(screen.getByRole('radio', { name: 'Restaurant / bar' }));
    expect(screen.getAllByRole('checkbox')).toHaveLength(5);
    expect(within(estimation()).getByRole('link', { name: 'Recevoir mon devis détaillé' })).toHaveAttribute(
      'href',
      pages.devis.path,
    );
    expect(within(estimation()).getByRole('link', { name: 'En parler en rendez-vous' })).toHaveAttribute(
      'href',
      pages.rendezVous.path,
    );
  });

  it('propose les options de la vitrine sans attendre l’activité', async () => {
    const user = userEvent.setup();
    renderComposer();
    await user.click(screen.getByRole('radio', { name: /^Vitrine\s*à partir de 99/ }));
    expect(screen.getByRole('group', { name: /Envie d'ajouter quelque chose/ })).toBeInTheDocument();
    await user.click(screen.getByRole('checkbox', { name: /Galerie photos/ }));
    expect(within(estimation()).getByText((_, el) => el?.getAttribute('aria-live') === 'polite')).toHaveTextContent(
      /179\s€/,
    );
    expect(estimation()).not.toHaveTextContent('Fourchette');
  });

  it('pose les précisions des options concernées et ajoute leur supplément', async () => {
    const user = userEvent.setup();
    renderComposer();
    await user.click(screen.getByRole('radio', { name: /^Fonctionnel/ }));
    await user.click(screen.getByRole('radio', { name: 'Restaurant / bar' }));
    await user.click(screen.getByRole('checkbox', { name: /Réservation de table/ }));
    const question = screen.getByRole('group', { name: /Un acompte pour les grandes tablées/ });
    await user.click(within(question).getByRole('radio', { name: /Oui \(\+ 150/ }));
    expect(screen.getByText(/Acompte demandé au-delà d'un nombre de couverts/)).toBeInTheDocument();
    expect(estimation()).toHaveTextContent('Réservation de table · Oui');
  });

  it('offre une option grâce à une suggestion de pack', async () => {
    const user = userEvent.setup();
    renderComposer();
    await user.click(screen.getByRole('radio', { name: /^Fonctionnel/ }));
    await user.click(screen.getByRole('radio', { name: 'Santé / bien-être' }));
    await user.click(screen.getByRole('checkbox', { name: /Rendez-vous en ligne/ }));
    const suggestions = screen.getByRole('region', { name: 'Vous pourriez aussi y penser' });
    await user.click(within(suggestions).getByRole('button', { name: "Ajouter et profiter de l'offre" }));
    expect(screen.getByRole('checkbox', { name: /Acompte en ligne/ })).toBeChecked();
    expect(estimation()).toHaveTextContent(/Offert : − 60\s€/);
    expect(estimation()).toHaveTextContent('Pack Réservation sereine · Avis Google affichés');
    expect(estimation()).toHaveTextContent(/Valeur 1\s599\s€/);
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
      await user.click(screen.getByRole('radio', { name: 'Santé / bien-être' }));
      expect(apercu()).toHaveTextContent('Studio Équilibre');
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
});
