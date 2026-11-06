import { useSyncExternalStore } from 'react';
import { urlApi } from '../app/api';

/**
 * Textes et images modifiés depuis le site. Ceux du code restent la référence : le site marche sans l'API,
 * et sans modification rien ne change. Même principe que les prix (`prixEnLigne.ts`).
 */
export type Contenus = Record<string, string>;

const CLE_CACHE = 'bsandoz.contenus';
const FRAICHEUR_MS = 5 * 60 * 1000;
const ATTENTE_MAX_MS = 800;

type Cache = { le: number; contenus: Contenus };

function lireCache(): Cache | null {
  try {
    const cache = JSON.parse(localStorage.getItem(CLE_CACHE) ?? 'null') as Cache | null;
    return cache && typeof cache.le === 'number' && typeof cache.contenus === 'object' ? cache : null;
  } catch {
    return null;
  }
}

export function ecrireCacheContenus(contenus: Contenus, maintenant = Date.now()) {
  try {
    localStorage.setItem(CLE_CACHE, JSON.stringify({ le: maintenant, contenus }));
  } catch {
    // Stockage indisponible : on redemandera à la prochaine visite.
  }
}

/** Contenus à appliquer : le cache s'il est frais, sinon l'API, sans jamais bloquer la page ni échouer. */
export async function chargerContenus(maintenant = Date.now(), attenteMax = ATTENTE_MAX_MS): Promise<Contenus> {
  const cache = lireCache();
  if (cache && maintenant - cache.le < FRAICHEUR_MS) return cache.contenus;

  const demande = fetch(`${urlApi}/contenus`, { headers: { Accept: 'application/json' } })
    .then(async (reponse) => {
      if (!reponse.ok) throw new Error('Contenus indisponibles');
      const contenus = ((await reponse.json()) as { contenus?: Contenus }).contenus ?? {};
      ecrireCacheContenus(contenus, maintenant);
      return contenus;
    })
    .catch(() => {
      ecrireCacheContenus(cache?.contenus ?? {}, maintenant);
      return cache?.contenus ?? {};
    });
  const trop = new Promise<Contenus>((resoudre) => setTimeout(() => resoudre(cache?.contenus ?? {}), attenteMax));
  return Promise.race([demande, trop]);
}

let version = 0;
const abonnes = new Set<() => void>();

/** Prévient les blocs affichés qu'un contenu a changé. */
export function signalerContenus() {
  version += 1;
  abonnes.forEach((abonne) => abonne());
}

export function useVersionContenus() {
  return useSyncExternalStore(
    (abonne) => {
      abonnes.add(abonne);
      return () => abonnes.delete(abonne);
    },
    () => version,
    () => version,
  );
}
