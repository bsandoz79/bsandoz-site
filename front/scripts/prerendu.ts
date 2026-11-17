/**
 * Après `vite build` : une page HTML par page publique (dist/<chemin>.html), lisible sans JavaScript.
 * Construit par Vite en mode serveur (vite build --ssr), puis lancé par node : voir `npm run build`.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { htmlDePage, toutesLesPages } from '../src/seo/prerendu';

const DIST = join(process.cwd(), 'dist');
const modele = readFileSync(join(DIST, 'index.html'), 'utf8');
const pages = toutesLesPages();

for (const page of pages) {
  // « / » reste index.html ; « /a-propos » devient a-propos.html (servi par le .htaccess, sans barre finale).
  const fichier = join(DIST, page.chemin === '/' ? 'index.html' : `${page.chemin.slice(1)}.html`);
  mkdirSync(dirname(fichier), { recursive: true });
  writeFileSync(fichier, htmlDePage(modele, page));
}

console.log(`Pages lisibles sans JavaScript : ${pages.length}.`);
