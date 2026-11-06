import { useSyncExternalStore } from 'react';

/**
 * Consentement aux services tiers (aujourd'hui : la carte OpenStreetMap).
 *
 * - « Accepter » ou « Refuser » : choix définitif, gardé 6 mois dans le navigateur, puis redemandé.
 * - Fermer le bandeau sans choisir : il disparaît pour cette visite et revient au prochain chargement de la page.
 * - Le lien « Services tiers » du pied de page rouvre le bandeau pour changer d'avis.
 */
export type Choix = 'accepte' | 'refuse';
export type EtatConsentement = { choix: Choix | null; bandeauVisible: boolean };

export const CLE_CONSENTEMENT = 'bsandoz.consentement';
/** Durée de validité d'un choix : 6 mois (recommandation de la CNIL). */
export const DUREE_CHOIX_MS = 182 * 24 * 60 * 60 * 1000;
/** Ancienne clé de la carte (accord donné au clic), retirée à la lecture. */
const ANCIENNE_CLE_CARTE = 'bsandoz.carte';

function lireStockage(): Choix | null {
  try {
    window.localStorage.removeItem(ANCIENNE_CLE_CARTE);
    const brut = window.localStorage.getItem(CLE_CONSENTEMENT);
    if (!brut) return null;
    const { choix, date } = JSON.parse(brut) as { choix?: unknown; date?: unknown };
    if ((choix !== 'accepte' && choix !== 'refuse') || typeof date !== 'number') return null;
    return Date.now() - date < DUREE_CHOIX_MS ? choix : null;
  } catch {
    return null;
  }
}

let etat: EtatConsentement | null = null;
const abonnes = new Set<() => void>();

function lireEtat(): EtatConsentement {
  if (!etat) {
    const choix = lireStockage();
    etat = { choix, bandeauVisible: choix === null };
  }
  return etat;
}

function changer(suite: EtatConsentement) {
  etat = suite;
  abonnes.forEach((abonne) => abonne());
}

function abonner(abonne: () => void) {
  abonnes.add(abonne);
  return () => abonnes.delete(abonne);
}

export function choisir(choix: Choix) {
  try {
    window.localStorage.setItem(CLE_CONSENTEMENT, JSON.stringify({ choix, date: Date.now() }));
  } catch {
    // Stockage indisponible : le choix vaut pour cette visite.
  }
  changer({ choix, bandeauVisible: false });
}

/** Ferme le bandeau sans rien enregistrer : il reviendra au prochain chargement. */
export function fermerPourLInstant() {
  changer({ ...lireEtat(), bandeauVisible: false });
}

/** Rouvre le bandeau (lien du pied de page) pour changer d'avis. */
export function rouvrirBandeau() {
  changer({ ...lireEtat(), bandeauVisible: true });
}

/** Repart de zéro (tests, ou simulation d'un rechargement). */
export function reinitialiserConsentement() {
  etat = null;
  abonnes.forEach((abonne) => abonne());
}

export function useConsentement() {
  return useSyncExternalStore(abonner, lireEtat, lireEtat);
}
