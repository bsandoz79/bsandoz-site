import { useSyncExternalStore } from 'react';
import { appelerApi } from './api';

/**
 * Édition directe sur les pages : les crayons n'apparaissent que pour un compte du back-office.
 * Un visiteur sans session ne déclenche aucun appel : on ne vérifie que si une connexion a été notée dans ce navigateur.
 * C'est l'API qui décide : `/backoffice/…` répond 200 seulement aux adresses autorisées, et elle refuse tout enregistrement sinon.
 */
export const CLE_SESSION = 'bsandoz.session';

let actif = false;
let verifie = false;
const abonnes = new Set<() => void>();

function changer(valeur: boolean) {
  if (valeur === actif) return;
  actif = valeur;
  abonnes.forEach((abonne) => abonne());
}

function sessionNotee() {
  try {
    return window.localStorage.getItem(CLE_SESSION) === '1';
  } catch {
    return false;
  }
}

async function verifier() {
  verifie = true;
  if (!sessionNotee()) {
    changer(false);
    return;
  }
  try {
    const { statut } = await appelerApi('/backoffice/demandes');
    if (statut === 401) noterSession(false);
    else changer(statut === 200);
  } catch {
    changer(false);
  }
}

/** À appeler quand on sait si quelqu'un est connecté (connexion, déconnexion, lecture du compte). */
export function noterSession(connecte: boolean) {
  try {
    if (connecte) window.localStorage.setItem(CLE_SESSION, '1');
    else window.localStorage.removeItem(CLE_SESSION);
  } catch {
    // Stockage indisponible : pas de crayons.
  }
  if (connecte) {
    if (!actif) void verifier();
  } else changer(false);
}

function abonner(abonne: () => void) {
  abonnes.add(abonne);
  if (!verifie) void verifier();
  return () => abonnes.delete(abonne);
}

/** Vrai si le compte connecté peut modifier le site directement sur les pages. */
export function useEdition() {
  return useSyncExternalStore(abonner, () => actif, () => false);
}

/** Pour les tests : repart de zéro. */
export function reinitialiserEdition() {
  actif = false;
  verifie = false;
}
