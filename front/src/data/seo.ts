import type { QuestionFaq } from './faq';
import { contact } from './navigation';
import type { Formule } from './offres';
import { pages, site } from './pages';

/** Pages exclues du sitemap et marquées « noindex » : pages pas encore construites et espace client (privé). */
export const pagesNonIndexees: (keyof typeof pages)[] = [
  'monEspace',
  'connexion',
  'lienConnexion',
  'motDePasse',
  'confirmerEmail',
  'suppression',
];

/** Adresse complète d'une page. */
export const urlComplete = (chemin: string) => `${site.url}${chemin === '/' ? '/' : chemin}`;

/** Chemins publiés dans le sitemap. */
export function cheminsIndexables() {
  return (Object.keys(pages) as (keyof typeof pages)[])
    .filter((cle) => !pagesNonIndexees.includes(cle))
    .map((cle) => pages[cle].path);
}

/** Contenu du fichier `sitemap.xml`. */
export function genererSitemap(chemins: string[] = cheminsIndexables()) {
  const urls = chemins.map((chemin) => `  <url><loc>${urlComplete(chemin)}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

/** Contenu du fichier `robots.txt`. */
export const robotsTxt = () => `User-agent: *\nAllow: /\nDisallow: ${pages.monEspace.path}\n\nSitemap: ${site.url}/sitemap.xml\n`;

/** Données structurées de l'entreprise (schema.org). Seuls des faits établis : pas d'adresse ni de note inventées. */
export function jsonLdEntreprise() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: site.name,
    description: pages.accueil.description,
    url: urlComplete('/'),
    email: contact.email,
    ...(contact.phone ? { telephone: contact.phone } : {}),
    address: { '@type': 'PostalAddress', addressLocality: 'Amiens', addressRegion: 'Somme', addressCountry: 'FR' },
    areaServed: [{ '@type': 'City', name: 'Amiens' }, { '@type': 'Country', name: 'France' }],
    sameAs: [contact.portfolio],
  };
}

/** Données structurées de la FAQ. */
export function jsonLdFaq(questions: QuestionFaq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: { '@type': 'Answer', text: q.reponse.join(' ') },
    })),
  };
}

/** Données structurées des formules (prix en euros, TVA non applicable). */
export function jsonLdOffres(formules: Formule[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'Formules de site internet',
    url: urlComplete(pages.tarifs.path),
    itemListElement: formules.map((formule) => ({
      '@type': 'Offer',
      name: `Site ${formule.nom}`,
      description: formule.accroche,
      priceCurrency: 'EUR',
      ...(formule.prixMinimum
        ? { priceSpecification: { '@type': 'PriceSpecification', minPrice: formule.prix, priceCurrency: 'EUR' } }
        : { price: formule.prix }),
      seller: { '@type': 'ProfessionalService', name: site.name },
    })),
  };
}
