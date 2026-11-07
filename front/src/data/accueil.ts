import { formuleParId, prixFormule } from './offres';
import { pages } from './pages';

/** Textes de la page d'accueil (maquette `Main` et `Mobile`, cahier des charges section 9). */
export const hero = {
  badge: 'Création de sites internet sur mesure · Amiens',
  text: `Je crée des sites et des outils sur mesure pour les artisans, commerçants et indépendants, à Amiens et partout en France. Une fois en ligne, vous changez vous-même vos textes, vos photos et vos prix, sans coder. Sites ${prixFormule(formuleParId('vitrine'))}.`,
  /** Qui est derrière le site : photo, nom, métier. */
  identite: { nom: 'Baptiste Sandoz', role: 'Développeur web à Amiens', alt: 'Baptiste Sandoz, développeur web à Amiens' },
  primary: { label: 'Demander un devis', to: pages.devis.path },
  secondary: { label: 'Voir les réalisations', to: pages.realisations.path },
  rdv: { label: "Vous préférez en parler ? Prenez un rendez-vous gratuit d'une heure", to: pages.rendezVous.path },
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
  pause: 'Mettre en pause',
  lecture: 'Relancer le défilement',
};

export const methode = {
  title: 'Comment ça se passe',
  steps: [
    {
      title: 'Vous décrivez votre projet',
      text: 'Avec vos mots, sans jargon. Je vous réponds sous 24 h.',
    },
    {
      title: 'Je vous envoie un devis clair',
      text: "Avec des idées auxquelles vous n'aviez peut-être pas pensé, en options.",
    },
    { title: 'Je crée votre site', text: 'Vous le voyez et le validez avant la mise en ligne.' },
    { title: 'Il est en ligne', text: 'Il est à vous : vous le modifiez seul, et je reste joignable.' },
  ],
};

/** Ce que le client reçoit à la livraison. */
export const livraison = {
  titre: 'Ce que vous recevez à la livraison',
  items: [
    { titre: 'Votre site en ligne', texte: 'Vous l’avez vu et validé avant sa mise en ligne.' },
    { titre: 'Un site à vous', texte: 'Le code, les contenus et les réglages vous appartiennent. Rien n’est verrouillé de mon côté.' },
    { titre: 'Votre nom de domaine', texte: 'À votre nom, comme l’hébergement.' },
    { titre: 'La prise en main', texte: 'Je vous montre comment modifier votre site, et je reste joignable ensuite.' },
  ],
};

/** Ce qui compte pour Baptiste : repris sur la page À propos. */
export const pourquoi = {
  items: [
    { title: 'Un seul interlocuteur', text: 'Local, qui vous répond.' },
    { title: 'Des prix affichés', text: 'Sans surprise.' },
    { title: 'Votre site vous appartient', text: "Pas d'abonnement imposé." },
    { title: 'Vous restez autonome', text: 'Prix, horaires, photos : vous les changez.' },
  ],
};

