import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../../app/routes';
import { hero, methode, metiers, pourquoi, problemes } from '../../data/accueil';
import { pages } from '../../data/pages';
import { realisations } from '../../data/realisations';

function renderHome() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

const section = (name: string | RegExp) => screen.getByRole('region', { name });

describe("Page d'accueil", () => {
  it('a un seul titre principal, avec le titre et la description de la page', () => {
    renderHome();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1, name: pages.accueil.heading })).toBeInTheDocument();
    expect(document.title).toBe(`${pages.accueil.title} – Baptiste Sandoz`);
  });

  it('présente les sections dans l’ordre du cahier des charges', () => {
    renderHome();
    const titles = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(titles).toEqual([
      problemes.title,
      'Des prix clairs, selon ce dont vous avez vraiment besoin.',
      'Des projets concrets, à tester vous-même.',
      methode.title,
      pourquoi.title,
      'Parlez-moi de votre projet.',
    ]);
  });

  it('hero : mots qui tournent, appels à l’action et réassurance', () => {
    renderHome();
    const heroSection = section(pages.accueil.heading);
    expect(within(heroSection).getByText(hero.rotatingWords.join(', '))).toBeInTheDocument();
    expect(within(heroSection).getByRole('link', { name: 'Estimer mon projet' })).toHaveAttribute(
      'href',
      pages.composer.path,
    );
    expect(within(heroSection).getByRole('link', { name: 'Voir les réalisations' })).toHaveAttribute(
      'href',
      pages.realisations.path,
    );
    expect(within(heroSection).getByRole('link', { name: /rendez-vous gratuit/ })).toHaveAttribute(
      'href',
      pages.rendezVous.path,
    );
    for (const item of hero.reassurance) expect(within(heroSection).getByText(item)).toBeInTheDocument();
  });

  it('affiche la bande des métiers', () => {
    renderHome();
    const list = screen.getByRole('list', { name: metiers.label });
    expect(within(list).getAllByRole('listitem')).toHaveLength(metiers.items.length);
  });

  it('associe chaque problème à sa solution', () => {
    renderHome();
    const items = within(section(problemes.title)).getAllByRole('listitem');
    expect(items).toHaveLength(4);
    expect(items[0]).toHaveTextContent(problemes.items[0].probleme);
    expect(items[0]).toHaveTextContent(problemes.items[0].solution);
  });

  it('affiche les trois formules avec leur prix et un lien vers le configurateur', () => {
    renderHome();
    const offres = section(/Des prix clairs/);
    const vitrine = within(offres).getByRole('article', { name: 'Vitrine' });
    expect(vitrine).toHaveTextContent(/99\s€/);
    expect(within(vitrine).getByRole('link', { name: 'Choisir Vitrine' })).toHaveAttribute(
      'href',
      '/composer?formule=vitrine',
    );
    expect(within(offres).getByRole('article', { name: 'Vitrine+' })).toHaveTextContent(/390\s€/);
    const fonctionnel = within(offres).getByRole('article', { name: 'Fonctionnel' });
    expect(fonctionnel).toHaveTextContent(/dès 989\s€/);
    expect(fonctionnel).toHaveTextContent('Le plus complet');
    expect(offres).toHaveTextContent('TVA non applicable (art. 293 B du CGI)');
  });

  it('affiche les réalisations', () => {
    renderHome();
    const realisationsSection = section(/Des projets concrets/);
    for (const realisation of realisations) {
      expect(within(realisationsSection).getByRole('article', { name: realisation.titre })).toBeInTheDocument();
    }
  });

  it('numérote les quatre étapes de la méthode', () => {
    renderHome();
    const steps = within(section(methode.title)).getAllByRole('listitem');
    expect(steps.map((step) => step.querySelector('h3')?.textContent)).toEqual(methode.steps.map((s) => s.title));
  });

  it('renvoie vers le portfolio, sans inventer de photo', () => {
    renderHome();
    const pourquoiSection = section(pourquoi.title);
    expect(within(pourquoiSection).getByText('[photo à compléter]')).toBeInTheDocument();
    expect(within(pourquoiSection).getByRole('link', { name: /portfolio/ })).toHaveAttribute(
      'href',
      'https://portfolio.bsandoz.fr',
    );
  });

  it('mène au parcours de devis depuis l’appel à l’action final', async () => {
    const user = userEvent.setup();
    renderHome();
    const appel = section('Parlez-moi de votre projet.');
    expect(within(appel).getByRole('link', { name: 'Prendre rendez-vous (gratuit)' })).toHaveAttribute(
      'href',
      pages.rendezVous.path,
    );
    await user.click(within(appel).getByRole('link', { name: 'Décrire mon projet' }));
    expect(screen.getByRole('heading', { level: 1, name: pages.devis.heading })).toBeInTheDocument();
  });
});
