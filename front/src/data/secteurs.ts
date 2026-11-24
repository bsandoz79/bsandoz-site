/**
 * Filtre par métier de la page Réalisations : les vraies réalisations et les exemples d'outils (maquettes marquées
 * « Exemple ») d'un même secteur, pour que chacun voie ce qui ressemble à son activité.
 */
import { exemplesOutils } from './exemples';
import { realisations, realisationsFiltrees, type CarteRealisation, type FiltreRealisation, type TypeRealisation } from './realisations';

export const secteurs = [
  { value: 'tous', label: 'Tous les métiers' },
  { value: 'artisans', label: 'Artisans et services' },
  { value: 'commerce', label: 'Commerce et restauration' },
  { value: 'entreprises', label: 'Entreprises' },
  { value: 'photographes', label: 'Photographes' },
  { value: 'perso', label: 'Projets personnels' },
] as const;

export type Secteur = (typeof secteurs)[number]['value'];

/** Secteur de chaque carte (réalisation ou exemple). Un test vérifie que toutes en ont un. */
export const secteurDe: Record<string, Exclude<Secteur, 'tous'>> = {
  crocs: 'commerce',
  'christophe-poix-moto': 'artisans',
  'demo-detailing': 'artisans',
  cadeaux: 'perso',
  choptonchargeur: 'perso',
  ordv: 'perso',
  alterno: 'perso',
  'exemple-stocks': 'commerce',
  'exemple-qr': 'commerce',
  'exemple-crm': 'entreprises',
  'exemple-galerie': 'photographes',
};

/** Type des exemples d'outils, pour le filtre « Sites web / Applis & plateformes ». */
const typeExemple: Record<string, TypeRealisation> = {
  'exemple-stocks': 'appli',
  'exemple-qr': 'site',
  'exemple-crm': 'appli',
  'exemple-galerie': 'site',
};

export function lireSecteur(valeur: string | null): Secteur {
  return secteurs.find((s) => s.value === valeur)?.value ?? 'tous';
}

/**
 * Cartes à afficher. Sans métier choisi : les réalisations seules, comme avant.
 * Avec un métier : ses réalisations et ses exemples, filtrés aussi par type.
 */
export function cartesRealisations(type: FiltreRealisation, secteur: Secteur): CarteRealisation[] {
  if (secteur === 'tous') return realisationsFiltrees(type);
  const typeDe = (c: CarteRealisation) => realisations.find((r) => r.id === c.id)?.type ?? typeExemple[c.id];
  return [...realisations, ...exemplesOutils].filter((c) => secteurDe[c.id] === secteur && (type === 'tout' || typeDe(c) === type));
}
