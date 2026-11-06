import { distanceKm } from './distance';

/**
 * Zones d'intervention : 50 km sans frais autour d'Amiens et d'Abbeville (là où j'habite).
 * Au-delà, seuls les kilomètres en plus sont facturés, au prix de l'essence.
 * Sert à la carte de l'accueil et à la page Rendez-vous.
 */
export type Ville = { id: string; nom: string; lat: number; lng: number };

export const RAYON_KM = 50;

export const villes: Ville[] = [
  { id: 'amiens', nom: 'Amiens', lat: 49.8941, lng: 2.2958 },
  { id: 'abbeville', nom: 'Abbeville', lat: 50.1054, lng: 1.8336 },
];

export const carteTextes = {
  eyebrow: 'Où j’interviens',
  titre: 'Je me déplace chez vous.',
  intro: (liste: string) =>
    `Sans frais dans un rayon de ${RAYON_KM} km autour ${liste}. Plus loin, je viens quand même : seuls les kilomètres en plus sont facturés, au prix de l’essence. Partout en France : en visio ou par téléphone.`,
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
    horsZone: (distance: string, frais: string) =>
      `Vous êtes ${distance}, un peu au-delà de ma zone. Pas d’inquiétude : je me déplace quand même, seuls les kilomètres en plus sont facturés, environ ${frais} d’essence (dus même si le projet ne se fait pas). La visio et le téléphone restent possibles partout.`,
    bouton: 'Me situer sur la carte',
    bloquee: 'Votre navigateur bloque la position : autorisez-la dans les réglages du site (icône à gauche de l’adresse), puis réessayez.',
    introuvable: 'Votre position est introuvable pour le moment. Vous pouvez réessayer.',
  },
  attribution: '© contributeurs OpenStreetMap',
};

/** « Amiens et Abbeville », « Amiens, Abbeville et Arras ». */
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

/** Frais kilométriques : prix du gazole et consommation retenus. */
export const PRIX_GAZOLE_LITRE = 2.5;
export const CONSOMMATION_L_100KM = 7.5;
/** Coût d'un kilomètre : 2,50 € × 7,5 L / 100 km = 0,1875 €. */
export const COUT_KM = (PRIX_GAZOLE_LITRE * CONSOMMATION_L_100KM) / 100;

/** Kilomètres facturés : ceux au-delà des 50 km (100 km → 50 km facturés). */
export function kmFactures(km: number) {
  return Math.max(0, km - RAYON_KM);
}

/** Frais kilométriques en euros, au centime. */
export function fraisKilometriques(km: number) {
  return Math.round(kmFactures(km) * COUT_KM * 100) / 100;
}

/** « 9,38 € » (toujours deux décimales). */
export function formatFrais(montant: number) {
  return `${new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(montant)} €`.replace(/[  ]/g, ' ');
}

/** « d’Amiens et d’Abbeville » : la zone sans frais, en toutes lettres. */
export function zoneSansFrais(liste: Ville[] = villes) {
  const noms = liste.map((v) => deVille(v.nom));
  return noms.length < 2 ? (noms[0] ?? '') : `${noms.slice(0, -1).join(', ')} et ${noms.at(-1)}`;
}
