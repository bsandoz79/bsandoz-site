import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../../app/routes';
import { pages } from '../../data/pages';
import { realisations } from '../../data/realisations';
import { idsRealisations } from '../../data/realisationsIds';

function afficher(chemin: string) {
  return render(
    <MemoryRouter initialEntries={[chemin]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

describe('Page Réalisations', () => {
  it('présente une carte par réalisation, sans le détail des études de cas', () => {
    afficher(pages.realisations.path);
    expect(screen.getByRole('heading', { level: 1, name: pages.realisations.heading })).toBeInTheDocument();
    for (const realisation of realisations) {
      const carte = screen.getByRole('article', { name: realisation.titre });
      expect(carte).toHaveTextContent(realisation.resume);
      expect(within(carte).getByRole('link', { name: new RegExp(realisation.lien.label) })).toHaveAttribute('href', `/realisations/${realisation.id}`);
    }
    expect(screen.queryByText('Le besoin')).not.toBeInTheDocument();
  });

  it('les identifiants du plan du site correspondent aux réalisations', () => {
    expect(realisations.map((r) => r.id)).toEqual([...idsRealisations]);
  });

  it('filtre les projets : tout, sites web, applis et plateformes', async () => {
    const user = userEvent.setup();
    afficher(pages.realisations.path);
    const cartes = () => screen.getAllByRole('article').map((a) => a.getAttribute('aria-labelledby'));

    expect(screen.getByRole('radio', { name: 'Tout' })).toBeChecked();
    expect(screen.getByText('3 projets')).toBeInTheDocument();
    expect(cartes()).toHaveLength(3);

    await user.click(screen.getByRole('radio', { name: 'Sites web' }));
    expect(screen.getByText('2 projets')).toBeInTheDocument();
    expect(screen.queryByRole('article', { name: "O'RDV" })).not.toBeInTheDocument();
    expect(screen.getByRole('article', { name: 'Christophe Poix Moto' })).toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: 'Applis & plateformes' }));
    expect(screen.getByText('1 projet')).toBeInTheDocument();
    expect(screen.getByRole('article', { name: "O'RDV" })).toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: 'Tout' }));
    expect(cartes()).toHaveLength(3);
  });

  it('reprend le filtre de l’adresse, et ignore un filtre inconnu', () => {
    const { unmount } = afficher(`${pages.realisations.path}?type=appli`);
    expect(screen.getByRole('radio', { name: 'Applis & plateformes' })).toBeChecked();
    expect(screen.getAllByRole('article')).toHaveLength(1);
    unmount();

    afficher(`${pages.realisations.path}?type=inconnu`);
    expect(screen.getByRole('radio', { name: 'Tout' })).toBeChecked();
    expect(screen.getAllByRole('article')).toHaveLength(3);
  });

  it('chaque projet a un type couvert par un filtre', () => {
    const types = new Set(['site', 'appli']);
    for (const realisation of realisations) expect(types.has(realisation.type)).toBe(true);
  });

  it('propose de composer un projet', () => {
    afficher(pages.realisations.path);
    expect(screen.getByRole('link', { name: 'Composer mon site' })).toHaveAttribute('href', pages.composer.path);
  });
});

describe('Page d’une réalisation', () => {
  it('n’affiche que le projet choisi, depuis sa carte', async () => {
    const user = userEvent.setup();
    afficher(pages.realisations.path);
    const carte = screen.getByRole('article', { name: "O'RDV" });
    await user.click(within(carte).getByRole('link', { name: /Découvrir le projet/ }));

    expect(screen.getByRole('heading', { level: 1, name: "O'RDV" })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 1, name: 'Christophe Poix Moto' })).not.toBeInTheDocument();
    expect(document.title).toContain("O'RDV");
  });

  it('présente le contexte, le besoin, la solution, les fonctionnalités, les captures et la démo', () => {
    afficher('/realisations/ordv');
    for (const titre of ['Le contexte', 'Le besoin', 'La solution', 'Ce que fait le site', 'Captures']) {
      expect(screen.getByRole('heading', { level: 2, name: titre })).toBeInTheDocument();
    }
    expect(screen.getByText('MySQL')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: "O'RDV : Accueil et recherche de professionnels" })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: "O'RDV : Espace professionnel" })).toBeInTheDocument();
    const demo = screen.getByRole('link', { name: /Tester la démo en ligne/ });
    expect(demo).toHaveAttribute('href', 'https://o-rdv.vercel.app');
    expect(demo).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('laisse « [à compléter] » plutôt que d’inventer, et annonce les captures à venir', () => {
    afficher('/realisations/demo-detailing');
    expect(screen.getAllByText('[à compléter]').length).toBeGreaterThanOrEqual(3);
    expect(screen.getByText('Les captures arrivent bientôt.')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Ce que fait le site' })).not.toBeInTheDocument();
  });

  it('mène aux projets précédent et suivant, et revient à la liste', () => {
    afficher('/realisations/christophe-poix-moto');
    const voisins = within(screen.getByRole('navigation', { name: 'Autres réalisations' }));
    expect(voisins.getByRole('link', { name: /Projet précédent/ })).toHaveAttribute('href', '/realisations/ordv');
    expect(voisins.getByRole('link', { name: /Projet suivant/ })).toHaveAttribute('href', '/realisations/demo-detailing');
    expect(screen.getByRole('link', { name: '← Toutes les réalisations' })).toHaveAttribute('href', pages.realisations.path);
  });

  it('affiche la page introuvable pour un projet inconnu', () => {
    afficher('/realisations/projet-inconnu');
    expect(screen.getByRole('heading', { level: 1, name: 'Page introuvable' })).toBeInTheDocument();
  });
});
