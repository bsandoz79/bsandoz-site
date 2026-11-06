import { appelerApi } from '../../app/api';
import { adminTextes } from '../../data/admin';
import type { MessageDuFil } from '../MonEspace/compte';

/** Une ligne de la liste des demandes. */
export type LigneDemande = {
  id: string;
  numero: string;
  titre: string;
  nom: string;
  entreprise: string;
  envoyeeLe: string;
  statut: string;
  statutLibelle: string;
  /** Montant et état du devis, s'il y en a un. */
  devis?: { total: number; statut: string; accepteLe: string | null } | null;
};

export type LigneDevis = { libelle: string; prix: number };

/** Le détail d'une demande. */
export type DemandeAdmin = {
  id: string;
  numero: string;
  titre: string;
  envoyeeLe: string;
  statut: string;
  statuts: { statut: string; libelle: string }[];
  demandeur: { nom: string; email: string; telephone: string; entreprise: string };
  recapitulatif: string;
  predevis: string;
  messages: MessageDuFil[];
  devis: { numero: string; lignes: LigneDevis[]; total: number; statut: 'envoye' | 'accepte'; envoyeLe: string; accepteLe: string | null } | null;
};

/** Accès au back-office : refus distingués, pour afficher la bonne page. */
export type Acces = 'ok' | 'connexion' | 'interdit' | 'erreur';

export const accesDepuis = (statut: number): Acces => (statut === 401 ? 'connexion' : statut === 403 ? 'interdit' : statut === 200 ? 'ok' : 'erreur');

export async function listerDemandes(): Promise<{ acces: Acces; demandes: LigneDemande[] }> {
  const { statut, corps } = await appelerApi<{ demandes?: LigneDemande[] }>('/backoffice/demandes');
  return { acces: accesDepuis(statut), demandes: corps.demandes ?? [] };
}

export async function voirDemande(id: string): Promise<DemandeAdmin | null> {
  const { statut, corps } = await appelerApi<{ demande?: DemandeAdmin }>(`/backoffice/demandes/${encodeURIComponent(id)}`);
  return statut === 200 ? (corps.demande ?? null) : null;
}

export async function enregistrerPrix(prix: Record<string, number>): Promise<boolean> {
  const { statut } = await appelerApi('/backoffice/prix', { corps: { prix } });
  return statut === 200;
}

export type RendezVousAdmin = {
  id: string;
  jour: string;
  heure: string;
  fin: string;
  lieu: string;
  lieuLibelle: string;
  adresse: string | null;
  nom: string;
  email: string;
  telephone: string;
  activite: string;
  message: string;
  statut: 'confirme' | 'annule';
  kmFactures: number | null;
  frais: string | null;
};

export async function listerRendezVous(du: string, au: string): Promise<RendezVousAdmin[] | null> {
  const { statut, corps } = await appelerApi<{ rendezVous?: RendezVousAdmin[] }>(`/backoffice/rendez-vous?du=${du}&au=${au}`);
  return statut === 200 ? (corps.rendezVous ?? []) : null;
}

/** Annule un rendez-vous : le client reçoit `message` (vos disponibilités) et `lien` pour reprendre un créneau. */
export async function annulerRendezVousAdmin(id: string, message: string, lien: string): Promise<RendezVousAdmin | null> {
  const { statut, corps } = await appelerApi<{ rendezVous?: RendezVousAdmin }>(`/backoffice/rendez-vous/${encodeURIComponent(id)}/annuler`, { corps: { message, lien } });
  return statut === 200 ? (corps.rendezVous ?? null) : null;
}

export async function enregistrerContenus(contenus: Record<string, string | null>): Promise<boolean> {
  const { statut } = await appelerApi('/backoffice/contenus', { corps: { contenus } });
  return statut === 200;
}

/** Envoie une image (base64) ; renvoie son adresse. */
export async function envoyerImage(image: string): Promise<string | null> {
  const { statut, corps } = await appelerApi<{ url?: string }>('/backoffice/images', { corps: { image } });
  return statut === 200 ? (corps.url ?? null) : null;
}

export type ReglesDisponibilites = { joursTravailles: number[]; creneaux: string[]; joursFermes: string[] };

export async function enregistrerDisponibilites(regles: ReglesDisponibilites): Promise<{ ok: true; regles: ReglesDisponibilites } | { ok: false; erreur: string }> {
  const { statut, corps } = await appelerApi<ReglesDisponibilites & { erreurs?: Record<string, string> }>('/backoffice/disponibilites', { corps: regles });
  if (statut === 200) return { ok: true, regles: corps };
  return { ok: false, erreur: Object.values(corps.erreurs ?? {})[0] ?? adminTextes.disponibilites.echec };
}

export type Resultat = { ok: true; demande: DemandeAdmin } | { ok: false; erreur: string };

async function agir(id: string, action: 'statut' | 'devis' | 'messages', corps: unknown, repli: string): Promise<Resultat> {
  const { statut, corps: reponse } = await appelerApi<{ demande?: DemandeAdmin; erreur?: string; erreurs?: Record<string, string> }>(
    `/backoffice/demandes/${encodeURIComponent(id)}/${action}`,
    { corps },
  );
  if (statut === 200 && reponse.demande) return { ok: true, demande: reponse.demande };
  return { ok: false, erreur: reponse.erreur ?? Object.values(reponse.erreurs ?? {})[0] ?? repli };
}

export const changerStatut = (id: string, statut: string, repli: string) => agir(id, 'statut', { statut }, repli);
export const envoyerDevis = (id: string, lignes: LigneDevis[], repli: string) => agir(id, 'devis', { lignes }, repli);
export const ajouterMessage = (id: string, corps: string, note: boolean, repli: string) => agir(id, 'messages', { corps, note }, repli);
