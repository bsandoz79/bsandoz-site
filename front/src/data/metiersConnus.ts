import { normaliser } from '@bsandoz79/blocs';
import type { MetierId } from './offres';

/**
 * Métiers proposés pendant la saisie (« me » → menuisier, mécanicien…), avec leur catégorie.
 * La catégorie choisit les fonctionnalités proposées pour un site Fonctionnel (`optionsParMetier`).
 * Un métier absent de la liste reste accepté tel qu'il est écrit, dans la catégorie « autre ».
 */
const parCategorie: Record<MetierId, string[]> = {
  artisan: ['Detailing auto', 'Mécanicien', 'Garagiste', 'Carrossier', 'Réparateur moto', 'Réparateur vélo', 'Entreprise de nettoyage', 'Jardinier', 'Paysagiste', 'Déménageur', 'Toiletteur canin', 'Pet-sitter', 'Taxi'],
  batiment: ['Menuisier', 'Maçon', 'Plombier', 'Électricien', 'Chauffagiste', 'Climaticien', 'Couvreur', 'Charpentier', 'Peintre en bâtiment', 'Plaquiste', 'Carreleur', 'Serrurier', 'Vitrier', 'Ébéniste', 'Ramoneur', 'Architecte'],
  beaute: ['Coiffeur', 'Coiffure à domicile', 'Barbier', 'Esthéticienne', 'Prothésiste ongulaire', 'Tatoueur'],
  commerce: ['Boulanger', 'Pâtissier', 'Boucher', 'Charcutier', 'Fromager', 'Primeur', 'Caviste', 'Épicerie fine', 'Fleuriste', 'Boutique de vêtements', 'Bijoutier', 'Opticien', 'Librairie', 'Animalerie', 'Magasin de vélos', 'Créateur artisanal'],
  restaurant: ['Restaurant', 'Pizzeria', 'Kebab', 'Snack', 'Crêperie', 'Brasserie', 'Bar', 'Café', 'Salon de thé', 'Fast-food', 'Food truck'],
  sante: ['Masseur', 'Ostéopathe', 'Kinésithérapeute', 'Infirmier', 'Psychologue', 'Sophrologue', 'Naturopathe', 'Diététicien', 'Podologue', 'Orthophoniste'],
  liberal: ['Avocat', 'Notaire', 'Expert-comptable', 'Agent immobilier', 'Consultant', 'Architecte d’intérieur'],
  cours: ['Coach sportif', 'Professeur de yoga', 'Auto-école', 'Formateur', 'Professeur particulier', 'Professeur de musique', 'Salle de sport'],
  hebergement: ['Gîte', 'Chambre d’hôtes', 'Camping', 'Location saisonnière'],
  association: ['Association', 'Club sportif', 'Comité des fêtes'],
  evenementiel: ['Photographe', 'Vidéaste', 'DJ', 'Wedding planner', 'Traiteur', 'Graphiste', 'Fleuriste événementiel'],
  autre: [],
};


export const metiersConnus: { nom: string; categorie: MetierId }[] = (Object.keys(parCategorie) as MetierId[]).flatMap(
  (categorie) => parCategorie[categorie].map((nom) => ({ nom, categorie })),
);

/** Noms seuls, triés, pour les suggestions. */
export const nomsMetiers = metiersConnus.map((m) => m.nom).sort((a, b) => a.localeCompare(b, 'fr'));

/** Catégorie d'un métier écrit : celle de la liste s'il y est (sans tenir compte des accents), sinon « autre ». */
export function categorieDuMetier(nom: string): MetierId | null {
  const n = normaliser(nom);
  if (!n) return null;
  return metiersConnus.find((m) => normaliser(m.nom) === n)?.categorie ?? 'autre';
}
