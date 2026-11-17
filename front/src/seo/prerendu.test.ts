import { contact } from '../data/navigation';
import { pages } from '../data/pages';
import { cheminsIndexables } from '../data/seo';
import { echapper, htmlDePage, toutesLesPages } from './prerendu';

const modele = `<!doctype html><html lang="fr"><head>
<meta name="description" content="ancienne" />
<title>Ancien titre</title>
</head><body><div id="root"></div><script type="module" src="/assets/index.js"></script></body></html>`;

describe('Pages lisibles sans JavaScript', () => {
  const liste = toutesLesPages();

  it('couvre exactement les pages du plan du site, sans doublon', () => {
    const chemins = liste.map((p) => p.chemin);
    expect(new Set(chemins).size).toBe(chemins.length);
    expect([...chemins].sort()).toEqual([...cheminsIndexables()].sort());
  });

  it('met Amiens, les coordonnées et les données de l’entreprise sur l’accueil', () => {
    const accueil = liste.find((p) => p.chemin === '/')!;
    expect(accueil.titre).toContain('Amiens');
    expect(accueil.contenu).toMatch(/<h1>[^<]*Amiens/);
    expect(accueil.contenu).toContain(contact.adresse.rue);
    expect(accueil.contenu).toContain('Questions fréquentes');
    const types = accueil.jsonLd.map((j) => (j as { '@type': string })['@type']);
    expect(types).toEqual(['ProfessionalService', 'FAQPage']);
  });

  it('donne un fil d’Ariane aux autres pages', () => {
    const propos = liste.find((p) => p.chemin === pages.aPropos.path)!;
    expect(propos.jsonLd.some((j) => (j as { '@type': string })['@type'] === 'BreadcrumbList')).toBe(true);
    expect(propos.contenu).toContain('Mon parcours');
  });

  it('remplace le titre et la description, ajoute la canonique et le contenu', () => {
    const propos = liste.find((p) => p.chemin === pages.aPropos.path)!;
    const html = htmlDePage(modele, propos);
    expect(html).not.toContain('Ancien titre');
    expect(html).not.toContain('content="ancienne"');
    expect(html).toContain('<link rel="canonical" href="https://bsandoz.fr/a-propos" />');
    expect(html).toContain(`<title>${echapper(propos.titre)}</title>`);
    expect(html).toMatch(/<div id="root"><script type="application\/ld\+json">/);
    expect(html).toContain('<script type="module" src="/assets/index.js">');
  });

  it('échappe le HTML', () => {
    expect(echapper('<a href="x">&</a>')).toBe('&lt;a href=&quot;x&quot;&gt;&amp;&lt;/a&gt;');
  });
});
