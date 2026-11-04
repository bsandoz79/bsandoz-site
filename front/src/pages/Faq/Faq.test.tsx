import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../../app/routes';
import { questionsFaq } from '../../data/faq';
import { pages } from '../../data/pages';

function renderFaq() {
  return render(
    <MemoryRouter initialEntries={[pages.faq.path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

describe('Page FAQ', () => {
  it('liste les questions du cahier des charges, comme titres de niveau 2', () => {
    renderFaq();
    expect(screen.getByRole('heading', { level: 1, name: pages.faq.heading })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual(
      questionsFaq.map((q) => q.question),
    );
    expect(questionsFaq.map((q) => q.id)).toEqual([
      'delais',
      'contenus',
      'propriete',
      'hebergement',
      'modifications',
      'wordpress',
      'paiement',
    ]);
  });

  it('déplie une réponse au clic', async () => {
    const user = userEvent.setup();
    renderFaq();
    const details = document.getElementById('paiement') as HTMLDetailsElement;
    expect(details.open).toBe(false);
    await user.click(screen.getByText('Comment se passe le paiement ?'));
    expect(details.open).toBe(true);
    expect(details).toHaveTextContent('Un acompte à la commande, le solde à la mise en ligne.');
  });

  it('reprend les délais et les prix des données, sans en inventer', () => {
    renderFaq();
    expect(document.getElementById('delais')).toHaveTextContent(
      'Comptez 3 jours pour une Vitrine, 1 à 2 semaines pour une Vitrine+ et 3 à 6 semaines pour un site fonctionnel.',
    );
    expect(document.getElementById('modifications')).toHaveTextContent('50 € de l’heure');
    expect(document.getElementById('contenus')).toHaveTextContent('60 € par page');
  });

  it('propose un rendez-vous si la réponse manque', () => {
    renderFaq();
    expect(screen.getByRole('link', { name: 'Prendre rendez-vous (gratuit)' })).toHaveAttribute(
      'href',
      pages.rendezVous.path,
    );
  });
});
