import { render, screen } from '@testing-library/react';
import { SitePreview, type SitePreviewModel } from './SitePreview';

const model: SitePreviewModel = {
  name: 'Atelier Test',
  tagline: 'Detailing',
  domain: 'www.atelier-test.fr',
  accent: '#1F6FB2',
  hero: 'Votre voiture comme neuve',
  cta: 'Réserver',
  nav: ['Accueil', 'Prestations'],
  navBadges: ['FR | EN'],
  logo: 'AT',
  search: { query: 'Google · « detailing »', title: 'Atelier Test', url: 'www.atelier-test.fr' },
  sections: [
    { type: 'calculator', title: 'Calculez votre prix', label: 'Surface', value: '120 m²', result: 'Prix estimé : 84 €' },
    { type: 'booking', title: 'Réservez', subtitle: 'À domicile', days: ['9', '10', '11', '12'], slots: ['9:00'], deposit: 'Acompte payé' },
    { type: 'table', title: 'Réserver une table', details: ['4 personnes'] },
    { type: 'shop', title: 'Boutique', products: ['Produit · 24 €'] },
    { type: 'note', text: 'Click & collect' },
    { type: 'gallery', count: 3 },
    { type: 'beforeAfter', before: 'Avant', after: 'Après' },
    { type: 'reviews', title: '★★★★★', text: '[avis réels]' },
    { type: 'contactForm', title: 'Contact' },
    { type: 'contactButtons', buttons: ['Appeler'] },
  ],
  footer: ['Atelier Test', 'Mentions légales'],
  install: { title: "Installer l'appli", text: "sur l'écran d'accueil" },
};

describe('SitePreview', () => {
  it('dessine le site, caché aux lecteurs d’écran qui lisent la description', () => {
    const { container } = render(
      <SitePreview label="Aperçu" caption="Exemple" description="Site avec réservation." model={model} />,
    );
    const aside = screen.getByRole('complementary', { name: 'Aperçu' });
    expect(screen.getByText('Site avec réservation.')).toHaveAttribute('aria-live', 'polite');
    const dessin = container.querySelector('[aria-hidden="true"]');
    expect(dessin).toHaveTextContent('www.atelier-test.fr');
    expect(dessin).toHaveTextContent('Votre voiture comme neuve');
    expect(aside.style.getPropertyValue('--preview-accent')).toBe('#1F6FB2');
  });

  it('affiche chaque type de section', () => {
    const { container } = render(<SitePreview label="Aperçu" description="d" model={model} />);
    for (const texte of [
      'Prix estimé : 84 €',
      'Acompte payé',
      '4 personnes',
      'Produit · 24 €',
      'Click & collect',
      'Avant',
      '[avis réels]',
      'Appeler',
      "Installer l'appli",
      'FR | EN',
      'AT',
      'Google · « detailing »',
    ]) {
      expect(container).toHaveTextContent(texte);
    }
  });

  it('affiche un message tant qu’il n’y a pas de modèle', () => {
    render(<SitePreview label="Aperçu" description="Vide" model={null} emptyMessage="Choisissez un type de site." />);
    expect(screen.getByText('Choisissez un type de site.')).toBeInTheDocument();
  });
});
