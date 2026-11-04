import { calculerEstimation, type Configuration } from '../../data/calculs';
import { besoins, budgets, delais, devisTextes, limitesPhotos, type BesoinId } from '../../data/devis';
import { formatPrix, formuleParId, metiers, options, type MetierId } from '../../data/offres';

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

/** Brouillon : réponses et étape atteinte. Toute valeur inattendue est ignorée. */
export function lireBrouillon(brut: unknown): { demande: Demande; etape: number } {
  const vide = { demande: demandeVide, etape: 0 };
  if (!brut || typeof brut !== 'object') return vide;
  const o = brut as Record<string, unknown>;
  const d = (o.demande ?? {}) as Record<string, unknown>;
  const texte = (v: unknown) => (typeof v === 'string' ? v.slice(0, 5000) : '');
  const dans = (v: unknown, liste: { value: string }[]) => (liste.some((x) => x.value === v) ? (v as string) : null);
  return {
    etape: Number.isInteger(o.etape) ? Math.min(Math.max(o.etape as number, 0), 4) : 0,
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

export function enregistrerBrouillon(demande: Demande, etape: number) {
  try {
    window.localStorage.setItem(CLE_BROUILLON, JSON.stringify({ demande, etape }));
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

/** Données envoyées au script : récapitulatif, champs utiles, piège anti-robots et photos. */
export function construireEnvoi(d: Demande, config: Configuration | null, photos: File[], piege: string) {
  const donnees = new FormData();
  donnees.append('nom', d.nom.trim());
  donnees.append('email', d.email.trim());
  donnees.append('recapitulatif', lignesRecapitulatif(d, config).map(([cle, valeur]) => `${cle} : ${valeur}`).join('\n'));
  donnees.append('site_web', piege);
  photos.forEach((photo) => donnees.append('photos[]', photo, photo.name));
  return donnees;
}

/** Délai minimal entre deux envois depuis le même navigateur. */
export const DELAI_ENVOI_MS = 60_000;
