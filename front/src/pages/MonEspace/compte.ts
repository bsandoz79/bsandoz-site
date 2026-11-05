import { appelerApi, urlApi } from '../../app/api';
import { espaceTextes, MOT_DE_PASSE_MIN } from '../../data/espace';

/** Compte renvoyé par l'API (module Auth). */
export type Compte = {
  id: string;
  email: string;
  nom: string;
  entreprise: string;
  telephone: string;
  adresse: string;
  notifications: boolean;
  statut: 'en_attente' | 'actif';
  motDePasse: boolean;
  motDePasseModifieLe: string | null;
};

/** Coordonnées et préférences modifiables dans « Mon compte ». */
export type Profil = Pick<Compte, 'nom' | 'entreprise' | 'telephone' | 'adresse' | 'notifications'>;

export type ErreursChamps = Partial<Record<string, string>>;

export async function modifierProfil(profil: Profil): Promise<{ ok: true; compte: Compte } | { ok: false; erreurs: ErreursChamps }> {
  const { statut, corps } = await appelerApi<{ compte?: Compte; erreurs?: ErreursChamps }>('/auth/compte', { corps: profil });
  if (statut === 200 && corps.compte) return { ok: true, compte: corps.compte };
  return { ok: false, erreurs: corps.erreurs ?? { general: espaceTextes.erreurReseau } };
}

/** Envoie le lien de confirmation à la nouvelle adresse ; renvoie le message d'erreur s'il y en a un. */
export async function demanderChangementEmail(email: string): Promise<{ ok: true } | { ok: false; erreur: string }> {
  const { statut, corps } = await appelerApi<{ erreurs?: ErreursChamps }>('/auth/email', { corps: { email: email.trim() } });
  if (statut === 202) return { ok: true };
  if (statut === 429) return { ok: false, erreur: espaceTextes.tropDEssais };
  return { ok: false, erreur: corps.erreurs?.email ?? espaceTextes.erreurReseau };
}

export async function confirmerChangementEmail(jeton: string): Promise<{ etat: 'ok'; email: string } | { etat: 'invalide' | 'refuse' | 'erreur' }> {
  const { statut, corps } = await appelerApi<{ compte?: Compte }>('/auth/email/confirmer', { corps: { jeton } });
  if (statut === 200 && corps.compte) return { etat: 'ok', email: corps.compte.email };
  if (statut === 410) return { etat: 'invalide' };
  return { etat: statut === 400 ? 'refuse' : 'erreur' };
}

export async function demanderSuppression(): Promise<boolean> {
  const { statut } = await appelerApi('/auth/suppression', { corps: {} });
  return statut === 202;
}

export async function confirmerSuppression(jeton: string): Promise<'ok' | 'invalide' | 'erreur'> {
  const { statut } = await appelerApi('/auth/suppression/confirmer', { corps: { jeton } });
  if (statut === 204) return 'ok';
  return statut === 410 ? 'invalide' : 'erreur';
}

/** Demande de devis telle que l'espace client la reçoit (liaison Auth + Prospect de l'API). */
export type MaDemande = {
  id: string;
  numero: string;
  titre: string;
  envoyeeLe: string;
  statut: string;
  etapes: { statut: string; libelle: string; atteinte: boolean }[];
  devis: {
    numero: string;
    lignes: { libelle: string; prix: number }[];
    total: number;
    statut: 'envoye' | 'accepte';
    envoyeLe: string;
    accepteLe: string | null;
  } | null;
};

export async function mesDemandes(): Promise<MaDemande[]> {
  const { statut, corps } = await appelerApi<{ demandes?: MaDemande[] }>('/espace/demandes');
  return statut === 200 ? (corps.demandes ?? []) : [];
}

/** Accepte le devis ; renvoie la demande à jour, ou null si l'API refuse. */
export async function accepterDevis(id: string): Promise<MaDemande | null> {
  const { statut, corps } = await appelerApi<{ demande?: MaDemande }>(`/espace/demandes/${encodeURIComponent(id)}/devis/accepter`, { corps: {} });
  return statut === 200 && corps.demande ? corps.demande : null;
}

export const urlDevisPdf = (id: string) => `${urlApi}/espace/demandes/${encodeURIComponent(id)}/devis.pdf`;

/** Fichier JSON de toutes ses données : un simple lien suffit, le cookie l'accompagne. */
export const urlMesDonnees = () => `${urlApi}/espace/donnees`;

export type AppareilConnecte = {
  id: string;
  appareil: string;
  connecteLe: string;
  derniereActivite: string;
  courant: boolean;
};

/** Compte connecté, ou null si personne ne l'est. */
export async function compteConnecte(): Promise<Compte | null> {
  const { statut, corps } = await appelerApi<{ compte?: Compte }>('/auth/moi');
  return statut === 200 && corps.compte ? corps.compte : null;
}

export type ResultatConnexion = { ok: true; compte: Compte } | { ok: false; raison: 'identifiants' | 'trop-d-essais' | 'erreur' };

export async function seConnecter(email: string, motDePasse: string): Promise<ResultatConnexion> {
  const { statut, corps } = await appelerApi<{ compte?: Compte }>('/auth/connexion', { corps: { email: email.trim(), motDePasse } });
  if (statut === 200 && corps.compte) return { ok: true, compte: corps.compte };
  if (statut === 401) return { ok: false, raison: 'identifiants' };
  return { ok: false, raison: statut === 429 ? 'trop-d-essais' : 'erreur' };
}

/** Demande un lien par mail. La réponse est la même que l'adresse ait un compte ou non. */
export async function demanderLien(email: string, usage: 'connexion' | 'mot_de_passe'): Promise<'envoye' | 'trop-d-essais' | 'erreur'> {
  const { statut } = await appelerApi('/auth/lien', { corps: { email: email.trim(), usage } });
  if (statut === 202) return 'envoye';
  return statut === 429 ? 'trop-d-essais' : 'erreur';
}

export async function utiliserLien(jeton: string): Promise<'ok' | 'invalide' | 'erreur'> {
  const { statut } = await appelerApi('/auth/lien/utiliser', { corps: { jeton } });
  if (statut === 200) return 'ok';
  return statut === 410 ? 'invalide' : 'erreur';
}

export async function definirMotDePasse(jeton: string, motDePasse: string): Promise<'ok' | 'invalide' | 'refuse' | 'erreur'> {
  const { statut } = await appelerApi('/auth/mot-de-passe', { corps: { jeton, motDePasse } });
  if (statut === 204) return 'ok';
  if (statut === 410) return 'invalide';
  return statut === 400 ? 'refuse' : 'erreur';
}

export async function seDeconnecter() {
  await appelerApi('/auth/deconnexion', { corps: {} });
}

export async function appareilsConnectes(): Promise<AppareilConnecte[]> {
  const { statut, corps } = await appelerApi<{ appareils?: AppareilConnecte[] }>('/auth/appareils');
  return statut === 200 ? (corps.appareils ?? []) : [];
}

export async function deconnecterLesAutres(): Promise<number> {
  const { corps } = await appelerApi<{ deconnectes?: number }>('/auth/appareils/deconnecter-les-autres', { corps: {} });
  return corps.deconnectes ?? 0;
}

/** Rendez-vous de la personne connectée (liaison Auth + Booking de l'API). */
export type MonRendezVous = {
  id: string;
  jour: string;
  debut: string;
  fin: string;
  lieu: 'chezvous' | 'visio' | 'telephone';
  lieuLibelle: string;
  adresse: string | null;
  statut: 'confirme' | 'annule';
  aVenir: boolean;
};

export async function mesRendezVous(): Promise<MonRendezVous[]> {
  const { statut, corps } = await appelerApi<{ rendezVous?: MonRendezVous[] }>('/espace/rendez-vous');
  return statut === 200 ? (corps.rendezVous ?? []) : [];
}

export async function annulerRendezVous(id: string): Promise<boolean> {
  const { statut } = await appelerApi(`/espace/rendez-vous/${encodeURIComponent(id)}/annuler`, { corps: {} });
  return statut === 200;
}

/** Adresse du fichier .ics : un simple lien suffit, le cookie de session l'accompagne. */
export function urlAgenda(id: string) {
  return `${urlApi}/espace/rendez-vous/${encodeURIComponent(id)}/agenda.ics`;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function emailValide(email: string) {
  return EMAIL.test(email.trim());
}

/** Erreur du nouveau mot de passe (même règle que l'API), ou undefined s'il convient. */
export function erreurMotDePasse(motDePasse: string, confirmation: string) {
  if ([...motDePasse].length < MOT_DE_PASSE_MIN || motDePasse.trim() === '') return espaceTextes.motDePasse.tropCourt;
  if (motDePasse !== confirmation) return espaceTextes.motDePasse.different;
  return undefined;
}
