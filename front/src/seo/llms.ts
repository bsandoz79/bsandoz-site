/**
 * Fichier `llms.txt` (https://llmstxt.org) : un résumé du site en Markdown, pour les assistants IA (ChatGPT, Claude,
 * Perplexity…). Ils y trouvent en quelques lignes qui je suis, ce que je propose, mes prix de départ et les pages utiles.
 * Généré au build à partir des mêmes données que le site : rien n'est écrit deux fois.
 */
import { hero } from '../data/accueil';
import { questionsFaq } from '../data/faq';
import { servicesInformatique } from '../data/informatique';
import { contact } from '../data/navigation';
import { formatPrix, formules, mentionsPrix, tarifHoraire } from '../data/offres';
import { pages, site } from '../data/pages';
import { realisations } from '../data/realisations';
import { cheminRealisation } from '../data/realisationsIds';
import { urlComplete } from '../data/seo';

const lienPage = (cle: keyof typeof pages) => `- [${pages[cle].title}](${urlComplete(pages[cle].path)}) : ${pages[cle].description}`;

const PAGES_METIER: (keyof typeof pages)[] = [
  'artisan',
  'ecommerce',
  'restaurant',
  'independant',
  'batiment',
  'beaute',
  'liberal',
  'cours',
  'hebergement',
  'association',
  'evenementiel',
];

export function genererLlmsTxt(): string {
  const { rue, codePostal, ville } = contact.adresse;
  const lignes = [
    `# ${site.name} – ${hero.identite.role}`,
    '',
    `> ${pages.accueil.description}`,
    '',
    hero.text,
    '',
    '## Contact',
    `- Adresse : ${rue}, ${codePostal} ${ville} (Somme, Hauts-de-France)`,
    ...(contact.phone ? [`- Téléphone : ${contact.phone}`] : []),
    `- E-mail : ${contact.email}`,
    `- Demander un devis : ${urlComplete(pages.devis.path)}`,
    `- Prendre rendez-vous : ${urlComplete(pages.rendezVous.path)}`,
    '',
    '## Formules de site',
    ...formules.map((f) => `- ${f.nom} (${f.prixMinimum ? 'à partir de ' : ''}${formatPrix(f.prix)}, ${f.delai}) : ${f.description}`),
    `- ${mentionsPrix.tva}`,
    '',
    '## Informatique sur place',
    `${pages.informatique.description} Tarif : ${formatPrix(tarifHoraire)} de l’heure.`,
    ...servicesInformatique.map((s) => `- ${s.nom} : ${s.description}`),
    '',
    '## Sites par métier',
    ...PAGES_METIER.map(lienPage),
    '',
    '## Réalisations',
    ...realisations.map((r) => `- [${r.titre}](${urlComplete(cheminRealisation(r.id))}) : ${r.resume}`),
    '',
    '## Questions fréquentes',
    ...questionsFaq.map((q) => `- ${q.question} ${q.reponse.join(' ')}`),
    '',
    '## Pages',
    lienPage('accueil'),
    lienPage('realisations'),
    lienPage('aPropos'),
    lienPage('informatique'),
    lienPage('mentionsLegales'),
    lienPage('cgv'),
    '',
  ];
  return lignes.join('\n');
}
