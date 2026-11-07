import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { pages } from '../../data/pages';
import { Header } from './Header';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="*" element={<Header />} />
      </Routes>
    </MemoryRouter>,
  );
}

const menuButton = () => screen.getByRole('button', { name: /le menu/ });
const mainNav = () => screen.getByRole('navigation', { name: 'Navigation principale' });

describe('Header', () => {
  it("affiche le logo, qui ramène à l'accueil", () => {
    renderAt(pages.realisations.path);
    expect(screen.getByRole('link', { name: 'Baptiste Sandoz' })).toHaveAttribute('href', '/');
  });

  it('affiche les liens du menu et le seul bouton « Demander un devis »', () => {
    renderAt('/');
    const nav = within(mainNav());
    for (const name of ['Réalisations', 'À propos', 'Questions fréquentes']) {
      expect(nav.getByRole('link', { name })).toBeInTheDocument();
    }
    // Plus de tarifs détaillés ni d'estimation.
    expect(nav.queryByRole('link', { name: 'Tarifs' })).not.toBeInTheDocument();
    expect(nav.queryByRole('link', { name: 'Estimer' })).not.toBeInTheDocument();
    // Les métiers et le portfolio sont dans le pied de page.
    expect(nav.queryByRole('button', { name: 'Métiers' })).not.toBeInTheDocument();
    expect(nav.queryByRole('link', { name: 'Portfolio' })).not.toBeInTheDocument();
    expect(nav.getByRole('link', { name: 'Demander un devis' })).toHaveAttribute('href', pages.devis.path);
  });

  it('« Demander un devis » mène au formulaire, quelle que soit la page', () => {
    renderAt(pages.informatique.path);
    expect(within(mainNav()).getByRole('link', { name: 'Demander un devis' })).toHaveAttribute('href', pages.devis.path);
  });

  it('ne signale pas « Questions fréquentes » comme page en cours sur l’accueil', () => {
    renderAt('/');
    expect(within(mainNav()).getByRole('link', { name: 'Questions fréquentes' })).not.toHaveAttribute('aria-current');
  });

  it('signale la page en cours', () => {
    renderAt(pages.realisations.path);
    expect(within(mainNav()).getByRole('link', { name: 'Réalisations' })).toHaveAttribute('aria-current', 'page');
  });

  describe('onglets des services', () => {
    it('marque « Sites & applis » sur les pages des sites', () => {
      renderAt(pages.realisations.path);
      const tabs = within(screen.getByRole('navigation', { name: 'Catégories de services' }));
      expect(tabs.getByRole('link', { name: 'Sites & applis' })).toHaveAttribute('aria-current', 'true');
      expect(tabs.getByRole('link', { name: 'Informatique sur place' })).not.toHaveAttribute('aria-current');
    });

    it('marque « Informatique sur place » sur la page Informatique', () => {
      renderAt(pages.informatique.path);
      const tabs = within(screen.getByRole('navigation', { name: 'Catégories de services' }));
      expect(tabs.getByRole('link', { name: 'Informatique sur place' })).toHaveAttribute('aria-current', 'true');
      expect(tabs.getByRole('link', { name: 'Sites & applis' })).not.toHaveAttribute('aria-current');
    });
  });

  describe('menu mobile', () => {
    it("s'ouvre et se ferme avec le bouton", async () => {
      const user = userEvent.setup();
      renderAt('/');
      expect(menuButton()).toHaveAttribute('aria-expanded', 'false');
      expect(menuButton()).toHaveAttribute('aria-controls', mainNav().id);
      expect(mainNav()).not.toHaveClass('navOpen');

      await user.click(menuButton());
      expect(menuButton()).toHaveAttribute('aria-expanded', 'true');
      expect(menuButton()).toHaveAccessibleName('Fermer le menu');
      expect(mainNav()).toHaveClass('navOpen');

      await user.click(menuButton());
      expect(menuButton()).toHaveAttribute('aria-expanded', 'false');
      expect(menuButton()).toHaveAccessibleName('Ouvrir le menu');
    });

    it('se ferme avec Échap et rend le focus au bouton', async () => {
      const user = userEvent.setup();
      renderAt('/');
      await user.click(menuButton());
      await user.keyboard('{Escape}');
      expect(menuButton()).toHaveAttribute('aria-expanded', 'false');
      expect(menuButton()).toHaveFocus();
    });

    it('se ferme quand on change de page', async () => {
      const user = userEvent.setup();
      renderAt('/');
      await user.click(menuButton());
      await user.click(within(mainNav()).getByRole('link', { name: 'À propos' }));
      expect(menuButton()).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('donne accès à l’espace client depuis la barre, et depuis le menu du téléphone', () => {
    renderAt(pages.realisations.path);
    const liens = within(screen.getByRole('banner')).getAllByRole('link', { name: 'Espace client' });
    expect(liens).toHaveLength(2);
    for (const lien of liens) expect(lien).toHaveAttribute('href', pages.monEspace.path);
    expect(within(mainNav()).getByRole('link', { name: 'Espace client' })).toBeInTheDocument();
  });
});
