import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../../app/routes';
import { cibles, hero, methode, metiers, pourquoi, problemes } from '../../data/accueil';
import { faqAccueil, questionsFaq } from '../../data/faq';
import { formuleParId, prixFormule } from '../../data/offres';
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
      'Mes tarifs',
      cibles.titre,
      'Mes réalisations',
      methode.title,
      pourquoi.title,
      faqAccueil.titre,
      'Je me déplace chez vous.',
      'Parlez-moi de votre projet.',
    ]);
  });

  it('hero : appels à l’action et réassurance, sans mots qui tournent', () => {
    renderHome();
    const heroSection = section(pages.accueil.heading);
    expect(within(heroSection).getByRole('link', { name: 'Estimer mon projet' })).toHaveAttribute(
      'href',
      `${pages.composer.path}?onglet=web`,
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
    const offres = section('Mes tarifs');
    const vitrine = within(offres).getByRole('article', { name: 'Vitrine' });
    expect(vitrine).toHaveTextContent(/99\s€/);
    expect(within(vitrine).getByRole('link', { name: 'Choisir Vitrine' })).toHaveAttribute(
      'href',
      '/composer?formule=vitrine',
    );
    expect(within(offres).getByRole('article', { name: 'Vitrine+' })).toHaveTextContent(/390\s€/);
    const fonctionnel = within(offres).getByRole('article', { name: 'Fonctionnel' });
    expect(fonctionnel).toHaveTextContent(/à partir de 989\s€/);
    expect(fonctionnel).toHaveTextContent('Le plus complet');
    expect(offres).toHaveTextContent('TVA non applicable (art. 293 B du CGI)');
  });

  it('affiche les réalisations', () => {
    renderHome();
    const realisationsSection = section('Mes réalisations');
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
    expect(within(pourquoiSection).getByRole('img', { name: 'Baptiste Sandoz, développeur web à Amiens' })).toBeInTheDocument();
    expect(within(pourquoiSection).queryByText('[photo à compléter]')).not.toBeInTheDocument();
    expect(within(pourquoiSection).getByRole('link', { name: /portfolio/ })).toHaveAttribute(
      'href',
      'https://portfolio.bsandoz.fr',
    );
  });

  it('finit par le formulaire de contact rapide, avec le rendez-vous et le devis détaillé à côté', async () => {
    const user = userEvent.setup();
    renderHome();
    const contact = section('Parlez-moi de votre projet.');
    expect(within(contact).getByRole('form', { name: 'Parlez-moi de votre projet.' })).toBeInTheDocument();
    expect(within(contact).getByRole('link', { name: /Prendre un rendez-vous gratuit/ })).toHaveAttribute('href', pages.rendezVous.path);
    await user.click(within(contact).getByRole('link', { name: 'Ou décrivez votre projet en détail' }));
    expect(screen.getByRole('heading', { level: 1, name: pages.devis.heading })).toBeInTheDocument();
  });
  it('affiche des chiffres clés tirés des offres, sans rien inventer', () => {
    renderHome();
    const bande = section('En bref');
    expect(within(bande).getByText(formuleParId('vitrine').delai)).toBeInTheDocument();
    expect(within(bande).getByText('24 h')).toBeInTheDocument();
    expect(within(bande).getByText('50 km')).toBeInTheDocument();
  });
  it('montre tout de suite qui est derrière le site : photo, nom et métier, prix de départ', () => {
    renderHome();
    expect(screen.getAllByText('Baptiste Sandoz').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Développeur web à Amiens').length).toBeGreaterThan(0);
    // Le prix de départ vient des formules ; on compare sans tenir compte des espaces insécables.
    const prix = prixFormule(formuleParId('vitrine')).replace(/\s/g, ' ');
    expect(screen.getByText((texte) => texte.replace(/\s/g, ' ').includes(prix))).toBeInTheDocument();
  });

  it('garde le reflet seulement sur le bouton principal, sans effets sur les cartes de prix', () => {
    renderHome();
    expect(within(section(pages.accueil.heading)).getByRole('link', { name: 'Estimer mon projet' })).toHaveClass('anim-reflet');
    for (const nom of ['Vitrine', 'Vitrine+', 'Fonctionnel']) {
      expect(within(section('Mes tarifs')).getByRole('article', { name: nom })).not.toHaveClass('anim-reflet');
    }
    expect(document.querySelector('.anim-pulse, .anim-float, .anim-respire')).toBeNull();
  });

  it('n’affiche pas de petits titres en majuscules au-dessus des sections', () => {
    const { container } = renderHome();
    expect(container.querySelector('[class*="eyebrow"]')).toBeNull();
  });

  describe('Questions fréquentes', () => {
    const faq = () => section(faqAccueil.titre);
    const questions = () => within(faq()).getAllByRole('heading', { level: 3 }).map((h) => h.textContent);
    const voirPlus = () => within(faq()).queryByRole('button', { name: new RegExp(faqAccueil.voirPlus) });

    it('est juste avant la carte, avec l’ancre #faq ; la page se termine par le contact', () => {
      renderHome();
      expect(faq()).toHaveAttribute('id', 'faq');
      expect(faq().nextElementSibling).toBe(section('Je me déplace chez vous.'));
      expect(section('Je me déplace chez vous.').nextElementSibling).toBe(section('Parlez-moi de votre projet.'));
    });

    it('affiche 3 questions, puis 3 de plus à chaque « Voir plus », jusqu’à la dernière', async () => {
      const user = userEvent.setup();
      renderHome();
      expect(questions()).toEqual(questionsFaq.slice(0, 3).map((q) => q.question));
      expect(voirPlus()).toHaveTextContent(`(${questionsFaq.length - 3})`);
      await user.click(voirPlus()!);
      expect(questions()).toEqual(questionsFaq.slice(0, 6).map((q) => q.question));
      // Le focus passe à la première nouvelle question.
      expect(document.activeElement).toBe(document.querySelector(`#${questionsFaq[3].id} > summary`));
      await user.click(voirPlus()!);
      expect(questions()).toHaveLength(questionsFaq.length);
      expect(voirPlus()).not.toBeInTheDocument();
    });

    it('déplie une réponse au clic, avec les prix et délais des données', async () => {
      const user = userEvent.setup();
      renderHome();
      const delais = document.getElementById('delais') as HTMLDetailsElement;
      expect(delais.open).toBe(false);
      await user.click(within(faq()).getByText(questionsFaq[0].question));
      expect(delais.open).toBe(true);
      expect(delais).toHaveTextContent(
        'Comptez 3 jours pour une Vitrine, 1 à 2 semaines pour une Vitrine+ et 3 à 6 semaines pour un site fonctionnel.',
      );
    });

    it('l’ancienne adresse /faq mène à la section', () => {
      const scrollIntoView = vi.fn();
      Element.prototype.scrollIntoView = scrollIntoView;
      render(
        <MemoryRouter initialEntries={['/faq']}>
          <AppRoutes />
        </MemoryRouter>,
      );
      expect(screen.getByRole('heading', { level: 1, name: pages.accueil.heading })).toBeInTheDocument();
      expect(scrollIntoView.mock.contexts[0]).toBe(section(faqAccueil.titre));
    });
  });

  it('présente les autres besoins : prix de départ, ou sur devis pour ce qui s’éloigne d’un site', () => {
    renderHome();
    const bloc = section(cibles.titre);
    expect(within(bloc).getByRole('article', { name: 'Photographes' })).toHaveTextContent(/à partir de 989\s€/);
    expect(within(bloc).getByRole('article', { name: 'Restauration et fast-food' })).toHaveTextContent(/à partir de 390\s€/);
    expect(within(bloc).getByRole('article', { name: 'Entreprises et PME' })).toHaveTextContent('Sur devis');
    expect(within(bloc).getByRole('article', { name: /Charcutiers/ })).toHaveTextContent('Sur devis');
    expect(within(bloc).getAllByRole('link', { name: /En parler/ })[0]).toHaveAttribute('href', pages.devis.path);
  });
});
