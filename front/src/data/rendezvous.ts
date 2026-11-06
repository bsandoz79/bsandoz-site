import { pages } from './pages';

/** Rendez-vous découverte (cahier des charges, section 7, maquette `RDV`). */
export type LieuId = 'chezvous' | 'visio' | 'telephone';

export const lieux: { id: LieuId; nom: string; description: string }[] = [
  { id: 'chezvous', nom: 'Chez vous', description: "Votre atelier, boutique ou local, à 50 km max d'Amiens" },
  { id: 'visio', nom: 'En visio', description: 'Lien envoyé par mail, partout en France' },
  { id: 'telephone', nom: 'Par téléphone', description: 'Je vous appelle au créneau choisi' },
];

/**
 * Disponibilités de départ. À CONFIRMER par Baptiste : jours et horaires repris de la maquette.
 * Le calendrier suit celles du back-office dès que l'API répond ; celles-ci servent de repli.
 */
export const disponibilites = {
  /** Jours travaillés : lundi = 0 … dimanche = 6. */
  joursTravailles: [0, 1, 2, 3, 4],
  /** Débuts des créneaux d'une heure (30 minutes laissées entre deux pour le trajet). */
  creneaux: ['09:00', '10:30', '14:00', '15:30', '17:00'],
  dureeMinutes: 60,
  /** Premier jour réservable : demain. */
  delaiMinJours: 1,
  /** Dernier jour réservable, en jours après aujourd'hui. */
  horizonJours: 60,
  /** Jours fermés (congés), « AAAA-MM-JJ ». */
  joursFermes: [] as string[],
};

/** Zone de déplacement : 50 km à vol d'oiseau autour d'Amiens. */
export const zone = { ville: 'Amiens', latitude: 49.8942, longitude: 2.2958, rayonKm: 50 };

/** Géocodage des adresses : service public de l'IGN (Géoplateforme), sans clé. */
export const urlGeocodage = 'https://data.geopf.fr/geocodage/search';

export const rdvTextes = {
  choix: {
    titre: pages.rendezVous.heading,
    enLigne: { titre: 'Je le décris en ligne', texte: '5 minutes, estimation envoyée tout de suite', to: pages.devis.path },
    voix: { titre: 'Je préfère en parler de vive voix', texte: "Rendez-vous gratuit d'une heure, chez vous ou à distance" },
  },
  lieu: { legende: '1. Où se voit-on ?' },
  adresse: {
    label: 'Adresse du rendez-vous',
    aide: 'Numéro, rue et ville.',
    verifier: "Vérifier l'adresse",
    verification: 'Vérification…',
    ok: (ville: string, km: number) => `${ville}, environ ${km} km d'Amiens : je me déplace gratuitement.`,
    tropLoin: (ville: string, km: number) =>
      `${ville}, environ ${km} km d'Amiens : c'est au-delà de 50 km. Je vous propose la visio ou le téléphone.`,
    introuvable: "Je ne trouve pas cette adresse. Vérifiez-la, ou choisissez la visio ou le téléphone.",
    erreur: "L'adresse n'a pas pu être vérifiée pour l'instant. Je la vérifierai moi-même avant de confirmer.",
    limite: 'Au-delà de 50 km, je vous propose la visio ou le téléphone.',
  },
  creneau: {
    legende: "2. Choisissez un créneau d'une heure",
    calendrier: 'Date du rendez-vous',
    legendeJours: 'Jours barrés : complets ou non travaillés.',
    choisirJour: 'Choisissez un jour pour voir les créneaux.',
    creneauxDu: (jour: string) => `Créneaux du ${jour}`,
    trajet: 'Les créneaux laissent 30 minutes entre deux rendez-vous pour le trajet.',
  },
  coordonnees: {
    legende: '3. Vos coordonnées',
    nom: 'Prénom et nom',
    telephone: 'Téléphone',
    email: 'E-mail',
    activite: 'Votre activité',
    message: 'En deux mots (facultatif)',
    messageAide: 'Ce que vous aimeriez améliorer, un site que vous aimez…',
    consentement:
      "J'accepte que ces informations soient utilisées pour organiser le rendez-vous. Elles ne sont ni revendues ni utilisées à d'autres fins.",
    confidentialite: { label: 'Politique de confidentialité', to: pages.confidentialite.path },
  },
  /** Annonces pour les lecteurs d'écran quand une étape apparaît. */
  etapes: {
    creneau: 'Étape suivante : choisissez une date et un créneau.',
    coordonnees: 'Étape suivante : indiquez vos coordonnées.',
  },
  resume: {
    titre: 'Votre rendez-vous',
    badge: 'Gratuit · 1 heure',
    nom: 'Rendez-vous découverte',
    date: 'Date',
    heure: 'Heure',
    lieu: 'Lieu',
    vide: 'À choisir',
    confirmer: 'Confirmer le rendez-vous',
    aCompleter: 'Choisissez le lieu, puis la date et le créneau, et enfin vos coordonnées.',
    envoi: 'Confirmation…',
    note: 'Confirmation par mail avec un lien pour déplacer ou annuler. Sans engagement.',
    pendant: {
      titre: 'Pendant ce rendez-vous',
      points: [
        "Vous m'expliquez votre activité et vos besoins",
        'Je vous montre des exemples adaptés',
        'Vous repartez avec une idée claire du prix',
      ],
    },
  },
  erreurs: {
    adresse: "Indiquez l'adresse du rendez-vous.",
    adresseHorsZone: "Cette adresse est au-delà de 50 km d'Amiens : choisissez la visio ou le téléphone.",
    jour: 'Choisissez un jour.',
    creneau: 'Choisissez un créneau.',
    nom: 'Indiquez votre nom.',
    telephone: 'Indiquez un numéro de téléphone valide.',
    email: 'Indiquez une adresse e-mail valide, par exemple nom@exemple.fr.',
    consentement: 'Cochez la case pour que je puisse organiser le rendez-vous.',
    resume: (n: number) => (n > 1 ? `${n} champs sont à corriger.` : 'Un champ est à corriger.'),
  },
  confirme: {
    titre: 'Votre rendez-vous est demandé !',
    texte: 'Vous allez recevoir un e-mail de confirmation avec un lien pour le déplacer ou l’annuler.',
    accueil: { label: "Retour à l'accueil", to: pages.accueil.path },
  },
  echec: {
    titre: "Le rendez-vous n'a pas pu être enregistré.",
    texte: 'Vos réponses sont gardées. Réessayez dans un instant, ou écrivez-moi à contact@bsandoz.fr.',
    complet: 'Ce créneau vient d’être pris : choisissez-en un autre.',
  },
};
