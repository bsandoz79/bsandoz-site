/**
 * Réalisations présentées (cahier des charges, section 9). Textes repris du portfolio de Baptiste :
 * rien n'est inventé ; ce qui manque reste « [à compléter] ».
 */
import detailingAbonnement from '../assets/realisations/demo-detailing/abonnement.webp';
import detailingAccueil from '../assets/realisations/demo-detailing/accueil.webp';
import detailingEncaisser from '../assets/realisations/demo-detailing/encaisser.webp';
import detailingFidelite from '../assets/realisations/demo-detailing/fidelite.webp';
import detailingPrestations from '../assets/realisations/demo-detailing/prestations.webp';
import detailingPro from '../assets/realisations/demo-detailing/pro.webp';
import detailingProfessionnels from '../assets/realisations/demo-detailing/professionnels.webp';
import detailingReservation from '../assets/realisations/demo-detailing/reservation.webp';
import detailingZone from '../assets/realisations/demo-detailing/zone.webp';
import poixAccueil from '../assets/realisations/christophe-poix-moto/accueil.webp';
import poixContact from '../assets/realisations/christophe-poix-moto/contact.webp';
import poixGalerie from '../assets/realisations/christophe-poix-moto/galerie.webp';
import poixHoraires from '../assets/realisations/christophe-poix-moto/horaires.webp';
import poixServices from '../assets/realisations/christophe-poix-moto/services.webp';
import poixZone from '../assets/realisations/christophe-poix-moto/zone.webp';
import alternoAccueil from '../assets/realisations/alterno/accueil.webp';
import alternoCompteur from '../assets/realisations/alterno/compteur.webp';
import alternoCover from '../assets/realisations/alterno/cover.webp';
import alternoEcole from '../assets/realisations/alterno/ecole.webp';
import alternoSemaine from '../assets/realisations/alterno/semaine.webp';
import alternoSimulation from '../assets/realisations/alterno/simulation.webp';
import ordvAccueil from '../assets/realisations/ordv/accueil.webp';
import ordvConnexion from '../assets/realisations/ordv/connexion.webp';
import ordvEspacePro from '../assets/realisations/ordv/espace-pro.webp';
import ordvInscription from '../assets/realisations/ordv/inscription.webp';
import ordvPriseDeRendezVous from '../assets/realisations/ordv/prise-de-rendez-vous.webp';
import ordvReservation from '../assets/realisations/ordv/reservation.webp';

import { cheminRealisation, type IdRealisation } from './realisationsIds';

export { cheminRealisation };

export type Capture = { src: string; legende: string };

/** Ce qu'affiche une carte : une vraie réalisation, ou un exemple d'outil (`exemple`, voir `data/exemples.ts`). */
export type CarteRealisation = Pick<Realisation, 'categorie' | 'titre' | 'resume' | 'lien' | 'apercu' | 'emplacements' | 'captures'> & {
  id: string;
  /** Maquette d'une entreprise fictive : marquée « Exemple » sur la carte. */
  exemple?: boolean;
};

/** Type de projet, pour le filtre de la page Réalisations. */
export type TypeRealisation = 'site' | 'appli';

export type Realisation = {
  id: IdRealisation;
  /** Métier ou type de projet. */
  categorie: string;
  type: TypeRealisation;
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
  appel: { text: 'Un projet du même genre ?', label: 'Demander un devis', to: '/devis' },
  filtre: {
    legende: 'Afficher',
    nombre: (n: number) => (n > 1 ? `${n} projets` : `${n} projet`),
    aucun: 'Aucun projet de ce type pour le moment.',
  },
};

/** Filtres de la page Réalisations : « tout » d'abord. */
export const filtresRealisations: { value: 'tout' | TypeRealisation; label: string }[] = [
  { value: 'tout', label: 'Tout' },
  { value: 'site', label: 'Sites web' },
  { value: 'appli', label: 'Applis & plateformes' },
];

export type FiltreRealisation = (typeof filtresRealisations)[number]['value'];

/** Projets d'un filtre (un filtre inconnu vaut « tout »). */
export function realisationsFiltrees(filtre: string | null): Realisation[] {
  return filtre === 'site' || filtre === 'appli' ? realisations.filter((r) => r.type === filtre) : realisations;
}

export const realisations: Realisation[] = [
  {
    id: 'christophe-poix-moto',
    categorie: 'Réparation moto à domicile',
    type: 'site',
    titre: 'Christophe Poix Moto',
    resume: 'Site vitrine d’un mécanicien moto qui se déplace à domicile.',
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
    type: 'site',
    titre: 'Perfect Clean',
    resume: 'Démo : réservation en ligne, abonnements, paiement par QR code, espace pro.',
    annee: '2026',
    lien: { label: 'Voir la démo', to: cheminRealisation('demo-detailing') },
    apercu: 'telephones',
    emplacements: ['[écran réservation]', '[écran paiement]'],
    captures: [
      { src: detailingAccueil, legende: 'Accueil : scène animée (boue, mousse, rinçage, garage) et réservation directe' },
      { src: detailingPrestations, legende: 'Prestations : formules, durée et ce qui est compris' },
      { src: detailingReservation, legende: 'Réservation : formule complète, intérieur et extérieur au choix' },
      { src: detailingAbonnement, legende: 'Abonnements : un lavage par semaine, quinzaine, mois ou année' },
      { src: detailingPro, legende: 'Espace pro : la journée, l’itinéraire et l’encaissement' },
      { src: detailingEncaisser, legende: 'Encaissement sur place : QR code de paiement par carte' },
      { src: detailingZone, legende: 'Zone d’intervention : frais de déplacement selon la distance' },
      { src: detailingFidelite, legende: 'Carte de fidélité : une remise après 4 prestations' },
      { src: detailingProfessionnels, legende: 'Professionnels : demande de devis pour les flottes' },
    ],
    contexte:
      'Une démo complète pour un artisan de detailing auto à domicile, autour d’Abbeville (marque fictive « Perfect Clean »). Ce type d’artisan paie souvent un outil de réservation par abonnement, autour de 44 € par mois.',
    besoin:
      'Que les clients réservent seuls un créneau qui tient compte de la durée de la prestation et du trajet, avec le bon prix et les frais de déplacement calculés selon l’adresse. Et un système qui appartient à l’artisan, sans abonnement.',
    solution:
      'Un site avec un parcours de réservation en étapes, le paiement en ligne ou sur place, des abonnements prélevés automatiquement, un espace client et un espace pro (planning, encaissement, catalogue, horaires, factures). L’accueil s’ouvre sur une courte scène animée, et l’espace pro s’installe comme une application sur le téléphone. Hébergé chez o2switch, avec ses propres données, sans abonnement en dehors des frais de paiement.',
    fonctionnalites: [
      'Accueil animé : la voiture passe de la boue au garage en quelques secondes, puis réservation en un clic',
      'Réservation en étapes : prestation et options, adresse, créneau, coordonnées',
      'Formule complète : intérieur et extérieur au choix, avec une remise',
      'Frais de déplacement par tranches selon la distance, carte de la zone',
      'Créneaux calculés avec la durée de la prestation et le trajet',
      'Paiement en ligne de la totalité, ou réglé sur place (carte, QR code, espèces, virement, chèque)',
      'Abonnements sans engagement, prélevés automatiquement (Stripe)',
      'Mails de confirmation avec le rendez-vous à ajouter à son agenda',
      'Espace client : rendez-vous, abonnement, déplacement, annulation, factures',
      'Espace pro installable sur le téléphone : journée, itinéraire Maps ou Waze, encaissement, planning, catalogue, factures, comptabilité',
      'Textes et formules modifiables directement sur le site par l’artisan',
      'Demande de devis pour les professionnels (flottes, utilitaires)',
    ],
    technos: ['React', 'TypeScript', 'Symfony', 'MySQL', 'Stripe', 'Leaflet'],
    demo: { label: 'Essayer la démo en ligne', url: 'https://demo.bsandoz.fr' },
  },
  {
    id: 'ordv',
    categorie: 'Plateforme de réservation · projet de Bachelor',
    type: 'appli',
    titre: "O'RDV",
    resume: 'Plateforme de réservation avec espaces client et professionnel.',
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
  {
    id: 'alterno',
    categorie: 'Application mobile · projet personnel',
    type: 'appli',
    titre: 'Alterno',
    resume: 'Application Android qui planifie les horaires variables d’un alternant.',
    annee: '2026',
    lien: { label: 'Découvrir le projet', to: cheminRealisation('alterno') },
    apercu: 'telephones',
    emplacements: ['[heure de départ du jour]'],
    captures: [
      { src: alternoCover, legende: 'Présentation' },
      { src: alternoAccueil, legende: 'Aujourd’hui : heure de départ prévue' },
      { src: alternoSimulation, legende: 'Simulation de semaines' },
      { src: alternoSemaine, legende: 'Planning de la semaine' },
      { src: alternoCompteur, legende: 'Compteur d’heures' },
      { src: alternoEcole, legende: 'Semaines d’école' },
    ],
    contexte:
      'En alternance avec des horaires variables, je devais calculer moi-même chaque jour mon heure de départ pour tenir mon objectif d’heures, gagner une journée de récupération ou rattraper un compteur négatif, tout en tenant compte des semaines d’école.',
    besoin:
      'Proposer un plan d’horaires réaliste sur une ou plusieurs semaines, le recalculer dès qu’on s’en écarte et suivre le solde d’heures, le tout sur le téléphone, sans compte ni pisteur.',
    solution:
      'Une application Android (et web) qui fait ces calculs à ma place : elle donne l’heure de départ du jour, recalcule le plan au moindre changement et garde les données sur le téléphone. Le moteur de calcul est séparé de l’application et entièrement testé.',
    fonctionnalites: [
      'Heure de départ prévue et temps restant, à la minute près',
      'Simulation sur 1 à 4 semaines : objectif d’heures ou journée de récupération',
      'Recalcul automatique : arrivée plus tard, départ plus tôt, pause plus longue',
      'Planning façon emploi du temps (semaine et mois), semaines d’école exclues',
      'Compteur d’heures, historique mensuel et rappels de départ',
      'Page « Mes données » : export et effacement complet',
    ],
    technos: ['React Native', 'Expo', 'TypeScript', 'SQLite', 'Vitest', 'GitHub Actions'],
    demo: { label: 'Voir le code sur GitHub', url: 'https://github.com/bsandoz79/Alterno' },
  },
];

export const realisationParId = (id: string | undefined) => realisations.find((r) => r.id === id);
