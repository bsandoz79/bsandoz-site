import { calculerEstimation, type Configuration } from '../../data/calculs';
import { besoins, budgets, delais, devisTextes, limitesPhotos, type BesoinId } from '../../data/devis';
import { formatPrix, formuleParId, metiers, options, type MetierId, type OptionId } from '../../data/offres';
import { preDevis, texteDuPreDevis } from '../../data/predevis';

/** Réponses du parcours de devis (sans les photos, qui ne sont pas enregistrées). */
export type Demande = {
  metier: MetierId | null;
  besoins: BesoinId[];
  description: string;
  lien: string;
  budget: string | null;
  delai: string | null;
  nom: string;
  entreprise: string;
  email: string;
  telephone: string;
  consentement: boolean;
};

export const demandeVide: Demande = {
  metier: null,
  besoins: [],
  description: '',
  lien: '',
  budget: null,
  delai: null,
  nom: '',
  entreprise: '',
  email: '',
  telephone: '',
  consentement: false,
};

export type Erreurs = Partial<Record<keyof Demande | 'photos', string>>;

const E = devisTextes.erreurs;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TELEPHONE = /^\+?[\d\s.-]{10,20}$/;

/** Vérifie les photos choisies (nombre, type, taille). */
export function verifierPhotos(photos: File[]): string | undefined {
  if (photos.length > limitesPhotos.nombre) return E.photosNombre(limitesPhotos.nombre);
  if (photos.some((p) => !limitesPhotos.types.includes(p.type))) return E.photosType;
  if (photos.some((p) => p.size > limitesPhotos.tailleMo * 1024 * 1024)) return E.photosTaille(limitesPhotos.tailleMo);
  return undefined;
}

/** Erreurs de l'étape `etape` (0 à 4). Une étape sans erreur renvoie un objet vide. */
export function validerEtape(etape: number, d: Demande, photos: File[] = []): Erreurs {
  const erreurs: Erreurs = {};
  if (etape === 0 && !d.metier) erreurs.metier = E.activite;
  if (etape === 1 && d.besoins.length === 0) erreurs.besoins = E.besoins;
  if (etape === 2) {
    if (d.description.trim().length < 20) erreurs.description = E.description;
    if (d.lien.trim() && !/^https?:\/\/\S+\.\S+/.test(d.lien.trim())) erreurs.lien = E.lien;
    const photo = verifierPhotos(photos);
    if (photo) erreurs.photos = photo;
  }
  if (etape === 3) {
    if (!d.budget) erreurs.budget = E.budget;
    if (!d.delai) erreurs.delai = E.delai;
  }
  if (etape === 4) {
    if (!d.nom.trim()) erreurs.nom = E.nom;
    if (!EMAIL.test(d.email.trim())) erreurs.email = E.email;
    if (d.telephone.trim() && !TELEPHONE.test(d.telephone.trim())) erreurs.telephone = E.telephone;
    if (!d.consentement) erreurs.consentement = E.consentement;
  }
  return erreurs;
}

/** Clé du brouillon dans le navigateur. */
export const CLE_BROUILLON = 'bsandoz.devis';

/** Brouillon : réponses, étape atteinte et estimation dont il est parti (`depuis`). */
export type Brouillon = { demande: Demande; etape: number; depuis: string | null };

/** Brouillon : toute valeur inattendue est ignorée. */
export function lireBrouillon(brut: unknown): Brouillon {
  const vide = { demande: demandeVide, etape: 0, depuis: null };
  if (!brut || typeof brut !== 'object') return vide;
  const o = brut as Record<string, unknown>;
  const d = (o.demande ?? {}) as Record<string, unknown>;
  const texte = (v: unknown) => (typeof v === 'string' ? v.slice(0, 5000) : '');
  const dans = (v: unknown, liste: { value: string }[]) => (liste.some((x) => x.value === v) ? (v as string) : null);
  return {
    etape: Number.isInteger(o.etape) ? Math.min(Math.max(o.etape as number, 0), 4) : 0,
    depuis: typeof o.depuis === 'string' ? o.depuis : null,
    demande: {
      metier: metiers.some((m) => m.id === d.metier) ? (d.metier as MetierId) : null,
      besoins: Array.isArray(d.besoins) ? (d.besoins.filter((b) => besoins.some((x) => x.id === b)) as BesoinId[]) : [],
      description: texte(d.description),
      lien: texte(d.lien),
      budget: dans(d.budget, budgets),
      delai: dans(d.delai, delais),
      nom: texte(d.nom),
      entreprise: texte(d.entreprise),
      email: texte(d.email),
      telephone: texte(d.telephone),
      consentement: d.consentement === true,
    },
  };
}

export function chargerBrouillon() {
  try {
    const texte = window.localStorage.getItem(CLE_BROUILLON);
    return lireBrouillon(texte ? JSON.parse(texte) : null);
  } catch {
    return lireBrouillon(null);
  }
}

export function enregistrerBrouillon(demande: Demande, etape: number, depuis: string | null = null) {
  try {
    window.localStorage.setItem(CLE_BROUILLON, JSON.stringify({ demande, etape, depuis }));
  } catch {
    // Stockage bloqué : le brouillon reste en mémoire.
  }
}

export function effacerBrouillon() {
  try {
    window.localStorage.removeItem(CLE_BROUILLON);
  } catch {
    // Rien à faire.
  }
}

/**
 * Empreinte d'une estimation (formule, activité, options, précisions). Le brouillon la garde :
 * une estimation différente veut dire une nouvelle simulation, donc un devis repris depuis celle-ci.
 */
export function signatureEstimation(config: Configuration | null): string | null {
  if (!config?.formule) return null;
  const precisionsTriees = Object.entries(config.precisions).sort(([a], [b]) => a.localeCompare(b));
  return JSON.stringify([config.formule, config.metier, [...config.options].sort(), precisionsTriees]);
}

/** Besoin du devis correspondant à chaque option de l'estimation. */
const BESOIN_DE_L_OPTION: Partial<Record<OptionId, BesoinId>> = {
  rdv: 'rdv',
  acompte: 'rdv',
  table: 'rdv',
  galerie: 'realisations',
  avantapres: 'realisations',
  calcul: 'prix',
  pwa: 'appli',
  boutique: 'vente',
  clickcollect: 'vente',
  seo: 'google',
  avis: 'google',
};

/** Besoins correspondant aux options réellement choisies dans l'estimation (rien d'ajouté d'office). */
export function besoinsDepuisEstimation(config: Configuration): BesoinId[] {
  const trouves = new Set<BesoinId>();
  for (const id of config.options) {
    const besoin = BESOIN_DE_L_OPTION[id];
    if (besoin) trouves.add(besoin);
  }
  return besoins.map((b) => b.id).filter((id) => trouves.has(id));
}

/** Première étape encore à remplir (la dernière si tout est rempli). */
export function etapeDeReprise(d: Demande) {
  for (let etape = 0; etape < 4; etape++) if (Object.keys(validerEtape(etape, d)).length > 0) return etape;
  return 4;
}

/**
 * Point de départ du devis.
 * - Le brouillon vient de la dernière estimation (ou il n'y en a pas) : on le reprend tel quel.
 * - Sinon (nouvelle simulation) : devis neuf, rien des essais précédents. Seuls sont cochés l'activité et
 *   les besoins réellement choisis dans l'estimation ; les coordonnées sont gardées pour ne pas les retaper.
 *   On ouvre la première question à remplir.
 */
export function demarrerDevis(brouillon: Brouillon, config: Configuration | null): Brouillon & { prerempli: boolean } {
  const signature = signatureEstimation(config);
  if (!config || !signature || signature === brouillon.depuis) {
    return { ...brouillon, prerempli: signature !== null && signature === brouillon.depuis };
  }
  const demande: Demande = {
    ...demandeRemiseAZero(brouillon.demande),
    metier: config.metier,
    besoins: besoinsDepuisEstimation(config),
  };
  return { demande, etape: etapeDeReprise(demande), depuis: signature, prerempli: true };
}

/** Repartir de zéro : questions du projet vidées, coordonnées gardées. */
export function demandeRemiseAZero(d: Demande): Demande {
  return { ...demandeVide, nom: d.nom, entreprise: d.entreprise, email: d.email, telephone: d.telephone };
}

/** Résumé de la configuration faite dans « Composer mon site », s'il y en a une. */
export function resumeConfiguration(config: Configuration | null) {
  if (!config?.formule) return null;
  const estimation = calculerEstimation(config);
  const fourchette = estimation.fourchette
    ? `${formatPrix(estimation.fourchette.bas)} – ${formatPrix(estimation.fourchette.haut)}`
    : formatPrix(estimation.total);
  return {
    formule: `Site ${formuleParId(config.formule).nom}`,
    options: config.options.map((id) => options[id].nom),
    estimation: fourchette,
  };
}

const libelle = (liste: { value: string; label: string }[], valeur: string | null) =>
  liste.find((x) => x.value === valeur)?.label ?? '';

/** Lignes lisibles du récapitulatif (affichage et e-mail). */
export function lignesRecapitulatif(d: Demande, config: Configuration | null): [string, string][] {
  const resume = resumeConfiguration(config);
  const lignes: [string, string][] = [
    ['Activité', metiers.find((m) => m.id === d.metier)?.nom ?? ''],
    ['Besoins', d.besoins.map((b) => besoins.find((x) => x.id === b)?.nom).join(', ')],
    ['Projet', d.description.trim()],
  ];
  if (d.lien.trim()) lignes.push(['Site aimé', d.lien.trim()]);
  lignes.push(['Budget', libelle(budgets, d.budget)], ['Délai', libelle(delais, d.delai)]);
  if (resume) {
    lignes.push(['Configuration', [resume.formule, ...resume.options].join(', ')]);
    lignes.push(['Estimation', resume.estimation]);
  }
  lignes.push(['Nom', d.nom.trim()]);
  if (d.entreprise.trim()) lignes.push(['Entreprise', d.entreprise.trim()]);
  lignes.push(['E-mail', d.email.trim()]);
  if (d.telephone.trim()) lignes.push(['Téléphone', d.telephone.trim()]);
  return lignes;
}

/**
 * Titre court de la demande, affiché dans l'espace client : la configuration choisie
 * (« Site Fonctionnel · Rendez-vous en ligne, Calculateur de prix »), sinon les besoins cochés.
 */
export function titreDemande(d: Demande, config: Configuration | null) {
  const resume = resumeConfiguration(config);
  if (resume) return resume.options.length ? `${resume.formule} · ${resume.options.join(', ')}` : resume.formule;
  const noms = d.besoins.filter((b) => b !== 'sais-pas').map((b) => besoins.find((x) => x.id === b)?.nom ?? '');
  return noms.length ? noms.join(', ') : 'Projet de site';
}

/** Données envoyées (au script ou à l'API) : récapitulatif, pré-devis, champs utiles, piège anti-robots et photos. */
export function construireEnvoi(d: Demande, config: Configuration | null, photos: File[], piege: string) {
  const donnees = new FormData();
  donnees.append('nom', d.nom.trim());
  donnees.append('email', d.email.trim());
  donnees.append('telephone', d.telephone.trim());
  donnees.append('entreprise', d.entreprise.trim());
  donnees.append('titre', titreDemande(d, config));
  donnees.append('recapitulatif', lignesRecapitulatif(d, config).map(([cle, valeur]) => `${cle} : ${valeur}`).join('\n'));
  donnees.append('predevis', texteDuPreDevis(preDevis(d, config)));
  donnees.append('site_web', piege);
  photos.forEach((photo) => donnees.append('photos[]', photo, photo.name));
  return donnees;
}

/** Délai minimal entre deux envois depuis le même navigateur. */
export const DELAI_ENVOI_MS = 60_000;
