import { questionsFaq } from './faq';
import { pages } from './pages';
import { INDEXNOW_CLE, cheminsIndexables, pagesNonIndexees, genererSitemap, jsonLdEntreprise, jsonLdFaq, requeteIndexNow, robotsTxt, urlComplete } from './seo';

describe('SEO', () => {
  it('construit les adresses complètes', () => {
    expect(urlComplete('/')).toBe('https://bsandoz.fr/');
    expect(urlComplete('/devis')).toBe('https://bsandoz.fr/devis');
  });

  it('publie toutes les pages publiques, pas celles de l’espace client', () => {
    const chemins = cheminsIndexables();
    expect(chemins).toContain('/');
    expect(chemins).toContain(pages.mentionsLegales.path);
    expect(chemins).toContain(pages.rendezVous.path);
    expect(chemins.filter((c) => c.startsWith('/mon-espace'))).toEqual([]);
    // Pages publiques, plus une page par réalisation.
    expect(chemins).toHaveLength(Object.keys(pages).length - pagesNonIndexees.length + 6);
    expect(chemins).toContain('/realisations/alterno');
    expect(chemins).toContain('/realisations/choptonchargeur');
    expect(chemins).toContain('/realisations/cadeaux');
    expect(chemins).toContain('/realisations/ordv');
  });

  it('demande aux robots de ne pas visiter l’espace client', () => {
    expect(robotsTxt()).toContain('Disallow: /mon-espace');
    expect(robotsTxt()).toContain('Disallow: /admin');
  });

  it('génère un sitemap valide', () => {
    const xml = genererSitemap(['/', '/devis']);
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(xml).toContain('<url><loc>https://bsandoz.fr/devis</loc></url>');
    expect(new DOMParser().parseFromString(xml, 'application/xml').querySelector('parsererror')).toBeNull();
  });

  it('indique le sitemap dans robots.txt', () => {
    expect(robotsTxt()).toContain('Sitemap: https://bsandoz.fr/sitemap.xml');
  });

  it('décrit l’entreprise avec son adresse et son téléphone, sans inventer de note', () => {
    const entreprise = jsonLdEntreprise();
    expect(entreprise).toMatchObject({ '@type': 'ProfessionalService', email: 'contact@bsandoz.fr', telephone: '07 69 28 78 37' });
    expect(entreprise.address).toEqual({
      '@type': 'PostalAddress',
      streetAddress: '319 rue de Rouen',
      postalCode: '80000',
      addressLocality: 'Amiens',
      addressRegion: 'Somme',
      addressCountry: 'FR',
    });
    expect(entreprise).not.toHaveProperty('aggregateRating');
  });

  it('reprend chaque question de la FAQ', () => {
    const faq = jsonLdFaq(questionsFaq);
    expect(faq.mainEntity).toHaveLength(questionsFaq.length);
    expect(faq.mainEntity[0].acceptedAnswer.text).toContain('1 à 2 semaines');
  });

  it('prépare l’annonce IndexNow : clé valide, servie sur le site, toutes les pages du sitemap', () => {
    expect(INDEXNOW_CLE).toMatch(/^[a-f0-9]{32}$/);
    const r = requeteIndexNow();
    expect(r.host).toBe('bsandoz.fr');
    expect(r.keyLocation).toBe(`https://bsandoz.fr/${INDEXNOW_CLE}.txt`);
    expect(r.urlList).toEqual(cheminsIndexables().map(urlComplete));
    expect(r.urlList.some((u) => u.includes('/mon-espace'))).toBe(false);
  });

  it('relie le site au portfolio et aux réseaux sociaux (sameAs)', () => {
    expect(jsonLdEntreprise().sameAs).toEqual(['https://portfolio.bsandoz.fr', 'https://www.instagram.com/bsandoz_/']);
  });
});
