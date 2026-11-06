import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../../app/routes';
import { complements, marche, options, prixSeoSeul } from '../../data/offres';
import { pages } from '../../data/pages';
import { CLE_STOCKAGE } from '../Composer/stockage';

function renderTarifs() {
  return render(
    <MemoryRouter initialEntries={[pages.tarifs.path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

const estimation = () => screen.getByRole('complementary', { name: 'Votre estimation' });
const total = () => within(estimation()).getByText((_, el) => el?.getAttribute('aria-live') === 'polite');

describe('Page Tarifs', () => {
  it('a son titre, sa description et les trois formules avec leur prix et leur délai', () => {
    renderTarifs();
    expect(screen.getByRole('heading', { level: 1, name: pages.tarifs.heading })).toBeInTheDocument();
    expect(document.title).toBe('Tarifs – Baptiste Sandoz');
    expect(screen.getByRole('article', { name: 'Vitrine' })).toHaveTextContent(/à partir de 99\s€.*Délai : 3 jours/);
    expect(screen.getByRole('article', { name: 'Vitrine+' })).toHaveTextContent(/à partir de 390\s€/);
    expect(screen.getByRole('article', { name: 'Fonctionnel' })).toHaveTextContent(/à partir de 989\s€/);
  });

  it('ne met pas d’effet de reflet sur les trois formules', () => {
    renderTarifs();
    for (const nom of ['Vitrine', 'Vitrine+', 'Fonctionnel']) expect(screen.getByRole('article', { name: nom })).not.toHaveClass('anim-reflet');
  });

  it('affiche à part deux compléments : page en plus, suivi mensuel avec le tarif horaire', () => {
    renderTarifs();
    const bloc = screen.getByRole('region', { name: 'Les compléments' });
    expect(within(bloc).getAllByRole('listitem')).toHaveLength(2);
    const item = (nom: string) => within(bloc).getByText(nom).closest('li')!;
    expect(item('Page supplémentaire')).toHaveTextContent(/\+ 50\s€/);
    expect(item('Suivi mensuel')).toHaveTextContent(/29\s€ \/ mois/);
    expect(item('Suivi mensuel')).toHaveTextContent(/29\s€ de l’heure, à la demande/);
    // La ligne de page n'est plus répétée dans les cartes.
    expect(screen.getByRole('article', { name: 'Vitrine' })).not.toHaveTextContent('Page supplémentaire');
  });

  it('met en avant à part le référencement seul, avec le prix du marché et sa source', () => {
    renderTarifs();
    const seo = screen.getByRole('region', { name: 'Vous avez déjà un site ?' });
    expect(seo).toHaveTextContent('− 20 % sur le prix du marché');
    expect(seo).toHaveTextContent(/400\s€/);
    expect(seo).toHaveTextContent(`Sur le marché : ${marche.seo.fourchette}`);
    expect(seo).toHaveTextContent(marche.seo.source);
    expect(within(seo).getByRole('link', { name: 'Faire le point sur mon site' })).toHaveAttribute('href', pages.devis.path);
  });

  it('calcule le référencement seul à 20 % sous le bas du marché, et suit le prix de la page', () => {
    expect(prixSeoSeul()).toBe(Math.round(marche.seo.bas * 0.8));
    const prixInitial = options.page.prix;
    options.page.prix = 149;
    try {
      expect(complements()[0].prix).toMatch(/\+ 149\s€/);
    } finally {
      options.page.prix = prixInitial;
    }
  });

  it('explique pourquoi le fonctionnel coûte plus cher', () => {
    renderTarifs();
    expect(screen.getByRole('complementary', { name: /Pourquoi un site fonctionnel/ })).toHaveTextContent(
      'protège les données de vos clients',
    );
  });

  it('ne choisit aucune formule à l’avance, puis demande l’activité pour le Fonctionnel', async () => {
    const user = userEvent.setup();
    renderTarifs();
    expect(screen.getAllByText('Choisissez une formule pour voir les options proposées.').length).toBeGreaterThan(0);
    expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
    expect(total()).toHaveTextContent('—');
    expect(screen.queryByRole('radiogroup', { name: /Votre activité/ })).not.toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: /Fonctionnel/ }));
    expect(screen.getByText('Choisissez votre activité pour voir les options proposées.')).toBeInTheDocument();
    expect(total()).toHaveTextContent(/989\s€ – 1\s090\s€/);
  });

  it('simule aussi une Vitrine ou une Vitrine+, sans demander l’activité', async () => {
    const user = userEvent.setup();
    renderTarifs();
    await user.click(screen.getByRole('radio', { name: /Vitrine\+/ }));
    expect(screen.getAllByRole('checkbox').length).toBeGreaterThan(0);
    expect(screen.queryByText('Choisissez votre activité pour voir les options proposées.')).not.toBeInTheDocument();
    expect(estimation()).toHaveTextContent('Site Vitrine+');
  });

  it('met le prix à jour en direct selon l’activité et les options', async () => {
    const user = userEvent.setup();
    renderTarifs();
    await user.click(screen.getByRole('radio', { name: /Fonctionnel/ }));
    await user.click(screen.getByRole('radio', { name: 'Artisan à domicile' }));
    expect(screen.getAllByRole('checkbox')).toHaveLength(6);
    expect(estimation()).toHaveTextContent('Votre estimation · artisan à domicile');

    await user.click(screen.getByRole('checkbox', { name: /Rendez-vous en ligne/ }));
    // 989 + 400 = 1 389 € → 1 320 € – 1 530 €
    expect(total()).toHaveTextContent(/1\s320\s€ – 1\s530\s€/);
    expect(within(estimation()).getByText('Rendez-vous en ligne')).toBeInTheDocument();
  });

  it('propose de compléter un pack, puis l’offre', async () => {
    const user = userEvent.setup();
    renderTarifs();
    await user.click(screen.getByRole('radio', { name: /Fonctionnel/ }));
    await user.click(screen.getByRole('radio', { name: 'Santé / bien-être' }));
    await user.click(screen.getByRole('checkbox', { name: /Rendez-vous en ligne/ }));
    expect(estimation()).toHaveTextContent('Pack Réservation sereine');

    await user.click(within(estimation()).getByRole('button', { name: 'Ajouter « Acompte en ligne »' }));
    expect(screen.getByRole('checkbox', { name: /Acompte en ligne/ })).toBeChecked();
    expect(within(estimation()).getByText(/Avis Google affichés/).closest('li')).toHaveTextContent('Offert');
    expect(estimation()).toHaveTextContent(/Offert grâce au pack : − 60\s€/);
    expect(screen.getByRole('checkbox', { name: /Avis Google affichés/ }).closest('label')).toHaveTextContent('Offert');
  });

  it('garde les options compatibles quand on change d’activité', async () => {
    const user = userEvent.setup();
    renderTarifs();
    await user.click(screen.getByRole('radio', { name: /Fonctionnel/ }));
    await user.click(screen.getByRole('radio', { name: 'Artisan à domicile' }));
    await user.click(screen.getByRole('checkbox', { name: /Rendez-vous en ligne/ }));
    await user.click(screen.getByRole('checkbox', { name: /Calculateur de prix/ }));
    await user.click(screen.getByRole('radio', { name: 'Santé / bien-être' }));
    expect(screen.getByRole('checkbox', { name: /Rendez-vous en ligne/ })).toBeChecked();
    expect(screen.queryByRole('checkbox', { name: /Calculateur de prix/ })).not.toBeInTheDocument();
    expect(within(estimation()).queryByText('Calculateur de prix')).not.toBeInTheDocument();
  });

  it('enregistre la simulation : le devis détaillé et « Composer mon site » la reprennent', async () => {
    const user = userEvent.setup();
    window.localStorage.removeItem(CLE_STOCKAGE);
    renderTarifs();
    expect(window.localStorage.getItem(CLE_STOCKAGE)).toBeNull();
    await user.click(screen.getByRole('radio', { name: /Fonctionnel/ }));
    await user.click(screen.getByRole('radio', { name: 'Artisan à domicile' }));
    await user.click(screen.getByRole('checkbox', { name: /Rendez-vous en ligne/ }));
    expect(JSON.parse(window.localStorage.getItem(CLE_STOCKAGE)!).config).toEqual({
      formule: 'fonctionnel',
      metier: 'artisan',
      options: ['rdv'],
      precisions: {},
    });
  });

  it('mène au devis et au configurateur', () => {
    renderTarifs();
    expect(within(estimation()).getByRole('link', { name: 'Recevoir mon devis détaillé' })).toHaveAttribute(
      'href',
      pages.devis.path,
    );
    expect(within(estimation()).getByRole('link', { name: /Composer mon site en détail/ })).toHaveAttribute(
      'href',
      `${pages.composer.path}?onglet=web`,
    );
  });

  it('présente l’après mise en ligne', () => {
    renderTarifs();
    const apres = screen.getByRole('region', { name: 'Et après la mise en ligne ?' });
    expect(apres).toHaveTextContent("29 € de l'heure, sans engagement");
    expect(apres).toHaveTextContent('29 € par mois');
  });
});
