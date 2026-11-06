import { urlApi } from '../app/api';
import { formules, options, type OptionId } from './offres';

/**
 * Prix modifiés depuis le back-office. Les prix du code (`offres.ts`) restent la référence : le site marche sans
 * l'API, et sans modification rien ne change. À appeler AVANT de charger les pages : plusieurs textes (FAQ, CGV…)
 * calculent leur contenu à partir des prix une seule fois, au chargement du code.
 */
export type PrixModifies = Record<string, number>;

const CLE_CACHE = 'bsandoz.prix';
/** Au-delà, on redemande à l'API. */
const FRAICHEUR_MS = 5 * 60 * 1000;
/** La page n'attend jamais l'API plus longtemps. */
const ATTENTE_MAX_MS = 800;

/** Prix écrits dans le code, avant toute modification. */
export const prixDeBase: Readonly<PrixModifies> = Object.freeze({
  ...Object.fromEntries(formules.map((f) => [`formule.${f.id}`, f.prix])),
  ...Object.fromEntries(Object.values(options).map((o) => [`option.${o.id}`, o.prix])),
});

const estUnPrix = (valeur: unknown): valeur is number => typeof valeur === 'number' && Number.isInteger(valeur) && valeur >= 0;

/** Applique les prix reçus. Une clé inconnue ou une valeur douteuse est ignorée, jamais affichée. */
export function appliquerPrix(prix: unknown) {
  if (typeof prix !== 'object' || prix === null) return;
  for (const [cle, montant] of Object.entries(prix)) {
    if (!estUnPrix(montant) || !(cle in prixDeBase)) continue;
    const [genre, id] = cle.split('.');
    if (genre === 'formule') {
      const formule = formules.find((f) => f.id === id);
      if (formule) formule.prix = montant;
    } else options[id as OptionId].prix = montant;
  }
}

/** Remet les prix du code (pour les tests). */
export function reinitialiserPrix() {
  for (const f of formules) f.prix = prixDeBase[`formule.${f.id}`];
  for (const o of Object.values(options)) o.prix = prixDeBase[`option.${o.id}`];
}

type Cache = { le: number; prix: PrixModifies };

function lireCache(): Cache | null {
  try {
    const cache = JSON.parse(localStorage.getItem(CLE_CACHE) ?? 'null') as Cache | null;
    return cache && typeof cache.le === 'number' ? cache : null;
  } catch {
    return null;
  }
}

function ecrireCache(prix: PrixModifies, maintenant: number) {
  try {
    localStorage.setItem(CLE_CACHE, JSON.stringify({ le: maintenant, prix }));
  } catch {
    // Stockage indisponible : on redemandera à la prochaine visite.
  }
}

export async function lirePrixEnLigne(): Promise<PrixModifies> {
  const reponse = await fetch(`${urlApi}/prix`, { headers: { Accept: 'application/json' } });
  if (!reponse.ok) throw new Error('Prix indisponibles');
  const corps = (await reponse.json()) as { prix?: PrixModifies };
  return corps.prix ?? {};
}

/** Prépare les prix : le cache s'il est frais, sinon l'API, sans jamais bloquer la page ni échouer. */
export async function preparerPrix(maintenant = Date.now(), attenteMax = ATTENTE_MAX_MS): Promise<void> {
  const cache = lireCache();
  if (cache) appliquerPrix(cache.prix);
  if (cache && maintenant - cache.le < FRAICHEUR_MS) return;

  const demande = lirePrixEnLigne()
    .then((prix) => {
      ecrireCache(prix, maintenant);
      return prix;
    })
    .catch((): PrixModifies | null => {
      // API injoignable : on ne réessaie pas à chaque page, et on garde ce qu'on a.
      ecrireCache(cache?.prix ?? {}, maintenant);
      return null;
    });
  const trop = new Promise<null>((resoudre) => setTimeout(() => resoudre(null), attenteMax));
  const prix = await Promise.race([demande, trop]);
  if (prix) {
    reinitialiserPrix();
    appliquerPrix(prix);
  }
}
