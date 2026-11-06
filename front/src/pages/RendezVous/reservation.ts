import { ajouterJours, comparer, jourDeLaSemaine, type DateIso } from '@bsandoz79/blocs';
import { urlApi } from '../../app/api';
import { disponibilites, rdvTextes, urlGeocodage, zone, type LieuId } from '../../data/rendezvous';

export type Disponibilites = typeof disponibilites;

const listeDe = <T,>(valeur: unknown, estValide: (v: unknown) => v is T): T[] | null =>
  Array.isArray(valeur) && valeur.every(estValide) ? valeur : null;
const estNombre = (v: unknown): v is number => typeof v === 'number' && Number.isInteger(v);
const estTexte = (v: unknown): v is string => typeof v === 'string';

/** Disponibilités en vigueur, lues sur l'API. */
export async function lireDisponibilites(): Promise<Disponibilites> {
  const reponse = await fetch(`${urlApi}/rendez-vous/disponibilites`, { headers: { Accept: 'application/json' } });
  if (!reponse.ok) throw new Error('Disponibilités indisponibles');
  const recu = (await reponse.json()) as Partial<Record<keyof Disponibilites, unknown>>;
  const joursTravailles = listeDe(recu.joursTravailles, estNombre);
  const creneaux = listeDe(recu.creneaux, estTexte);
  const joursFermes = listeDe(recu.joursFermes, estTexte);
  if (!joursTravailles || !creneaux || !joursFermes) throw new Error('Disponibilités illisibles');
  return {
    joursTravailles,
    creneaux,
    joursFermes,
    dureeMinutes: estNombre(recu.dureeMinutes) ? recu.dureeMinutes : disponibilites.dureeMinutes,
    delaiMinJours: estNombre(recu.delaiMinJours) ? recu.delaiMinJours : disponibilites.delaiMinJours,
    horizonJours: estNombre(recu.horizonJours) ? recu.horizonJours : disponibilites.horizonJours,
  };
}

/** Le calendrier suit l'API ; si elle ne répond pas, il garde les valeurs de `data/rendezvous.ts`. L'API a le dernier mot à la réservation. */
export async function actualiserDisponibilites(): Promise<boolean> {
  try {
    Object.assign(disponibilites, await lireDisponibilites());
    return true;
  } catch {
    return false;
  }
}

/** Premier et dernier jours réservables. */
export function bornes(aujourdhui: DateIso) {
  return {
    min: ajouterJours(aujourdhui, disponibilites.delaiMinJours),
    max: ajouterJours(aujourdhui, disponibilites.horizonJours),
  };
}

/** Le jour est-il réservable ? (dans les bornes, travaillé et pas fermé) */
export function jourDisponible(jour: DateIso, aujourdhui: DateIso) {
  const { min, max } = bornes(aujourdhui);
  return comparer(jour, min) >= 0 && comparer(jour, max) <= 0 && disponibilites.joursTravailles.includes(jourDeLaSemaine(jour)) && !disponibilites.joursFermes.includes(jour);
}

const enMinutes = (heure: string) => {
  const [h, m] = heure.split(':').map(Number);
  return h * 60 + m;
};
const enHeure = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

export type Creneau = { debut: string; fin: string; libelle: string };

/** Créneaux d'une heure d'un jour réservable (aucun sinon). */
export function creneauxDuJour(jour: DateIso | null, aujourdhui: DateIso): Creneau[] {
  if (!jour || !jourDisponible(jour, aujourdhui)) return [];
  return disponibilites.creneaux.map((debut) => {
    const fin = enHeure(enMinutes(debut) + disponibilites.dureeMinutes);
    return { debut, fin, libelle: `${debut} – ${fin}` };
  });
}

/** Distance à vol d'oiseau en kilomètres (formule de haversine). */
export function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const rad = (degres: number) => (degres * Math.PI) / 180;
  const a =
    Math.sin(rad(lat2 - lat1) / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lon2 - lon1) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(a));
}

export type ResultatAdresse =
  | { statut: 'ok' | 'trop-loin'; ville: string; km: number; adresse: string }
  | { statut: 'introuvable' | 'erreur' };

type ReponseGeocodage = {
  features?: { geometry: { coordinates: [number, number] }; properties: { city?: string; label?: string; score?: number } }[];
};

/** Vérifie l'adresse avec le service public de géocodage et calcule la distance à Amiens. */
export async function verifierAdresse(adresse: string, chercher: typeof fetch = fetch): Promise<ResultatAdresse> {
  try {
    const url = `${urlGeocodage}?${new URLSearchParams({ q: adresse, limit: '1', index: 'address' })}`;
    const reponse = await chercher(url);
    if (!reponse.ok) return { statut: 'erreur' };
    const donnees = (await reponse.json()) as ReponseGeocodage;
    const lieu = donnees.features?.[0];
    if (!lieu || (lieu.properties.score ?? 1) < 0.4) return { statut: 'introuvable' };
    const [longitude, latitude] = lieu.geometry.coordinates;
    const km = Math.round(distanceKm(zone.latitude, zone.longitude, latitude, longitude));
    return {
      statut: km <= zone.rayonKm ? 'ok' : 'trop-loin',
      ville: lieu.properties.city ?? '',
      km,
      adresse: lieu.properties.label ?? adresse,
    };
  } catch {
    return { statut: 'erreur' };
  }
}

/** Ce que la personne saisit pour réserver. */
export type DemandeRdv = {
  lieu: LieuId;
  adresse: string;
  jour: DateIso | null;
  creneau: string | null;
  nom: string;
  telephone: string;
  email: string;
  activite: string;
  message: string;
  consentement: boolean;
};

export const demandeRdvVide: DemandeRdv = {
  lieu: 'chezvous',
  adresse: '',
  jour: null,
  creneau: null,
  nom: '',
  telephone: '',
  email: '',
  activite: '',
  message: '',
  consentement: false,
};

export type ErreursRdv = Partial<Record<keyof DemandeRdv, string>>;

const E = rdvTextes.erreurs;

/** Erreurs du formulaire. `verification` : résultat du contrôle de l'adresse, s'il a eu lieu. */
/**
 * Étapes affichées : chaque étape apparaît quand la précédente est validée.
 * - Lieu validé : visio ou téléphone ; ou « chez vous » avec une adresse trouvée dans les 50 km
 *   (ou un géocodage indisponible : l'adresse sera alors vérifiée à la main).
 * - Créneau validé : un jour et un créneau choisis.
 */
export function etapesRdv(d: DemandeRdv, verification: ResultatAdresse | null) {
  const lieu = d.lieu !== 'chezvous' || verification?.statut === 'ok' || verification?.statut === 'erreur';
  const creneau = lieu && d.jour !== null && d.creneau !== null;
  return { creneau: lieu, coordonnees: creneau };
}

export function validerRdv(d: DemandeRdv, verification: ResultatAdresse | null): ErreursRdv {
  const erreurs: ErreursRdv = {};
  if (d.lieu === 'chezvous') {
    if (!d.adresse.trim()) erreurs.adresse = E.adresse;
    else if (verification?.statut === 'trop-loin') erreurs.adresse = E.adresseHorsZone;
  }
  if (!d.jour) erreurs.jour = E.jour;
  else if (!d.creneau) erreurs.creneau = E.creneau;
  if (!d.nom.trim()) erreurs.nom = E.nom;
  if (!/^\+?[\d\s.-]{10,20}$/.test(d.telephone.trim())) erreurs.telephone = E.telephone;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim())) erreurs.email = E.email;
  if (!d.consentement) erreurs.consentement = E.consentement;
  return erreurs;
}

/** Adresse de l'API (V2), commune à tout le site : voir `app/api.ts`. */
export { urlApi } from '../../app/api';

/** Corps envoyé à l'API pour réserver. */
export function corpsReservation(d: DemandeRdv) {
  return {
    lieu: d.lieu,
    adresse: d.lieu === 'chezvous' ? d.adresse.trim() : null,
    jour: d.jour,
    creneau: d.creneau,
    nom: d.nom.trim(),
    telephone: d.telephone.trim(),
    email: d.email.trim(),
    activite: d.activite.trim(),
    message: d.message.trim(),
  };
}
