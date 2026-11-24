import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../../app/routes';
import { autonomie, comparatif, hero, methode, metiers, tarifs } from '../../data/accueil';
import { faqAccueil, questionsFaq } from '../../data/faq';
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
      autonomie.titre,
      'Mes réalisations',
      methode.title,
      comparatif.titre,
      tarifs.titre,
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

  it('montre trois réalisations, sans les exemples, et le lien vers toutes les réalisations', () => {
    renderHome();
    const bloc = section('Mes réalisations');
    const liste = within(bloc).getByRole('list', { name: 'Mes réalisations' });
    for (const realisation of realisations.slice(0, 3)) {
      expect(within(liste).getByRole('article', { name: realisation.titre })).toBeInTheDocument();
    }
    expect(within(bloc).getAllByRole('article')).toHaveLength(3);
    expect(within(bloc).queryByText('Exemple')).not.toBeInTheDocument();
    expect(within(bloc).getByRole('link', { name: /Voir toutes les réalisations/ })).toHaveAttribute('href', pages.realisations.path);
  });

  it('compare moi, plateforme et agence dans un vrai tableau, avec un signe par case et sans prix', () => {
    renderHome();
    const tableau = within(section(comparatif.titre)).getByRole('table', { name: comparatif.titre });
    expect(within(tableau).getAllByRole('columnheader').map((c) => c.textContent)).toEqual([comparatif.colonnes[0], 'Recommandé' + comparatif.colonnes[1], comparatif.colonnes[2]]);
    expect(within(tableau).getAllByRole('rowheader').map((c) => c.textContent)).toEqual(comparatif.lignes.map((l) => l.critere));
    expect(within(tableau).getByRole('cell', { name: /^Oui : ?Vous gardez tout/ })).toBeInTheDocument();
    expect(within(tableau).getByRole('cell', { name: /^Non : ?Un abonnement à payer chaque mois/ })).toBeInTheDocument();
    // Tous les critères sont des avantages dans la colonne « Avec moi ».
    expect(comparatif.lignes.every((l) => l.valeurs[comparatif.miseEnAvant].verdict === 'oui')).toBe(true);
    expect(tableau.textContent).not.toMatch(/\d+\s€/);
  });

  it('n’a qu’un formulaire : devis ou maquette gratuite, au choix', () => {
    renderHome();
    expect(screen.getAllByRole('form')).toHaveLength(1);
    expect(screen.getByRole('radio', { name: 'Une maquette gratuite d’abord' })).toBeInTheDocument();
  });

  it('rassure : le client garde tout si Baptiste n’est plus disponible', async () => {
    renderHome();
    await userEvent.setup().click(within(section(faqAccueil.titre)).getByText('À qui appartient le site ?'));
    expect(document.getElementById('propriete')).toHaveTextContent('si un jour je ne suis plus disponible, vous gardez tout');
  });

  it('numérote les quatre étapes de la méthode', () => {
    renderHome();
    const steps = within(section(methode.title)).getAllByRole('listitem');
    expect(steps.map((step) => step.querySelector('h3')?.textContent)).toEqual(methode.steps.map((s) => s.title));
    // Chaque étape dit combien de temps elle prend.
    steps.forEach((step, i) => expect(step).toHaveTextContent(methode.steps[i].duree));
    expect(section(methode.title)).toHaveTextContent('5 à 7 jours ouvrés');
    expect(section(methode.title)).toHaveTextContent('Retouches à volonté');
    expect(section(methode.title)).toHaveTextContent('30 jours d’ajustements');
  });

  it('finit par le formulaire de contact, avec le rendez-vous à côté', () => {
    renderHome();
    const contact = section('Parlez-moi de votre projet.');
    expect(within(contact).getByRole('form', { name: 'Parlez-moi de votre projet.' })).toBeInTheDocument();
    expect(within(contact).getByRole('link', { name: /Prendre un rendez-vous gratuit/ })).toHaveAttribute('href', pages.rendezVous.path);
  });
  it('montre qui est derrière le site, et le prix de départ : « à partir de 99 € »', () => {
    renderHome();
    expect(screen.getAllByText('Baptiste Sandoz').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Développeur web à Amiens').length).toBeGreaterThan(0);
    const heroSection = section(pages.accueil.heading);
    expect(heroSection).toHaveTextContent(/Sites à partir de 99\s€\. Le prix exact dans votre devis/);
    expect(heroSection).toHaveTextContent('payable en 3 ou 4 fois sans frais');
    // Les moyens de paiement sont sous les tarifs, plus dans le haut de page.
    expect(within(heroSection).queryByRole('list', { name: 'Moyens de paiement acceptés' })).not.toBeInTheDocument();
  });

  it('tarifs après le comparatif : 3 cartes cliquables vers le devis, page en plus, paiement', () => {
    renderHome();
    const bloc = section(tarifs.titre);
    const cartes = within(bloc).getAllByRole('link', { name: new RegExp(tarifs.appel) });
    expect(cartes.map((c) => c.getAttribute('aria-label')?.replace(/\s/g, ' '))).toEqual([
      `Vitrine, à partir de 99 € : ${tarifs.appel}`,
      `Vitrine+, à partir de 389 € : ${tarifs.appel}`,
      `Fonctionnel, à partir de 989 € : ${tarifs.appel}`,
    ]);
    expect(cartes[1]).toHaveAttribute('href', '/devis?formule=vitrinePlus');
    expect(bloc).toHaveTextContent(/Page supplémentaire : \+ 50\s€/);
    expect(bloc).toHaveTextContent('Payable en 3 ou 4 fois sans frais');
    const moyens = within(bloc).getByRole('list', { name: 'Moyens de paiement acceptés' });
    expect(within(moyens).getByRole('link', { name: 'Klarna, site officiel (nouvel onglet)' })).toHaveAttribute('href', 'https://www.klarna.com/fr/');
    expect(within(moyens).queryByText(/Mastercard|American Express|Visa/)).not.toBeInTheDocument();
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

  it('la bande des métiers mène à la page de chaque métier', () => {
    renderHome();
    const bande = screen.getByRole('list', { name: metiers.label });
    expect(within(bande).getByRole('link', { name: 'Avocats' })).toHaveAttribute('href', pages.liberal.path);
    expect(within(bande).getByRole('link', { name: 'Plombiers' })).toHaveAttribute('href', pages.batiment.path);
    expect(within(bande).getByRole('link', { name: 'Gîtes' })).toHaveAttribute('href', pages.hebergement.path);
  });
});
