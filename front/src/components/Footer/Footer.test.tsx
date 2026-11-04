import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { contact } from '../../data/navigation';
import { pages } from '../../data/pages';
import { Footer } from './Footer';

function renderFooter() {
  return render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>,
  );
}

describe('Footer', () => {
  afterEach(() => {
    contact.phone = '';
  });

  it('présente Baptiste Sandoz et sa zone', () => {
    renderFooter();
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Baptiste Sandoz');
    expect(screen.getByText('Amiens · Somme · à distance partout en France')).toBeInTheDocument();
  });

  it("affiche l'e-mail et le portfolio", () => {
    renderFooter();
    const nav = within(screen.getByRole('navigation', { name: 'Contact' }));
    expect(nav.getByRole('link', { name: 'contact@bsandoz.fr' })).toHaveAttribute(
      'href',
      'mailto:contact@bsandoz.fr',
    );
    expect(nav.getByRole('link', { name: 'Mon portfolio' })).toHaveAttribute('href', 'https://portfolio.bsandoz.fr');
  });

  it("n'affiche pas de téléphone tant qu'il n'est pas renseigné", () => {
    renderFooter();
    expect(screen.queryByRole('link', { name: /^0/ })).not.toBeInTheDocument();
  });

  it('affiche le téléphone une fois renseigné', () => {
    contact.phone = '06 00 00 00 00';
    renderFooter();
    expect(screen.getByRole('link', { name: '06 00 00 00 00' })).toHaveAttribute('href', 'tel:0600000000');
  });

  it('donne accès aux pages légales', () => {
    renderFooter();
    const nav = within(screen.getByRole('navigation', { name: 'Informations légales' }));
    expect(nav.getByRole('link', { name: 'Mentions légales' })).toHaveAttribute('href', pages.mentionsLegales.path);
    expect(nav.getByRole('link', { name: 'CGV' })).toHaveAttribute('href', pages.cgv.path);
    expect(nav.getByRole('link', { name: 'Confidentialité' })).toHaveAttribute('href', pages.confidentialite.path);
  });
});
