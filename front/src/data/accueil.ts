import { formuleParId, prixFormule } from './offres';
import { contact } from './navigation';
import { pages } from './pages';

/** Textes de la page d'accueil (maquette `Main` et `Mobile`, cahier des charges section 9). */
export const hero = {
  badge: 'Création de sites internet sur mesure · Amiens',
  text: `Développeur web à Amiens, je conçois des sites et des outils de réservation pour les artisans, commerçants et indépendants, dans la Somme et partout en France, ${prixFormule(formuleParId('vitrine'))}.`,
  /** Qui est derrière le site : photo, nom, métier. */
  identite: { nom: 'Baptiste Sandoz', role: 'Développeur web à Amiens', alt: 'Baptiste Sandoz, développeur web à Amiens' },
  primary: { label: 'Estimer mon projet', to: `${pages.composer.path}?onglet=web` },
  secondary: { label: 'Voir les réalisations', to: pages.realisations.path },
  rdv: { label: "Vous préférez en parler ? Prenez un rendez-vous gratuit d'une heure", to: pages.rendezVous.path },
  reassurance: ['Basé à Amiens', 'Réponse sous 24 h', 'Votre site vous appartient'],
};

/** Bande de chiffres clés sous le hero : seulement des faits affichés ailleurs sur le site. */
export const chiffres = {
  label: 'En bref',
  liste: [
    { valeur: formuleParId('vitrine').delai, texte: 'pour mettre un site vitrine en ligne' },
    { valeur: '1', texte: 'seul interlocuteur, du devis à la mise en ligne' },
    { valeur: '24 h', texte: 'pour recevoir une réponse à votre demande' },
    { valeur: '50 km', texte: "autour d'Amiens et d'Abbeville : je me déplace gratuitement" },
  ],
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

export const metiers = {
  label: 'Métiers accompagnés',
  items: [
    'Detailing auto',
    'Paysagistes',
    'Plombiers',
    'Coiffure à domicile',
    'Restaurants',
    'Boutiques',
    'Coachs',
    'Esthéticiennes',
  ],
};

export const problemes = {
  title: 'Ce qui vous fait perdre des clients',
  items: [
    { probleme: 'Vous ratez des appels pendant vos interventions.', solution: 'Vos clients réservent seuls, 24 h/24.' },
    {
      probleme: 'On ne vous trouve pas sur Google.',
      solution: 'Un site rapide, pensé pour les recherches près de chez vous.',
    },
    {
      probleme: 'Des clients ne viennent pas au rendez-vous.',
      solution: 'Acompte en ligne et rappel automatique la veille.',
    },
    {
      probleme: 'Vous passez vos soirées à faire des devis.',
      solution: 'Un calculateur qui donne le prix à votre place.',
    },
  ],
};

export const offres = {
  title: 'Mes tarifs',
  link: { label: 'Composer mon site', to: `${pages.composer.path}?onglet=web` },
  featuredBadge: 'Le plus complet',
  /** Libellé du bouton de chaque formule. */
  cta: {
    vitrine: 'Choisir Vitrine',
    vitrinePlus: 'Choisir Vitrine+',
    fonctionnel: 'Composer mon projet',
  },
};

export const realisationsSection = {
  title: 'Mes réalisations',
};

export const methode = {
  title: 'Comment ça se passe',
  steps: [
    {
      title: 'Vous décrivez votre projet',
      text: 'Avec vos mots, sans jargon. Vous recevez une première estimation tout de suite.',
    },
    {
      title: 'Je vous envoie un devis clair',
      text: "Avec des idées auxquelles vous n'aviez peut-être pas pensé, en options.",
    },
    { title: 'Je crée votre site', text: 'Vous le voyez et le validez avant la mise en ligne.' },
    { title: 'Il est en ligne', text: 'Vous savez le gérer, et je reste joignable.' },
  ],
};

export const pourquoi = {
  title: 'Pourquoi travailler avec moi',
  photo: 'Baptiste Sandoz, développeur web à Amiens',
  photoCaption: 'Baptiste · développeur à Amiens',
  items: [
    { title: 'Un seul interlocuteur', text: 'Local, qui vous répond.' },
    { title: 'Des prix affichés', text: 'Sans surprise.' },
    { title: 'Votre site vous appartient', text: "Pas d'abonnement imposé." },
    { title: 'Vous restez autonome', text: 'Prix, horaires, photos : vous les changez.' },
  ],
  portfolio: { label: 'Voir mon parcours et mes compétences sur mon portfolio', href: contact.portfolio },
};

