import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../../app/routes';
import { lignePageSupplementaire, options } from '../../data/offres';
import { pages } from '../../data/pages';

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
    expect(screen.getByRole('article', { name: 'Vitrine' })).toHaveTextContent(/99\s€.*Délai : 3 jours/);
    expect(screen.getByRole('article', { name: 'Vitrine+' })).toHaveTextContent(/390\s€/);
    expect(screen.getByRole('article', { name: 'Fonctionnel' })).toHaveTextContent(/dès 989\s€/);
  });

  it('fait passer un reflet sur les trois formules', () => {
    renderTarifs();
    for (const nom of ['Vitrine', 'Vitrine+', 'Fonctionnel']) expect(screen.getByRole('article', { name: nom })).toHaveClass('anim-reflet');
  });

  it('indique le prix d’une page supplémentaire sous chacune des trois formules, depuis l’option', () => {
    renderTarifs();
    for (const nom of ['Vitrine', 'Vitrine+', 'Fonctionnel']) {
      expect(screen.getByRole('article', { name: nom })).toHaveTextContent(/Page supplémentaire : \+ 50\s€/);
    }
    const prixInitial = options.page.prix;
    options.page.prix = 149;
    try {
      expect(lignePageSupplementaire()).toMatch(/Page supplémentaire : \+ 149\s€/);
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

  it('demande l’activité avant de proposer des options', () => {
    renderTarifs();
    expect(screen.getByText('Choisissez votre activité pour voir les options proposées.')).toBeInTheDocument();
    expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
    expect(total()).toHaveTextContent(/989\s€ – 1\s090\s€/);
  });

  it('met le prix à jour en direct selon l’activité et les options', async () => {
    const user = userEvent.setup();
    renderTarifs();
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
    await user.click(screen.getByRole('radio', { name: 'Artisan à domicile' }));
    await user.click(screen.getByRole('checkbox', { name: /Rendez-vous en ligne/ }));
    await user.click(screen.getByRole('checkbox', { name: /Calculateur de prix/ }));
    await user.click(screen.getByRole('radio', { name: 'Santé / bien-être' }));
    expect(screen.getByRole('checkbox', { name: /Rendez-vous en ligne/ })).toBeChecked();
    expect(screen.queryByRole('checkbox', { name: /Calculateur de prix/ })).not.toBeInTheDocument();
    expect(within(estimation()).queryByText('Calculateur de prix')).not.toBeInTheDocument();
  });

  it('mène au devis et au configurateur', () => {
    renderTarifs();
    expect(within(estimation()).getByRole('link', { name: 'Recevoir mon devis détaillé' })).toHaveAttribute(
      'href',
      pages.devis.path,
    );
    expect(within(estimation()).getByRole('link', { name: /Composer mon site en détail/ })).toHaveAttribute(
      'href',
      pages.composer.path,
    );
  });

  it('présente l’après mise en ligne', () => {
    renderTarifs();
    const apres = screen.getByRole('region', { name: 'Et après la mise en ligne ?' });
    expect(apres).toHaveTextContent("50 € de l'heure, sans engagement");
  });
});
