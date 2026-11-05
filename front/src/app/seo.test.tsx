import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { pages } from '../data/pages';
import { AppRoutes } from './routes';

function typesJsonLd(path: string) {
  const { container } = render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
  return Array.from(container.querySelectorAll('script[type="application/ld+json"]')).map(
    (script) => JSON.parse(script.textContent ?? '{}')['@type'],
  );
}

describe('Données structurées et indexation', () => {
  it.each([
    [pages.accueil.path, 'ProfessionalService'],
    [pages.faq.path, 'FAQPage'],
    [pages.tarifs.path, 'OfferCatalog'],
  ])('%s porte ses données structurées', (path, type) => {
    expect(typesJsonLd(path)).toEqual([type]);
  });

  it('marque « noindex » une page encore provisoire et la 404', () => {
    typesJsonLd(pages.rendezVous.path);
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
    document.head.innerHTML = '';
    typesJsonLd('/adresse-inconnue');
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  });

  it('n’indexe pas moins les pages construites', () => {
    document.head.innerHTML = '<meta name="robots" content="noindex" />';
    typesJsonLd(pages.tarifs.path);
    expect(document.head.querySelector('meta[name="robots"]')).toBeNull();
  });
});
