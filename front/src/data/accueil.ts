import { pages } from './pages';

/** Textes de la page d'accueil (maquette `Main` et `Mobile`, cahier des charges section 9). */
export const hero = {
  badge: 'Création de sites internet sur mesure · Amiens',
  text: `Je crée des sites et des outils sur mesure pour les artisans, commerçants et indépendants, à Amiens et partout en France. Une fois en ligne, vous changez vous-même vos textes, vos photos et vos prix, sans coder.`,
  /** Suivi du seul prix affiché (`prixDepart`), puis « sur devis ». */
  prix: { avant: 'Sites à partir de', apres: 'Le prix exact dans votre devis, sous 24 h, payable en 3 ou 4 fois sans frais.' },
  /** Qui est derrière le site : photo, nom, métier. */
  identite: { nom: 'Baptiste Sandoz', role: 'Développeur web à Amiens', alt: 'Baptiste Sandoz, développeur web à Amiens' },
  primary: { label: 'Demander un devis', to: pages.devis.path },
  secondary: { label: 'Voir les réalisations', to: pages.realisations.path },
  rdv: { question: 'Vous préférez en parler ?', label: 'Prendre un rendez-vous gratuit', to: pages.rendezVous.path },
  reassurance: ['Basé à Amiens', 'Réponse sous 24 h', 'Sans abonnement imposé'],
};

/** Écran de démonstration du hero : décoratif, caché aux lecteurs d'écran. */
export const heroDemo = {
  business: 'Atelier Brillance',
  title: 'Choisissez votre créneau',
  month: 'Novembre 2026',
  weekdays: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
  /** Deux semaines : `off` = jour fermé. */
  days: [
    { day: 9, off: true },
    { day: 10 },
    { day: 11 },
    { day: 12 },
    { day: 13 },
    { day: 14, selected: true },
    { day: 15, off: true },
    { day: 16 },
    { day: 17 },
    { day: 18 },
    { day: 19 },
    { day: 20 },
    { day: 21 },
    { day: 22, off: true },
  ] as { day: number; off?: boolean; selected?: boolean }[],
  slots: ['10:00', '13:30', '15:00', '16:30'],
  selectedSlot: '10:00',
  button: 'Réserver · acompte 30 €',
  notifications: [
    { label: 'Nouveau rendez-vous', value: 'Sam. 14 nov · 10:00' },
    { label: 'Acompte reçu', value: '30,00 €', success: true },
  ],
};

/** Bande défilante sous le haut de page : des métiers qui ont besoin d'un site. */
export const metiers = {
  question: 'Vous avez une entreprise, mais pas encore de site ?',
  label: 'Métiers qui ont besoin d’un site',
  items: [
    'Avocats',
    'Couvreurs',
    'Plombiers',
    'Électriciens',
    'Menuisiers',
    'Paysagistes',
    'Coiffeurs',
    'Esthéticiennes',
    'Restaurants',
    'Boulangeries',
    'Garages',
    'Photographes',
    'Coachs',
    'Kinésithérapeutes',
    'Agents immobiliers',
    'Boutiques',
  ],
};

/** Ce que le client change seul, une fois son site livré (édition par bloc, voir `docs/fonctionnalites/back-office.md`). */
export const autonomie = {
  titre: 'Votre site, vous le modifiez vous-même',
  intro:
    'Connecté à votre compte, vous voyez un bouton « Modifier » sur chaque partie de votre site. Vous changez ce que vous voulez, vous enregistrez, et c’est en ligne.',
  items: [
    { titre: 'Vos textes', texte: 'Présentation, horaires, adresse, téléphone, questions fréquentes.' },
    { titre: 'Vos photos', texte: 'Vous en choisissez une : elle est réduite pour que le site reste rapide.' },
    { titre: 'Vos prix', texte: 'Tarifs et prestations, à jour en quelques secondes.' },
    { titre: 'Sans coder', texte: 'Rien à installer, et pas de facture à chaque changement.' },
  ],
  note: 'Une nouvelle page ou un menu à revoir ? Je m’en occupe.',
};

export const realisationsSection = {
  title: 'Mes réalisations',
  lien: 'Voir toutes les réalisations',
};

export const methode = {
  title: 'Comment ça se passe',
  steps: [
    {
      duree: 'Quelques minutes',
      title: 'Vous décrivez votre projet',
      text: 'Avec vos mots, sans jargon.',
    },
    {
      duree: 'Sous 24 h',
      title: 'Je vous envoie un devis clair',
      text: "Avec des idées auxquelles vous n'aviez peut-être pas pensé, en options.",
    },
    {
      duree: '5 à 7 jours ouvrés',
      title: 'Vous voyez votre site',
      text: 'Un premier aperçu privé de votre site vitrine, une fois vos réponses reçues. Retouches à volonté jusqu’à ce qu’il vous plaise.',
    },
    {
      duree: 'Le jour où vous validez',
      title: 'Il est en ligne',
      text: 'Il est à vous : vous le modifiez seul. 30 jours d’ajustements offerts après la mise en ligne.',
    },
  ],
};

/**
 * Trois façons d'avoir un site, comparées honnêtement (idée reprise de Roselyn Pro, textes propres).
 * Aucun chiffre sur les autres : les pratiques varient, d'où la note.
 */
export const comparatif = {
  titre: 'Trois façons d’avoir un site',
  intro: 'Chacune a ses avantages. Voici ce qui change pour vous.',
  colonnes: ['Plateforme à abonnement', 'Avec moi', 'Agence web'],
  /** Colonne mise en avant. */
  miseEnAvant: 1,
  lignes: [
    { critere: 'Qui fait le site', valeurs: ['Vous, à partir d’un modèle', 'Moi, sur mesure', 'Une équipe'] },
    { critere: 'Les textes', valeurs: ['Vous les écrivez', 'Vous, ou je les écris pour vous', 'Selon l’agence'] },
    { critere: 'Le prix', valeurs: ['Un abonnement chaque mois', 'Un prix fixe, payable en 3 ou 4 fois', 'Sur devis'] },
    { critere: 'Les modifications', valeurs: ['Dans l’outil de la plateforme', 'Vous, directement sur votre site', 'Selon le contrat'] },
    { critere: 'Si vous partez', valeurs: ['Le site reste sur la plateforme', 'Vous gardez tout : site, code, nom de domaine', 'Selon le contrat'] },
    { critere: 'Votre contact', valeurs: ['Un support en ligne', 'Moi, à Amiens, réponse sous 24 h', 'Un chef de projet'] },
  ],
  note: 'Les pratiques varient d’une plateforme et d’une agence à l’autre : lisez toujours le contrat.',
};

/** Ce qui compte pour Baptiste : repris sur la page À propos. */
export const pourquoi = {
  items: [
    { title: 'Un seul interlocuteur', text: 'Local, qui vous répond.' },
    { title: 'Un devis clair', text: 'Sans surprise.' },
    { title: 'Votre site vous appartient', text: "Pas d'abonnement imposé." },
    { title: 'Vous restez autonome', text: 'Prix, horaires, photos : vous les changez.' },
  ],
};

