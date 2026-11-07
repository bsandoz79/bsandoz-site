import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../../app/routes';
import { pages } from '../../data/pages';

function afficher(chemin: string = pages.devis.path) {
  return render(
    <MemoryRouter initialEntries={[chemin]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

describe('Demande de devis', () => {
  it('est un seul formulaire court, avec le titre de la page', () => {
    afficher();
    expect(screen.getByRole('heading', { level: 1, name: pages.devis.heading })).toBeInTheDocument();
    expect(document.title).toBe(`${pages.devis.title} – Baptiste Sandoz`);
    expect(screen.getByRole('form', { name: pages.devis.heading })).toBeInTheDocument();
    for (const nom of [/Prénom et nom/, /Entreprise/, /E-mail/, /Téléphone/, /Votre projet/]) {
      expect(screen.getByRole('textbox', { name: nom })).toBeInTheDocument();
    }
    expect(screen.getByRole('combobox', { name: /Votre métier ou activité/ })).toBeInTheDocument();
    expect(screen.queryByText(/Étape 1/)).not.toBeInTheDocument();
  });

  it('propose l’estimation en ligne, en second plan', () => {
    afficher();
    expect(screen.getByRole('link', { name: /Faire une estimation en ligne/ })).toHaveAttribute('href', `${pages.composer.path}?onglet=web`);
  });
});
