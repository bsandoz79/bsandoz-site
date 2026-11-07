import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../../app/routes';
import { autonomie, hero, livraison, methode, metiers } from '../../data/accueil';
import { faqAccueil, questionsFaq } from '../../data/faq';
import { pages } from '../../data/pages';
import { exemplesOutils } from '../../data/exemples';
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
      autonomie.titre,
      'Mes réalisations',
      methode.title,
      livraison.titre,
      faqAccueil.titre,
      'Je me déplace chez vous.',
      'Parlez-moi de votre projet.',
    ]);
  });

  it('hero : appels à l’action et réassurance, sans mots qui tournent', () => {
    renderHome();
    const heroSection = section(pages.accueil.heading);
    expect(within(heroSection).getByRole('link', { name: 'Demander un devis' })).toHaveAttribute('href', pages.devis.path);
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

  it('fait défiler les métiers qui ont besoin d’un site, sous une question', () => {
    renderHome();
    const list = screen.getByRole('list', { name: metiers.label });
    expect(within(list).getAllByRole('listitem')).toHaveLength(metiers.items.length);
    expect(within(list).getByText('Avocats')).toBeInTheDocument();
    expect(screen.getByText(metiers.question)).toBeInTheDocument();
  });

  it('dit ce que le client modifie seul, et ce qui reste à faire par Baptiste', () => {
    renderHome();
    const bloc = section(autonomie.titre);
    expect(within(bloc).getAllByRole('article')).toHaveLength(autonomie.items.length);
    expect(bloc).toHaveTextContent('« Modifier »');
    expect(bloc).toHaveTextContent(autonomie.note);
  });

  it('fait défiler les réalisations, avec une pause et le lien vers toutes les réalisations', () => {
    renderHome();
    const bloc = section('Mes réalisations');
    const liste = within(bloc).getByRole('list', { name: 'Mes réalisations' });
    for (const realisation of realisations) {
      expect(within(liste).getByRole('article', { name: realisation.titre })).toBeInTheDocument();
    }
    // La copie qui sert à boucler n'est ni lue ni atteignable au clavier.
    expect(within(bloc).getAllByRole('article')).toHaveLength(realisations.length + exemplesOutils.length);
    expect(within(bloc).getByRole('button', { name: 'Mettre en pause' })).toBeInTheDocument();
    expect(within(bloc).getByRole('link', { name: /Voir toutes les réalisations/ })).toHaveAttribute('href', pages.realisations.path);
  });

  it('montre aussi des exemples d’outils, marqués « Exemple », qui mènent au devis', () => {
    renderHome();
    const liste = within(section('Mes réalisations')).getByRole('list', { name: 'Mes réalisations' });
    for (const exemple of exemplesOutils) {
      const carte = within(liste).getByRole('article', { name: exemple.titre });
      expect(carte).toHaveTextContent('Exemple');
      expect(within(carte).getByRole('link', { name: /Un outil comme celui-ci/ })).toHaveAttribute('href', pages.devis.path);
    }
  });

  it('liste ce que le client reçoit à la livraison', () => {
    renderHome();
    const bloc = section(livraison.titre);
    for (const item of livraison.items) expect(bloc).toHaveTextContent(item.titre);
  });

  it('numérote les quatre étapes de la méthode', () => {
    renderHome();
    const steps = within(section(methode.title)).getAllByRole('listitem');
    expect(steps.map((step) => step.querySelector('h3')?.textContent)).toEqual(methode.steps.map((s) => s.title));
  });

  it('finit par le formulaire de contact, avec le rendez-vous à côté', () => {
    renderHome();
    const contact = section('Parlez-moi de votre projet.');
    expect(within(contact).getByRole('form', { name: 'Parlez-moi de votre projet.' })).toBeInTheDocument();
    expect(within(contact).getByRole('link', { name: /Prendre un rendez-vous gratuit/ })).toHaveAttribute('href', pages.rendezVous.path);
  });
  it('montre qui est derrière le site, et un seul prix : « à partir de 390 € »', () => {
    renderHome();
    expect(screen.getAllByText('Baptiste Sandoz').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Développeur web à Amiens').length).toBeGreaterThan(0);
    const heroSection = section(pages.accueil.heading);
    expect(heroSection).toHaveTextContent(/Sites à partir de 390\s€\. Le prix exact dans votre devis/);
    // Aucun autre prix sur l'accueil (hors démonstration décorative du téléphone, cachée aux lecteurs d'écran).
    const visible = document.body.cloneNode(true) as HTMLElement;
    visible.querySelectorAll('[aria-hidden="true"]').forEach((el) => el.remove());
    expect(visible.textContent?.match(/\d+\s€/g)?.map((p) => p.replace(/\s/g, ' '))).toEqual(['390 €']);
  });

  it('garde le reflet seulement sur le bouton principal', () => {
    renderHome();
    expect(within(section(pages.accueil.heading)).getByRole('link', { name: 'Demander un devis' })).toHaveClass('anim-reflet');
    expect(document.querySelectorAll('.anim-reflet')).toHaveLength(1);
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

    it('déplie une réponse au clic, sans prix', async () => {
      const user = userEvent.setup();
      renderHome();
      const delais = document.getElementById('delais') as HTMLDetailsElement;
      expect(delais.open).toBe(false);
      await user.click(within(faq()).getByText(questionsFaq[0].question));
      expect(delais.open).toBe(true);
      expect(delais).toHaveTextContent(
        'Comptez quelques jours pour un site d’une page, 1 à 2 semaines pour un site de plusieurs pages',
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
});
