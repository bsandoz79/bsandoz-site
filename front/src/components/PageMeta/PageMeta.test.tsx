import { render } from '@testing-library/react';
import { formatTitle } from './formatTitle';
import { PageMeta } from './PageMeta';

function descriptionTags() {
  return document.head.querySelectorAll('meta[name="description"]');
}

describe('PageMeta', () => {
  beforeEach(() => {
    document.head.innerHTML = '<title>Titre initial</title><meta name="description" content="Initiale" />';
  });

  it("formate le titre avec le nom du site", () => {
    expect(formatTitle('Tarifs')).toBe('Tarifs – Baptiste Sandoz');
    expect(formatTitle('')).toBe('Baptiste Sandoz – Création de sites web à Amiens');
  });

  it('met à jour le titre et la description existante sans la dupliquer', () => {
    render(<PageMeta title="Tarifs" description="Nos prix" />);
    expect(document.title).toBe('Tarifs – Baptiste Sandoz');
    expect(descriptionTags()).toHaveLength(1);
    expect(descriptionTags()[0]).toHaveAttribute('content', 'Nos prix');
  });

  it("crée la description si elle n'existe pas", () => {
    document.head.innerHTML = '';
    render(<PageMeta title="FAQ" description="Questions" />);
    expect(descriptionTags()).toHaveLength(1);
    expect(descriptionTags()[0]).toHaveAttribute('content', 'Questions');
  });

  it('donne l’adresse canonique de la page', () => {
    render(<PageMeta title="Accueil" description="d" />);
    expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute('href', 'https://bsandoz.fr/');
  });

  it('marque une page « noindex », puis retire la mention', () => {
    const { rerender } = render(<PageMeta title="Provisoire" description="d" noindex />);
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
    rerender(<PageMeta title="Construite" description="d" />);
    expect(document.head.querySelector('meta[name="robots"]')).toBeNull();
  });

  it('suit les changements de page', () => {
    const { rerender } = render(<PageMeta title="A" description="Page A" />);
    rerender(<PageMeta title="B" description="Page B" />);
    expect(document.title).toBe('B – Baptiste Sandoz');
    expect(descriptionTags()[0]).toHaveAttribute('content', 'Page B');
  });
});
