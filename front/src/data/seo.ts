import type { QuestionFaq } from './faq';
import { contact } from './navigation';
import { pages, site } from './pages';
import { cheminRealisation, idsRealisations } from './realisationsIds';

/** Pages exclues du sitemap et marquées « noindex » : pages pas encore construites et espace client (privé). */
export const pagesNonIndexees: (keyof typeof pages)[] = [
  'monEspace',
  'connexion',
  'lienConnexion',
  'motDePasse',
  'confirmerEmail',
  'suppression',
  'admin',
];

/** Adresse complète d'une page. */
export const urlComplete = (chemin: string) => `${site.url}${chemin === '/' ? '/' : chemin}`;

/** Chemins publiés dans le sitemap. */
export function cheminsIndexables() {
  return [
    ...(Object.keys(pages) as (keyof typeof pages)[]).filter((cle) => !pagesNonIndexees.includes(cle)).map((cle) => pages[cle].path),
    // Une page par réalisation.
    ...idsRealisations.map(cheminRealisation),
  ];
}

/** Contenu du fichier `sitemap.xml`. */
export function genererSitemap(chemins: string[] = cheminsIndexables()) {
  const urls = chemins.map((chemin) => `  <url><loc>${urlComplete(chemin)}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

/**
 * Clé IndexNow (indexnow.org) : publique par nature, elle prouve à Bing (et Yandex, Seznam…) que les adresses
 * envoyées viennent bien de ce site. Elle est servie dans le fichier `/<clé>.txt` (généré au build).
 */
export const INDEXNOW_CLE = '8fbbf36d29c065f8c3d833fb0971b56a';

/** Corps de la requête IndexNow : toutes les pages du sitemap, à envoyer après chaque mise en ligne. */
export function requeteIndexNow(chemins: string[] = cheminsIndexables()) {
  return {
    host: new URL(site.url).host,
    key: INDEXNOW_CLE,
    keyLocation: `${site.url}/${INDEXNOW_CLE}.txt`,
    urlList: chemins.map(urlComplete),
  };
}

/** Contenu du fichier `robots.txt`. */
export const robotsTxt = () => `User-agent: *\nAllow: /\nDisallow: ${pages.monEspace.path}\nDisallow: ${pages.admin.path}\n\nSitemap: ${site.url}/sitemap.xml\n`;

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
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact.adresse.rue,
      postalCode: contact.adresse.codePostal,
      addressLocality: contact.adresse.ville,
      addressRegion: 'Somme',
      addressCountry: 'FR',
    },
    areaServed: [
      { '@type': 'City', name: 'Amiens' },
      { '@type': 'City', name: 'Abbeville' },
      { '@type': 'AdministrativeArea', name: 'Somme' },
      { '@type': 'Country', name: 'France' },
    ],
    founder: { '@type': 'Person', name: site.name, jobTitle: 'Développeur web' },
    logo: urlComplete('/logo.png'),
    sameAs: [contact.portfolio, ...contact.reseaux.map((r) => r.url)],
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
