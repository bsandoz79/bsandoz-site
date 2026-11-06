/** Zones d'intervention affichées sur la carte de l'accueil : un cercle de 50 km autour de chaque ville. */
export type Ville = { id: string; nom: string; lat: number; lng: number };

export const RAYON_KM = 50;

export const villes: Ville[] = [
  { id: 'amiens', nom: 'Amiens', lat: 49.8941, lng: 2.2958 },
  { id: 'abbeville', nom: 'Abbeville', lat: 50.1054, lng: 1.8336 },
  { id: 'arras', nom: 'Arras', lat: 50.291, lng: 2.7775 },
  { id: 'beauvais', nom: 'Beauvais', lat: 49.4295, lng: 2.0807 },
];

export const carteTextes = {
  eyebrow: 'Où j’interviens',
  titre: 'Je me déplace chez vous.',
  intro: (liste: string) => `Dans un rayon de ${RAYON_KM} km autour de ${liste}. Ailleurs en France : en visio ou par téléphone.`,
  choix: 'Afficher la zone de',
  toutes: 'Toutes',
  /** Si le visiteur a refusé les services tiers dans le bandeau. */
  refusee: {
    texte: 'Vous avez refusé les services tiers : la carte, qui vient d’OpenStreetMap, n’est pas chargée.',
    bouton: 'Afficher la carte quand même',
  },
  legendeCarte: (zone: string) => `Carte des zones d’intervention : ${zone}`,
  attribution: '© contributeurs OpenStreetMap',
};

/** « Amiens, Abbeville, Arras et Beauvais ». */
export function listeVilles(noms: string[]) {
  return noms.length < 2 ? (noms[0] ?? '') : `${noms.slice(0, -1).join(', ')} et ${noms.at(-1)}`;
}
