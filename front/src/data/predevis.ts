/**
 * Pré-devis automatique envoyé dans l'accusé de réception d'une demande de devis
 * (cahier des charges, section 6) : formule conseillée, fourchette de prix, délai et options suggérées.
 * Fonctions pures, calculées avec les mêmes prix que le configurateur (`offres.ts`, `calculs.ts`).
 */
import {
  calculerEstimation,
  garderOptionsValides,
  optionsDisponibles,
  type Configuration,
} from './calculs';
import type { BesoinId } from './devis';
import {
  formatPrix,
  formuleParId,
  formules,
  mentionsPrix,
  options,
  packs,
  prixFormule,
  prixOption,
  type FormuleId,
  type MetierId,
  type OptionId,
} from './offres';
import { pages, site } from './pages';

/** Nombre maximal d'options suggérées (cahier des charges : 2 à 4). */
export const MAX_SUGGESTIONS = 3;

/** Besoins qui demandent un site fonctionnel. */
const besoinsFonctionnels: BesoinId[] = ['rdv', 'prix', 'devis', 'appli', 'vente'];
/** Besoins couverts par une vitrine+ (formulaire, galerie, référencement local). */
const besoinsVitrinePlus: BesoinId[] = ['realisations', 'google', 'contact'];

/** Option qui répond à chaque besoin, selon le métier. */
function optionPourBesoin(besoin: BesoinId, metier: MetierId): OptionId | null {
  switch (besoin) {
    case 'rdv':
      return metier === 'restaurant' ? 'table' : 'rdv';
    case 'prix':
    case 'devis':
      return 'calcul';
    case 'appli':
      return 'pwa';
    case 'vente':
      return metier === 'restaurant' ? 'clickcollect' : 'boutique';
    case 'google':
      return 'seo';
    case 'realisations':
      return 'avantapres';
    default:
      return null;
  }
}

export type PreDevis = {
  /** D'où vient l'estimation : la configuration faite dans « Composer mon site », ou les besoins cochés. */
  source: 'configurateur' | 'besoins';
  /** Formule conseillée ; `null` si les besoins ne permettent pas encore de trancher. */
  formule: FormuleId | null;
  /** Options retenues pour l'estimation. */
  options: OptionId[];
  /** Fourchette de prix (bas = haut pour un prix fixe). */
  fourchette: { bas: number; haut: number } | null;
  delai: string | null;
  /** Options suggérées en plus, les plus utiles d'abord. */
  suggestions: OptionId[];
};

/** Déduit une configuration des besoins cochés et du métier. */
export function configurationDepuisBesoins(metier: MetierId | null, besoins: BesoinId[]): Configuration {
  const formule: FormuleId | null = besoins.some((b) => besoinsFonctionnels.includes(b))
    ? 'fonctionnel'
    : besoins.some((b) => besoinsVitrinePlus.includes(b))
      ? 'vitrinePlus'
      : null;
  const pourMetier = formule === 'fonctionnel' ? (metier ?? 'autre') : metier;
  const voulues = besoins
    .map((b) => optionPourBesoin(b, pourMetier ?? 'autre'))
    .filter((id): id is OptionId => id !== null);
  const sansDoublon = [...new Set(voulues)];
  return {
    formule,
    metier: pourMetier,
    options: garderOptionsValides(sansDoublon, formule, pourMetier),
    precisions: {},
  };
}

/**
 * Options à suggérer : d'abord celles qui complètent un pack (une option offerte en plus),
 * puis les autres options proposées pour la formule et le métier, dans l'ordre du catalogue.
 */
export function optionsSuggerees(config: Configuration, max = MAX_SUGGESTIONS): OptionId[] {
  const disponibles = optionsDisponibles(config.formule, config.metier).filter((id) => !config.options.includes(id));
  const completantUnPack = packs
    .filter((pack) => pack.requises.every((id) => optionsDisponibles(config.formule, config.metier).includes(id)))
    .map((pack) => pack.requises.filter((id) => !config.options.includes(id)))
    .filter((manquantes) => manquantes.length === 1)
    .map(([manquante]) => manquante);
  const ordre = [...new Set([...completantUnPack, ...disponibles])];
  return ordre.filter((id) => disponibles.includes(id)).slice(0, max);
}

/** Pré-devis d'une demande. La configuration du configurateur, si elle existe, l'emporte sur les besoins. */
export function preDevis(
  demande: { metier: MetierId | null; besoins: BesoinId[] },
  configuration: Configuration | null,
): PreDevis {
  const depuisConfigurateur = Boolean(configuration?.formule);
  const config = depuisConfigurateur ? configuration! : configurationDepuisBesoins(demande.metier, demande.besoins);

  if (!config.formule) {
    return { source: 'besoins', formule: null, options: [], fourchette: null, delai: null, suggestions: [] };
  }

  const estimation = calculerEstimation(config);
  return {
    source: depuisConfigurateur ? 'configurateur' : 'besoins',
    formule: config.formule,
    options: config.options,
    fourchette: estimation.fourchette ?? { bas: estimation.total, haut: estimation.total },
    delai: estimation.delai,
    suggestions: optionsSuggerees(config),
  };
}

export const preDevisTextes = {
  titre: 'Première estimation (indicative)',
  formule: 'Formule conseillée',
  options: 'Options retenues',
  prix: 'Prix estimé',
  delai: 'Délai',
  suggestions: 'Options qui pourraient vous servir',
  sansFormule:
    'Vos besoins ne permettent pas encore de choisir une formule. Pour vous situer, voici les trois formules :',
  configurateur: "D'après la configuration faite dans « Composer mon site ».",
  besoins: "D'après les besoins que vous avez cochés.",
  avertissement:
    'Cette estimation est calculée automatiquement : je la confirme ou l’ajuste après avoir lu votre demande, avant tout engagement.',
  rendezVous: 'Pour en parler de vive voix, un rendez-vous découverte gratuit :',
};

/** Pré-devis mis en forme pour un e-mail texte. */
export function texteDuPreDevis(p: PreDevis): string {
  const t = preDevisTextes;
  const lignes = [t.titre, '-'.repeat(t.titre.length)];

  if (!p.formule || !p.fourchette) {
    lignes.push(t.sansFormule);
    for (const formule of formules) lignes.push(`- ${formule.nom} : ${prixFormule(formule)} (${formule.delai})`);
  } else {
    const formule = formuleParId(p.formule);
    const { bas, haut } = p.fourchette;
    lignes.push(p.source === 'configurateur' ? t.configurateur : t.besoins, '');
    lignes.push(`${t.formule} : ${formule.nom}`);
    if (p.options.length) lignes.push(`${t.options} : ${p.options.map((id) => options[id].nom).join(', ')}`);
    lignes.push(`${t.prix} : ${bas === haut ? formatPrix(bas) : `${formatPrix(bas)} à ${formatPrix(haut)}`}`);
    if (p.delai) lignes.push(`${t.delai} : ${p.delai}`);
    if (p.suggestions.length) {
      lignes.push('', `${t.suggestions} :`);
      for (const id of p.suggestions) lignes.push(`- ${options[id].nom} (${prixOption(options[id])})`);
    }
  }

  lignes.push('', mentionsPrix.tva, t.avertissement, '', t.rendezVous, `${site.url}${pages.rendezVous.path}`);
  return lignes.join('\n');
}
