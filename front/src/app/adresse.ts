import { urlGeocodage } from '../data/rendezvous';
import { fraisKilometriques, situer } from '../data/zones';

/**
 * Vérification d'une adresse (ou d'une ville) avec le service public de géocodage de l'IGN :
 * base la plus proche (Amiens ou Abbeville), distance et frais kilométriques.
 * Sert à la page Rendez-vous et à la demande de devis.
 */
export type ResultatAdresse =
  /** `base` : Amiens ou Abbeville, la plus proche ; `frais` : frais kilométriques (0 dans la zone). */
  | { statut: 'ok' | 'hors-zone'; ville: string; km: number; base: string; frais: number; adresse: string }
  | { statut: 'introuvable' | 'erreur' };

type ReponseGeocodage = {
  features?: { geometry: { coordinates: [number, number] }; properties: { city?: string; label?: string; score?: number } }[];
};

/** Vérifie l'adresse et calcule la distance à la base la plus proche, et les frais au-delà de la zone. */
export async function verifierAdresse(adresse: string, chercher: typeof fetch = fetch): Promise<ResultatAdresse> {
  try {
    const url = `${urlGeocodage}?${new URLSearchParams({ q: adresse, limit: '1', index: 'address' })}`;
    const reponse = await chercher(url);
    if (!reponse.ok) return { statut: 'erreur' };
    const donnees = (await reponse.json()) as ReponseGeocodage;
    const lieu = donnees.features?.[0];
    if (!lieu || (lieu.properties.score ?? 1) < 0.4) return { statut: 'introuvable' };
    const [longitude, latitude] = lieu.geometry.coordinates;
    const { ville: base, km } = situer(latitude, longitude);
    const frais = fraisKilometriques(km);
    return {
      statut: frais > 0 ? 'hors-zone' : 'ok',
      ville: lieu.properties.city ?? '',
      km,
      base: base.nom,
      frais,
      adresse: lieu.properties.label ?? adresse,
    };
  } catch {
    return { statut: 'erreur' };
  }
}

