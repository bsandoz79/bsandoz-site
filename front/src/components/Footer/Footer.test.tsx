import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { choisir, reinitialiserConsentement, useConsentement } from '../../app/consentement';
import { contact } from '../../data/navigation';
import { pages } from '../../data/pages';
import { Footer } from './Footer';

function renderFooter(chemin: string = pages.realisations.path) {
  return render(
    <MemoryRouter initialEntries={[chemin]}>
      <Footer />
    </MemoryRouter>,
  );
}

describe('Footer', () => {
  const telephone = contact.phone;
  afterEach(() => {
    contact.phone = telephone;
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

  it('mène au compte Instagram, dans un nouvel onglet', () => {
    renderFooter();
    const nav = within(screen.getByRole('navigation', { name: 'Contact' }));
    const lien = nav.getByRole('link', { name: 'Instagram @bsandoz_ (nouvel onglet)' });
    expect(lien).toHaveAttribute('href', 'https://www.instagram.com/bsandoz_/');
    expect(lien).toHaveAttribute('target', '_blank');
  });

  it('mène à la Page Facebook, dans un nouvel onglet', () => {
    renderFooter();
    const nav = within(screen.getByRole('navigation', { name: 'Contact' }));
    const lien = nav.getByRole('link', { name: 'Facebook bsandoz (nouvel onglet)' });
    expect(lien).toHaveAttribute('href', 'https://www.facebook.com/bsandoz');
    expect(lien).toHaveAttribute('target', '_blank');
  });

  it("n'affiche pas de téléphone s'il n'est pas renseigné", () => {
    contact.phone = '';
    renderFooter();
    expect(screen.queryByRole('link', { name: /^0/ })).not.toBeInTheDocument();
  });

  it('affiche le téléphone, cliquable', () => {
    renderFooter();
    expect(screen.getByRole('link', { name: '07 69 28 78 37' })).toHaveAttribute('href', 'tel:0769287837');
  });

  it('propose de demander un devis ou de prendre rendez-vous', () => {
    renderFooter();
    expect(screen.getByText('Un projet en tête ?')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Demander un devis' })).toHaveAttribute('href', pages.devis.path);
    expect(screen.getByRole('link', { name: 'Rendez-vous gratuit' })).toHaveAttribute('href', pages.rendezVous.path);
  });

  it.each([pages.accueil.path, pages.devis.path])('sauf sur %s, qui se termine déjà par le formulaire de contact', (chemin) => {
    renderFooter(chemin);
    expect(screen.queryByText('Un projet en tête ?')).not.toBeInTheDocument();
  });

  it('donne accès aux principales pages du site et aux droits de l’année', () => {
    renderFooter();
    const nav = within(screen.getByRole('navigation', { name: 'Le site' }));
    expect(nav.getByRole('link', { name: 'Réalisations' })).toHaveAttribute('href', pages.realisations.path);
    expect(screen.getByText(`© ${new Date().getFullYear()} Baptiste Sandoz`)).toBeInTheDocument();
  });

  it('donne accès aux pages légales', () => {
    renderFooter();
    const nav = within(screen.getByRole('navigation', { name: 'Informations légales' }));
    expect(nav.getByRole('link', { name: 'Mentions légales' })).toHaveAttribute('href', pages.mentionsLegales.path);
    expect(nav.getByRole('link', { name: 'CGV' })).toHaveAttribute('href', pages.cgv.path);
    expect(nav.getByRole('link', { name: 'Confidentialité' })).toHaveAttribute('href', pages.confidentialite.path);
  });

  it('« Services tiers » rouvre le bandeau pour changer d’avis', async () => {
    const user = userEvent.setup();
    window.localStorage.clear();
    reinitialiserConsentement();
    act(() => choisir('refuse'));
    let visible = false;
    function Temoin() {
      visible = useConsentement().bandeauVisible;
      return null;
    }
    render(
      <MemoryRouter>
        <Footer />
        <Temoin />
      </MemoryRouter>,
    );
    expect(visible).toBe(false);
    await user.click(screen.getByRole('button', { name: 'Services tiers' }));
    expect(visible).toBe(true);
  });

  it('liste les pages par métier, sorties de la barre de navigation', () => {
    renderFooter();
    const metiers = screen.getByRole('navigation', { name: 'Sites par métier' });
    expect(within(metiers).getByRole('link', { name: 'Services à domicile' })).toHaveAttribute('href', pages.artisan.path);
    expect(within(metiers).getByRole('link', { name: 'Professions libérales' })).toHaveAttribute('href', pages.liberal.path);
    expect(within(metiers).getAllByRole('link')).toHaveLength(11);
  });
});
