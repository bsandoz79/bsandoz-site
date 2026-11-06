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
const metiersButton = () => screen.getByRole('button', { name: 'Métiers' });
const mainNav = () => screen.getByRole('navigation', { name: 'Navigation principale' });

describe('Header', () => {
  it("affiche le logo, qui ramène à l'accueil", () => {
    renderAt(pages.tarifs.path);
    expect(screen.getByRole('link', { name: 'Baptiste Sandoz' })).toHaveAttribute('href', '/');
  });

  it('affiche les liens du menu et le bouton « Estimer mon projet »', () => {
    renderAt('/');
    const nav = within(mainNav());
    for (const name of ['Réalisations', 'Tarifs', 'À propos', 'Portfolio']) {
      expect(nav.getByRole('link', { name })).toBeInTheDocument();
    }
    expect(nav.getByRole('link', { name: 'Portfolio' })).toHaveAttribute('href', 'https://portfolio.bsandoz.fr');
    expect(nav.getByRole('link', { name: 'Estimer mon projet' })).toHaveAttribute('href', `${pages.composer.path}?onglet=web`);
  });

  it('« Estimer mon projet » ouvre l’onglet de la page où l’on est', () => {
    renderAt(pages.informatique.path);
    expect(within(mainNav()).getByRole('link', { name: 'Estimer mon projet' })).toHaveAttribute('href', `${pages.composer.path}?onglet=informatique`);
  });

  it('une seule barre d’onglets sur la page Estimer : celle du configurateur', () => {
    const { container, unmount } = renderAt(pages.tarifs.path);
    expect(container.querySelector('header')!.className).not.toMatch(/sansOnglets/);
    unmount();
    const page = renderAt(pages.composer.path);
    expect(page.container.querySelector('header')!.className).toMatch(/sansOnglets/);
  });

  it('signale la page en cours', () => {
    renderAt(pages.tarifs.path);
    expect(within(mainNav()).getByRole('link', { name: 'Tarifs' })).toHaveAttribute('aria-current', 'page');
  });

  describe('onglets des services', () => {
    it('marque « Sites & applis » sur les pages des sites', () => {
      renderAt(pages.tarifs.path);
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
      await user.click(within(mainNav()).getByRole('link', { name: 'Tarifs' }));
      expect(menuButton()).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('sous-menu Métiers', () => {
    it('est replié par défaut et se déplie au clic', async () => {
      const user = userEvent.setup();
      renderAt('/');
      expect(metiersButton()).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByRole('link', { name: 'Artisan' })).not.toBeInTheDocument();

      await user.click(metiersButton());
      expect(metiersButton()).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('link', { name: 'Artisan' })).toHaveAttribute('href', pages.artisan.path);
      expect(screen.getByRole('link', { name: 'Commerce' })).toHaveAttribute('href', pages.ecommerce.path);
      expect(screen.getByRole('link', { name: 'Restaurant' })).toHaveAttribute('href', pages.restaurant.path);
      expect(screen.getByRole('link', { name: 'Santé et bien-être' })).toHaveAttribute(
        'href',
        pages.independant.path,
      );
    });

    it('se replie avec Échap et rend le focus au bouton Métiers', async () => {
      const user = userEvent.setup();
      renderAt('/');
      await user.click(metiersButton());
      await user.keyboard('{Escape}');
      expect(metiersButton()).toHaveAttribute('aria-expanded', 'false');
      expect(metiersButton()).toHaveFocus();
    });

    it('se replie au clic en dehors', async () => {
      const user = userEvent.setup();
      renderAt('/');
      await user.click(metiersButton());
      await user.click(screen.getByRole('link', { name: 'Baptiste Sandoz' }));
      expect(metiersButton()).toHaveAttribute('aria-expanded', 'false');
    });

    it('se replie après avoir choisi un métier, qui est alors signalé', async () => {
      const user = userEvent.setup();
      renderAt('/');
      await user.click(metiersButton());
      await user.click(screen.getByRole('link', { name: 'Restaurant' }));
      expect(metiersButton()).toHaveAttribute('aria-expanded', 'false');
      expect(metiersButton()).toHaveClass('active');
    });
  });

  it('donne accès à l’espace client depuis la barre, et depuis le menu du téléphone', () => {
    renderAt(pages.tarifs.path);
    const liens = within(screen.getByRole('banner')).getAllByRole('link', { name: 'Espace client' });
    expect(liens).toHaveLength(2);
    for (const lien of liens) expect(lien).toHaveAttribute('href', pages.monEspace.path);
    expect(within(mainNav()).getByRole('link', { name: 'Espace client' })).toBeInTheDocument();
  });
});
