/**
 * Pages lisibles sans JavaScript, pour les moteurs de recherche et les assistants.
 * Pour chaque page publique : titre, description, adresse canonique, données structurées et le texte principal
 * (titre, présentation, services, coordonnées). L'application React remplace ce contenu au chargement.
 * Les textes viennent des mêmes données que le site : rien n'est écrit deux fois.
 */
import { autonomie, hero, livraison, methode, metiers } from '../data/accueil';
import { aPropos } from '../data/apropos';
import { questionsFaq } from '../data/faq';
import { deroulementInformatique, informatiqueMentions, pageInformatique, servicesInformatique } from '../data/informatique';
import { pagesMetier, type PageMetierId } from '../data/metiers';
import { contact } from '../data/navigation';
import { pages, site, type PageInfo } from '../data/pages';
import { pageRealisations, realisations } from '../data/realisations';
import { cheminRealisation } from '../data/realisationsIds';
import { jsonLdEntreprise, jsonLdFaq, pagesNonIndexees, urlComplete } from '../data/seo';
import { carteTextes, zoneSansFrais } from '../data/zones';
import { formatTitle } from '../components/PageMeta/formatTitle';

export type PageStatique = {
  chemin: string;
  titre: string;
  description: string;
  /** HTML placé dans `#root`. */
  contenu: string;
  jsonLd: object[];
};

/** Échappe un texte pour le HTML. */
export function echapper(texte: string): string {
  return texte.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const p = (texte: string) => `<p>${echapper(texte)}</p>`;
const liste = (items: string[]) => `<ul>${items.map((i) => `<li>${echapper(i)}</li>`).join('')}</ul>`;
const lien = (chemin: string, texte: string) => `<a href="${echapper(chemin)}">${echapper(texte)}</a>`;
const section = (titre: string, corps: string) => `<section><h2>${echapper(titre)}</h2>${corps}</section>`;

/** Fil d'Ariane (schema.org) : accueil, puis les pages données. */
function filAriane(etapes: { nom: string; chemin: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ nom: 'Accueil', chemin: '/' }, ...etapes].map((e, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: e.nom,
      item: urlComplete(e.chemin),
    })),
  };
}

/** Navigation et coordonnées, communes à toutes les pages. */
function enveloppe(corps: string): string {
  const nav = [
    pages.accueil,
    pages.realisations,
    pages.artisan,
    pages.ecommerce,
    pages.restaurant,
    pages.independant,
    pages.informatique,
    pages.aPropos,
    pages.devis,
    pages.rendezVous,
  ];
  const { rue, codePostal, ville } = contact.adresse;
  const coordonnees = [
    `${site.name}, ${hero.identite.role}`,
    `${rue}, ${codePostal} ${ville}`,
    ...(contact.phone ? [`Téléphone : ${contact.phone}`] : []),
    `E-mail : ${contact.email}`,
  ];
  return (
    `<header><nav aria-label="Navigation principale"><ul>${nav.map((n) => `<li>${lien(n.path, n.title)}</li>`).join('')}</ul></nav></header>` +
    `<main>${corps}</main>` +
    `<footer><address>${coordonnees.map(echapper).join('<br />')}</address></footer>`
  );
}

function page(info: PageInfo, corps: string, jsonLd: object[] = [], titre = info.heading): PageStatique {
  const ariane = info.path === '/' ? [] : [filAriane([{ nom: info.title, chemin: info.path }])];
  return {
    chemin: info.path,
    titre: formatTitle(info.title),
    description: info.description,
    contenu: enveloppe(`<h1>${echapper(titre)}</h1>${p(info.description)}${corps}`),
    jsonLd: [...jsonLd, ...ariane],
  };
}

const zone = carteTextes.intro(zoneSansFrais());

function accueil(): PageStatique {
  const corps = [
    p(hero.badge),
    p(hero.text),
    section(metiers.question, liste(metiers.items)),
    section(autonomie.titre, p(autonomie.intro) + liste(autonomie.items.map((i) => `${i.titre} : ${i.texte}`))),
    section(
      'Mes réalisations',
      `<ul>${realisations.map((r) => `<li>${lien(cheminRealisation(r.id), r.titre)} : ${echapper(r.resume)}</li>`).join('')}</ul>`,
    ),
    section(methode.title, `<ol>${methode.steps.map((s) => `<li>${echapper(`${s.title} : ${s.text}`)}</li>`).join('')}</ol>`),
    section(livraison.titre, liste(livraison.items.map((i) => `${i.titre} : ${i.texte}`))),
    section(
      'Questions fréquentes',
      questionsFaq.map((q) => `<h3>${echapper(q.question)}</h3>${q.reponse.map(p).join('')}`).join(''),
    ),
    section(carteTextes.titre, p(zone)),
  ].join('');
  return page(pages.accueil, corps, [jsonLdEntreprise(), jsonLdFaq(questionsFaq)], `${hero.identite.role} – ${pages.accueil.heading}`);
}

function listeRealisations(): PageStatique {
  const corps =
    p(pageRealisations.intro) +
    realisations
      .map((r) => `<article><h2>${lien(cheminRealisation(r.id), r.titre)}</h2>${p(`${r.categorie} · ${r.annee}`)}${p(r.resume)}</article>`)
      .join('');
  return page(pages.realisations, corps);
}

function realisation(r: (typeof realisations)[number]): PageStatique {
  const chemin = cheminRealisation(r.id);
  const corps = [
    p(`${r.categorie} · ${r.annee}`),
    section(pageRealisations.contexte, p(r.contexte)),
    section(pageRealisations.besoin, p(r.besoin)),
    section(pageRealisations.solution, p(r.solution)),
    section(pageRealisations.fonctionnalites, liste(r.fonctionnalites)),
    section(pageRealisations.technos, liste(r.technos)),
    r.demo ? p(`${r.demo.label} : ${r.demo.url}`) : '',
    `<p>${lien(pages.realisations.path, 'Toutes les réalisations')}</p>`,
  ].join('');
  return {
    chemin,
    titre: formatTitle(`${r.titre} · Réalisations`),
    description: r.resume,
    contenu: enveloppe(`<h1>${echapper(r.titre)}</h1>${p(r.resume)}${corps}`),
    jsonLd: [
      filAriane([
        { nom: pages.realisations.title, chemin: pages.realisations.path },
        { nom: r.titre, chemin },
      ]),
    ],
  };
}

function metier(id: PageMetierId): PageStatique {
  const m = pagesMetier[id];
  return page(pages[id], p(m.public) + p(m.intro) + p(zone));
}

function informatique(): PageStatique {
  const corps = [
    p(pageInformatique.badge),
    p(pageInformatique.intro),
    section(
      pageInformatique.services.title,
      liste(
        servicesInformatique.map(
          (s) => `${s.nom} : ${s.description}${s.bientot ? ` (${informatiqueMentions.bientot.toLowerCase()})` : ''}`,
        ),
      ),
    ),
    section(pageInformatique.deroulement.title, `<ol>${deroulementInformatique.map((d) => `<li>${echapper(`${d.titre} : ${d.texte}`)}</li>`).join('')}</ol>`),
    section(pageInformatique.tarif.title, p(pageInformatique.tarif.text)),
    p(informatiqueMentions.zone),
  ].join('');
  return page(pages.informatique, corps);
}

function propos(): PageStatique {
  const corps = [
    p(aPropos.intro),
    section(aPropos.parcours.titre, aPropos.parcours.paragraphes.map(p).join('')),
    section(aPropos.valeurs.titre, liste(aPropos.valeurs.items.map((v) => `${v.title} : ${v.text}`))),
    section(aPropos.zone.titre, liste(aPropos.zone.items)),
  ].join('');
  return page(pages.aPropos, corps);
}

/** Toutes les pages publiques, avec leur contenu lisible sans JavaScript. */
export function toutesLesPages(): PageStatique[] {
  const speciales = new Map<string, () => PageStatique>([
    ['accueil', accueil],
    ['realisations', listeRealisations],
    ['informatique', informatique],
    ['aPropos', propos],
    ...(Object.keys(pagesMetier) as PageMetierId[]).map((id) => [id, () => metier(id)] as const),
  ]);
  const cles = (Object.keys(pages) as (keyof typeof pages)[]).filter((cle) => !pagesNonIndexees.includes(cle));
  return [
    ...cles.map((cle) => speciales.get(cle)?.() ?? page(pages[cle], '')),
    ...realisations.map(realisation),
  ];
}

/** Page HTML complète, à partir du `index.html` construit par Vite. */
export function htmlDePage(modele: string, page: PageStatique): string {
  const url = urlComplete(page.chemin);
  const tete = [
    `<title>${echapper(page.titre)}</title>`,
    `<meta name="description" content="${echapper(page.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${echapper(site.name)}" />`,
    `<meta property="og:title" content="${echapper(page.titre)}" />`,
    `<meta property="og:description" content="${echapper(page.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:locale" content="fr_FR" />`,
  ].join('\n    ');
  // Les données structurées vont dans #root : React les remplace par les siennes, sans doublon.
  // Le texte de la page (data-statique) est pour les robots et les navigateurs sans JavaScript : caché dès que
  // JavaScript tourne (classe « js » posée dans index.html), sinon il s'affiche sans mise en forme avant React.
  const donnees = page.jsonLd
    .map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`)
    .join('');
  return modele
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace(/<meta name="description"[^>]*>/, '')
    .replace('</head>', `  ${tete}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${donnees}<div data-statique>${page.contenu}</div></div>`);
}
