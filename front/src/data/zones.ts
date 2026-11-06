import { distanceKm } from './distance';

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
  /** Position du visiteur, demandée quand la carte arrive à l'écran. Elle reste dans le navigateur. */
  position: {
    point: 'Vous êtes ici',
    enCours: 'Recherche de votre position…',
    dansZone: (distance: string) => `Bonne nouvelle : vous êtes dans ma zone, ${distance}. Je peux venir chez vous.`,
    horsZone: (distance: string) =>
      `Vous êtes ${distance}, un peu au-delà de ma zone. Pas d’inquiétude : je me déplace quand même, avec simplement des frais kilométriques (essence) selon la distance. La visio et le téléphone restent possibles partout.`,
    bouton: 'Me situer sur la carte',
    bloquee: 'Votre navigateur bloque la position : autorisez-la dans les réglages du site (icône à gauche de l’adresse), puis réessayez.',
    introuvable: 'Votre position est introuvable pour le moment. Vous pouvez réessayer.',
  },
  attribution: '© contributeurs OpenStreetMap',
};

/** « Amiens, Abbeville, Arras et Beauvais ». */
export function listeVilles(noms: string[]) {
  return noms.length < 2 ? (noms[0] ?? '') : `${noms.slice(0, -1).join(', ')} et ${noms.at(-1)}`;
}

export type Situation = { ville: Ville; km: number; dansZone: boolean };

/** Ville la plus proche d'une position, distance arrondie, et si la position est dans une zone. */
export function situer(lat: number, lng: number, liste: Ville[] = villes): Situation {
  const [ville, km] = liste
    .map((v) => [v, distanceKm(v.lat, v.lng, lat, lng)] as const)
    .reduce((plusProche, courant) => (courant[1] < plusProche[1] ? courant : plusProche));
  return { ville, km: Math.round(km), dansZone: km <= RAYON_KM };
}

/** « d’Amiens », « de Beauvais » : élision devant une voyelle ou un h. */
export function deVille(nom: string) {
  return /^[aeiouyhàâéèêîôû]/i.test(nom) ? `d’${nom}` : `de ${nom}`;
}

/** « à 12 km d’Amiens », ou « à moins d’1 km de Beauvais » tout près du centre. */
export function aDistance(km: number, ville: string) {
  return `${km < 1 ? 'à moins d’1 km' : `à ${km} km`} ${deVille(ville)}`;
}
