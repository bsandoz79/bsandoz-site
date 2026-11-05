import { questionsFaq } from './faq';
import { formules } from './offres';
import { pages } from './pages';
import { cheminsIndexables, genererSitemap, jsonLdEntreprise, jsonLdFaq, jsonLdOffres, robotsTxt, urlComplete } from './seo';

describe('SEO', () => {
  it('construit les adresses complètes', () => {
    expect(urlComplete('/')).toBe('https://bsandoz.fr/');
    expect(urlComplete('/tarifs')).toBe('https://bsandoz.fr/tarifs');
  });

  it('publie toutes les pages publiques, pas celles de l’espace client', () => {
    const chemins = cheminsIndexables();
    expect(chemins).toContain('/');
    expect(chemins).toContain(pages.mentionsLegales.path);
    expect(chemins).toContain(pages.rendezVous.path);
    expect(chemins.filter((c) => c.startsWith('/mon-espace'))).toEqual([]);
    expect(chemins).toHaveLength(Object.keys(pages).length - 4);
  });

  it('demande aux robots de ne pas visiter l’espace client', () => {
    expect(robotsTxt()).toContain('Disallow: /mon-espace');
  });

  it('génère un sitemap valide', () => {
    const xml = genererSitemap(['/', '/tarifs']);
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(xml).toContain('<url><loc>https://bsandoz.fr/tarifs</loc></url>');
    expect(new DOMParser().parseFromString(xml, 'application/xml').querySelector('parsererror')).toBeNull();
  });

  it('indique le sitemap dans robots.txt', () => {
    expect(robotsTxt()).toContain('Sitemap: https://bsandoz.fr/sitemap.xml');
  });

  it('décrit l’entreprise sans inventer d’adresse ni de note', () => {
    const entreprise = jsonLdEntreprise();
    expect(entreprise).toMatchObject({ '@type': 'ProfessionalService', email: 'contact@bsandoz.fr' });
    expect(entreprise.address).toEqual({
      '@type': 'PostalAddress',
      addressLocality: 'Amiens',
      addressRegion: 'Somme',
      addressCountry: 'FR',
    });
    expect(entreprise).not.toHaveProperty('aggregateRating');
    expect(entreprise).not.toHaveProperty('telephone');
  });

  it('reprend chaque question de la FAQ', () => {
    const faq = jsonLdFaq(questionsFaq);
    expect(faq.mainEntity).toHaveLength(questionsFaq.length);
    expect(faq.mainEntity[0].acceptedAnswer.text).toContain('3 jours');
  });

  it('décrit les formules avec leur prix', () => {
    const offres = jsonLdOffres(formules).itemListElement;
    expect(offres[0]).toMatchObject({ name: 'Site Vitrine', price: 99, priceCurrency: 'EUR' });
    expect(offres[2]).toMatchObject({ name: 'Site Fonctionnel', priceSpecification: { minPrice: 989 } });
  });
});
