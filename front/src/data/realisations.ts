/**
 * Réalisations présentées (cahier des charges, section 9). Textes repris du portfolio de Baptiste :
 * rien n'est inventé ; ce qui manque reste « [à compléter] ».
 */
import poixAccueil from '../assets/realisations/christophe-poix-moto/accueil.webp';
import poixContact from '../assets/realisations/christophe-poix-moto/contact.webp';
import poixGalerie from '../assets/realisations/christophe-poix-moto/galerie.webp';
import poixHoraires from '../assets/realisations/christophe-poix-moto/horaires.webp';
import poixServices from '../assets/realisations/christophe-poix-moto/services.webp';
import poixZone from '../assets/realisations/christophe-poix-moto/zone.webp';
import ordvAccueil from '../assets/realisations/ordv/accueil.webp';
import ordvConnexion from '../assets/realisations/ordv/connexion.webp';
import ordvEspacePro from '../assets/realisations/ordv/espace-pro.webp';
import ordvInscription from '../assets/realisations/ordv/inscription.webp';
import ordvPriseDeRendezVous from '../assets/realisations/ordv/prise-de-rendez-vous.webp';
import ordvReservation from '../assets/realisations/ordv/reservation.webp';

import { cheminRealisation, type IdRealisation } from './realisationsIds';

export { cheminRealisation };

export type Capture = { src: string; legende: string };

export type Realisation = {
  id: IdRealisation;
  /** Métier ou type de projet. */
  categorie: string;
  titre: string;
  resume: string;
  annee: string;
  /** Lien de la carte : la page du projet. */
  lien: { label: string; to: string };
  /** Illustration provisoire, quand il n'y a pas encore de captures. */
  apercu: 'site' | 'telephones' | 'plateforme';
  /** Textes des emplacements de captures (illustration provisoire). */
  emplacements: string[];
  /** Vraies captures, dans l'ordre d'affichage (la première sert de couverture). */
  captures: Capture[];
  contexte: string;
  besoin: string;
  solution: string;
  fonctionnalites: string[];
  technos: string[];
  /** Site ou démo en ligne. */
  demo?: { label: string; url: string };
};

const A_COMPLETER = '[à compléter]';

/** Textes des pages Réalisations (liste et projet). */
export const pageRealisations = {
  intro: 'Des projets concrets : le besoin de départ, la solution apportée, des captures et, quand c’est possible, une démo à tester.',
  voir: 'Voir le projet',
  retour: { label: '← Toutes les réalisations', to: '/realisations' },
  contexte: 'Le contexte',
  besoin: 'Le besoin',
  solution: 'La solution',
  fonctionnalites: 'Ce que fait le site',
  technos: 'Technologies',
  captures: 'Captures',
  capturesAVenir: 'Les captures arrivent bientôt.',
  precedent: 'Projet précédent',
  suivant: 'Projet suivant',
  appel: { text: 'Un projet du même genre ?', label: 'Composer mon site', to: '/composer' },
};

export const realisations: Realisation[] = [
  {
    id: 'christophe-poix-moto',
    categorie: 'Réparation moto à domicile',
    titre: 'Christophe Poix Moto',
    resume: 'Un site vitrine clair, rapide sur téléphone, pour présenter les prestations et être contacté en un geste.',
    annee: '2026',
    lien: { label: 'Voir le projet', to: cheminRealisation('christophe-poix-moto') },
    apercu: 'site',
    emplacements: ['[capture du site]'],
    captures: [
      { src: poixAccueil, legende: 'Accueil' },
      { src: poixServices, legende: 'Prestations' },
      { src: poixGalerie, legende: 'Galerie des interventions' },
      { src: poixZone, legende: 'Zone d’intervention' },
      { src: poixHoraires, legende: 'Horaires' },
      { src: poixContact, legende: 'Contact' },
    ],
    contexte:
      'Christophe Poix est mécanicien moto indépendant : il se déplace directement chez ses clients, à Amiens et dans un rayon de 50 km.',
    besoin:
      'Une vitrine professionnelle simple pour présenter ses services, montrer où il intervient et faciliter la prise de contact.',
    solution:
      'Un site vitrine clair : les prestations, une carte interactive de la zone d’intervention, une galerie des interventions réalisées, les horaires, et plusieurs façons de le joindre.',
    fonctionnalites: [
      'Présentation des prestations : entretien, diagnostic de panne, freinage, pneumatiques, révision complète, dépannage à domicile',
      'Carte interactive de la zone d’intervention (50 km autour de Thézy-Glimont)',
      'Galerie photo des interventions réalisées',
      'Tableau des horaires de disponibilité',
      'Page contact avec téléphone, e-mail et lien Facebook',
    ],
    technos: ['Next.js', 'React', 'Leaflet', 'OpenStreetMap'],
  },
  {
    id: 'demo-detailing',
    categorie: 'Detailing auto à domicile · démo',
    titre: 'Réservation avec acompte',
    resume: 'Configurateur de prestation, calendrier du mois, frais selon la distance et acompte en ligne.',
    annee: A_COMPLETER,
    lien: { label: 'Voir la démo', to: cheminRealisation('demo-detailing') },
    apercu: 'telephones',
    emplacements: ['[écran réservation]', '[écran acompte]'],
    captures: [],
    contexte: A_COMPLETER,
    besoin: A_COMPLETER,
    solution: A_COMPLETER,
    fonctionnalites: [],
    technos: [],
  },
  {
    id: 'ordv',
    categorie: 'Plateforme de réservation · projet de Bachelor',
    titre: "O'RDV",
    resume: 'Des professionnels publient leurs créneaux, les clients trouvent un prestataire et réservent. Espaces client et pro.',
    annee: '2025 – 2026',
    lien: { label: 'Découvrir le projet', to: cheminRealisation('ordv') },
    apercu: 'plateforme',
    emplacements: ['[recherche de professionnels]'],
    captures: [
      { src: ordvAccueil, legende: 'Accueil et recherche de professionnels' },
      { src: ordvPriseDeRendezVous, legende: 'Prise de rendez-vous' },
      { src: ordvReservation, legende: 'Choix du créneau' },
      { src: ordvEspacePro, legende: 'Espace professionnel' },
      { src: ordvConnexion, legende: 'Connexion' },
      { src: ordvInscription, legende: 'Inscription' },
    ],
    contexte:
      'Projet réalisé pendant mon Bachelor à l’école iT : une plateforme de prise de rendez-vous adaptable à n’importe quel professionnel (médecin, coiffeur, coach…).',
    besoin:
      'Beaucoup de professionnels gèrent encore leurs rendez-vous par téléphone, ou avec des outils pensés pour un seul métier : créneaux en double, oublis, et aucun moyen simple pour le client de voir les disponibilités.',
    solution:
      'Une plateforme en deux espaces : le professionnel publie ses disponibilités et gère son planning, le client recherche un prestataire et réserve un créneau libre en quelques clics. Les données personnelles sont chiffrées en base.',
    fonctionnalites: [
      'Accueil avec recherche de professionnels',
      'Inscription et connexion, espace client et espace pro',
      'Prise de rendez-vous avec les seuls créneaux disponibles',
      'Espace professionnel : planning et réservations',
      'Réservation en temps réel',
      'Accès selon le rôle : client, professionnel, administrateur',
    ],
    technos: ['React', 'React Router', 'Tailwind CSS', 'Node.js', 'MySQL', 'JWT'],
    demo: { label: 'Tester la démo en ligne', url: 'https://o-rdv.vercel.app' },
  },
];

export const realisationParId = (id: string | undefined) => realisations.find((r) => r.id === id);
