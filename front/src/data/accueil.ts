import { pages } from './pages';

/** Textes de la page d'accueil (maquette `Main` et `Mobile`, cahier des charges section 9). */
export const hero = {
  badge: 'Création de sites internet sur mesure · Amiens',
  text: `Je crée des sites et des outils sur mesure pour les artisans, commerçants et indépendants, à Amiens et partout en France. Une fois en ligne, vous changez vous-même vos textes, vos photos et vos prix, sans coder.`,
  /** Autour du prix de départ (`prixDepart`, le plus petit des formules), détaillées dans « Les tarifs ». */
  prix: { avant: 'Sites à partir de', apres: 'Le prix exact dans votre devis, sous 24 h, payable en 3 ou 4 fois sans frais.' },
  /** Qui est derrière le site : photo, nom, métier. */
  identite: { nom: 'Baptiste Sandoz', role: 'Développeur web à Amiens', alt: 'Baptiste Sandoz, développeur web à Amiens' },
  primary: { label: 'Demander un devis', to: pages.devis.path },
  secondary: { label: 'Voir les réalisations', to: pages.realisations.path },
  rdv: { question: 'Vous préférez en parler ?', label: 'Prendre un rendez-vous gratuit', to: pages.rendezVous.path },
  reassurance: ['Basé à Amiens', 'Réponse sous 24 h', 'Sans abonnement imposé'],
};

/**
 * Téléphone du haut de page : les sites de Baptiste défilent tout seuls (de haut en bas), puis une réservation fictive
 * se joue (jour, heure, « Réserver », acompte reçu). Décoratif, caché aux lecteurs d'écran.
 * `duree` : temps passé sur l'écran ; le défilement occupe ce temps (pause en haut et en bas).
 */
export const ecransTelephone = [
  { id: 'christophe-poix-moto', nom: 'Christophe Poix Moto', type: 'Réalisation', duree: 9000 },
  { id: 'reservation', nom: 'Réservation en ligne, acompte', type: 'Exemple', duree: 7000 },
  { id: 'perfect-clean', nom: 'Perfect Clean', type: 'Démo', duree: 9000 },
  { id: 'cadeaux', nom: 'Cadeaux', type: 'Réalisation', duree: 6500 },
  { id: 'shoptonchargeur', nom: 'Shop ton chargeur', type: 'Réalisation', duree: 9000 },
  { id: 'kebab', nom: 'Carte d’un kebab', type: 'Exemple', duree: 5000 },
  { id: 'alterno', nom: 'Alterno · appli Android', type: 'Réalisation', duree: 4500 },
] as const;

/** Écran de réservation fictif (codé, pas une capture), joué étape par étape sur le téléphone. */
export const reservationDemo = {
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
  /** Chaque métier mène à sa page. */
  items: [
    { nom: 'Plombiers', to: pages.batiment.path },
    { nom: 'Coiffeurs', to: pages.beaute.path },
    { nom: 'Restaurants', to: pages.restaurant.path },
    { nom: 'Avocats', to: pages.liberal.path },
    { nom: 'Électriciens', to: pages.batiment.path },
    { nom: 'Esthéticiennes', to: pages.beaute.path },
    { nom: 'Coachs', to: pages.cours.path },
    { nom: 'Gîtes', to: pages.hebergement.path },
    { nom: 'Couvreurs', to: pages.batiment.path },
    { nom: 'Kinésithérapeutes', to: pages.independant.path },
    { nom: 'Boulangeries', to: pages.ecommerce.path },
    { nom: 'Photographes', to: pages.evenementiel.path },
    { nom: 'Associations', to: pages.association.path },
    { nom: 'Menuisiers', to: pages.batiment.path },
    { nom: 'Garages', to: pages.artisan.path },
    { nom: 'Experts-comptables', to: pages.liberal.path },
    { nom: 'Auto-écoles', to: pages.cours.path },
    { nom: 'Boutiques', to: pages.ecommerce.path },
    { nom: 'Traiteurs', to: pages.evenementiel.path },
    { nom: 'Paysagistes', to: pages.artisan.path },
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
/** Avis sur une case du comparatif : oui (avantage), non (inconvénient), variable (selon le prestataire). */
export type Verdict = 'oui' | 'non' | 'variable';

export const comparatif = {
  titre: 'Trois façons d’avoir un site',
  intro: 'Ce qui change pour vous, critère par critère.',
  /** « Avec moi » au milieu, entre les deux autres solutions : c'est la colonne mise en avant. */
  colonnes: ['Plateforme à abonnement', 'Avec moi', 'Agence web'],
  miseEnAvant: 1,
  badge: 'Recommandé',
  lignes: [
    { critere: 'Le prix', valeurs: [{ texte: 'Un abonnement à payer chaque mois', verdict: 'non' }, { texte: 'Un prix fixe, payable en 3 ou 4 fois', verdict: 'oui' }, { texte: 'Sur devis', verdict: 'variable' }] },
    { critere: 'Qui fait le site', valeurs: [{ texte: 'Vous, à partir d’un modèle', verdict: 'non' }, { texte: 'Moi, sur mesure pour votre métier', verdict: 'oui' }, { texte: 'Une équipe', verdict: 'oui' }] },
    { critere: 'Les textes', valeurs: [{ texte: 'Vous les écrivez', verdict: 'non' }, { texte: 'Je peux les écrire pour vous', verdict: 'oui' }, { texte: 'Selon l’agence', verdict: 'variable' }] },
    { critere: 'Le délai', valeurs: [{ texte: 'Selon le temps que vous y passez', verdict: 'variable' }, { texte: 'Un premier aperçu en 5 à 7 jours ouvrés', verdict: 'oui' }, { texte: 'Selon l’agence', verdict: 'variable' }] },
    { critere: 'Les modifications', valeurs: [{ texte: 'Dans l’outil de la plateforme', verdict: 'oui' }, { texte: 'Vous-même, sur votre site, sans abonnement', verdict: 'oui' }, { texte: 'Selon le contrat', verdict: 'variable' }] },
    { critere: 'Si vous partez', valeurs: [{ texte: 'Le site reste sur la plateforme', verdict: 'non' }, { texte: 'Vous gardez tout : site, code, nom de domaine', verdict: 'oui' }, { texte: 'Selon le contrat', verdict: 'variable' }] },
    { critere: 'Votre contact', valeurs: [{ texte: 'Un support en ligne', verdict: 'variable' }, { texte: 'Moi, à Amiens, réponse sous 24 h', verdict: 'oui' }, { texte: 'Un chef de projet', verdict: 'oui' }] },
  ] satisfies { critere: string; valeurs: { texte: string; verdict: Verdict }[] }[],
  note: 'Les pratiques varient d’une plateforme et d’une agence à l’autre : lisez toujours le contrat.',
};

/**
 * Tarifs, juste après le comparatif : les trois formules en cartes cliquables (vers la demande de devis, formule
 * pré-remplie), la page en plus, puis les moyens de paiement et le paiement en plusieurs fois.
 */
export const tarifs = {
  titre: 'Les tarifs',
  intro: 'Trois formules, un prix de départ clair. Le prix exact est dans votre devis, sous 24 h.',
  appel: 'Demander un devis ou une maquette',
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

