/**
 * Estimation jointe à une demande de devis partie de l'estimation en ligne : formule, options
 * (incluses et payantes), prix, délai et options qui pourraient servir. Envoyée dans l'accusé de réception.
 * Fonctions pures, calculées avec les mêmes prix que l'estimation (`offres.ts`, `calculs.ts`).
 */
import { calculerEstimation, optionsDisponibles, type Configuration } from './calculs';
import { formatPrix, formuleParId, mentionsPrix, options, prixOption, type FormuleId, type OptionId } from './offres';
import { origineDuSite, pages } from './pages';

/** Nombre maximal d'options suggérées. */
export const MAX_SUGGESTIONS = 3;

export type PreDevis = {
  formule: FormuleId;
  /** Options choisies, dans l'ordre. */
  options: OptionId[];
  /** Celles qui sont incluses dans le prix de la formule. */
  incluses: OptionId[];
  fourchette: { bas: number; haut: number };
  delai: string | null;
  /** Options proposées pour la formule et le métier, pas encore choisies. */
  suggestions: OptionId[];
};

/** Options à suggérer : les autres options proposées, dans l'ordre du catalogue. */
export function optionsSuggerees(config: Configuration, max = MAX_SUGGESTIONS): OptionId[] {
  return optionsDisponibles(config.formule, config.metier)
    .filter((id) => !config.options.includes(id))
    .slice(0, max);
}

/** Estimation d'une configuration ; `null` sans formule choisie. */
export function preDevis(config: Configuration): PreDevis | null {
  if (!config.formule) return null;
  const estimation = calculerEstimation(config);
  return {
    formule: config.formule,
    options: config.options,
    incluses: estimation.incluses,
    fourchette: estimation.fourchette ?? { bas: estimation.total, haut: estimation.total },
    delai: estimation.delai,
    suggestions: optionsSuggerees(config),
  };
}

export const preDevisTextes = {
  titre: 'Votre estimation (indicative)',
  intro: "D'après l'estimation faite sur le site.",
  formule: 'Formule',
  options: 'Options',
  inclus: 'incluse',
  prix: 'Prix estimé',
  delai: 'Délai',
  suggestions: 'Options qui pourraient vous servir',
  avertissement:
    'Cette estimation est calculée automatiquement : je la confirme ou l’ajuste après avoir lu votre demande, avant tout engagement.',
  rendezVous: 'Pour en parler de vive voix, un rendez-vous découverte gratuit :',
};

/** Estimation mise en forme pour un e-mail texte. */
export function texteDuPreDevis(p: PreDevis): string {
  const t = preDevisTextes;
  const formule = formuleParId(p.formule);
  const { bas, haut } = p.fourchette;
  const lignes = [t.titre, '-'.repeat(t.titre.length), t.intro, '', `${t.formule} : ${formule.nom}`];
  if (p.options.length) {
    const noms = p.options.map((id) => (p.incluses.includes(id) ? `${options[id].nom} (${t.inclus})` : options[id].nom));
    lignes.push(`${t.options} : ${noms.join(', ')}`);
  }
  lignes.push(`${t.prix} : ${bas === haut ? formatPrix(bas) : `${formatPrix(bas)} à ${formatPrix(haut)}`}`);
  if (p.delai) lignes.push(`${t.delai} : ${p.delai}`);
  if (p.suggestions.length) {
    lignes.push('', `${t.suggestions} :`);
    for (const id of p.suggestions) lignes.push(`- ${options[id].nom} (${prixOption(options[id])})`);
  }
  lignes.push('', mentionsPrix.tva, t.avertissement, '', t.rendezVous, `${origineDuSite()}${pages.rendezVous.path}`);
  return lignes.join('\n');
}
