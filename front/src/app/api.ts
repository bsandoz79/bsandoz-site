/** Adresse de l'API. Réglable par `VITE_API_URL` au build (ex. `http://localhost:8000` en développement). */
export const urlApi = (import.meta.env.VITE_API_URL as string | undefined) || 'https://api.bsandoz.fr';

/** Réponse de l'API : code HTTP et corps JSON (vide si la réponse n'en a pas). */
export type ReponseApi<T = Record<string, unknown>> = { statut: number; corps: T };

/**
 * Appelle l'API en JSON, avec le cookie de session (`credentials: 'include'`).
 * Ne lève une erreur qu'en cas de panne réseau ; les codes d'erreur HTTP sont renvoyés tels quels.
 */
export async function appelerApi<T = Record<string, unknown>>(
  chemin: string,
  options: { methode?: 'GET' | 'POST'; corps?: unknown } = {},
): Promise<ReponseApi<T>> {
  const methode = options.methode ?? (options.corps === undefined ? 'GET' : 'POST');
  const reponse = await fetch(`${urlApi}${chemin}`, {
    method: methode,
    credentials: 'include',
    headers: methode === 'POST' ? { 'Content-Type': 'application/json', Accept: 'application/json' } : { Accept: 'application/json' },
    body: methode === 'POST' ? JSON.stringify(options.corps ?? {}) : undefined,
  });
  const texte = await reponse.text();
  let corps = {} as T;
  if (texte) {
    try {
      corps = JSON.parse(texte) as T;
    } catch {
      // Corps non JSON : on garde un objet vide.
    }
  }
  return { statut: reponse.status, corps };
}
