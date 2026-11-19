/** Informations générales du site. */
export const site = {
  name: 'Baptiste Sandoz',
  /** Adresse publique du site, sans barre finale. */
  url: 'https://bsandoz.fr',
  defaultTitle: 'Baptiste Sandoz – Création de sites web à Amiens',
} as const;

/**
 * Adresse du site d'où part une demande (preview.bsandoz.fr, bsandoz.fr…), pour les liens des mails :
 * ils mènent toujours à un site qui existe. Hors navigateur, l'adresse publique.
 * (Le plan du site et les adresses canoniques gardent l'adresse publique `site.url`.)
 */
export function origineDuSite(): string {
  const origine = typeof window === 'undefined' ? '' : window.location.origin;
  return /^https?:\/\//.test(origine) ? origine : site.url;
}

/** Métadonnées d'une page : utilisées pour la route, le titre, la description et le titre principal. */
export type PageInfo = {
  path: string;
  /** Titre de l'onglet, sans le nom du site. */
  title: string;
  /** Balise meta description. */
  description: string;
  /** Titre principal affiché (h1). */
  heading: string;
};

/** Pages publiques du site (cahier des charges, section 3). */
export const pages = {
  accueil: {
    path: '/',
    title: 'Création de site internet à Amiens · Développeur web',
    description:
      'Développeur web à Amiens : création de sites internet sur mesure, prise de rendez-vous en ligne et applis pour artisans, commerçants et indépendants de la Somme.',
    heading: 'Un site à vous, que vous modifiez vous-même.',
  },
  realisations: {
    path: '/realisations',
    title: 'Réalisations',
    description: 'Des réalisations concrètes : le besoin, la solution, des captures et des démos à tester.',
    heading: 'Réalisations',
  },
  artisan: {
    path: '/site-artisan',
    title: 'Site internet pour service à domicile à Amiens',
    description: 'Un site pour les services à domicile (detailing, ménage, réparation, jardinage) : rendez-vous et acompte en ligne, autour d’Amiens.',
    heading: 'Vos clients réservent pendant que vous travaillez.',
  },
  ecommerce: {
    path: '/site-ecommerce',
    title: 'Site internet pour commerce à Amiens',
    description: 'Un site pour votre commerce : vente en ligne, click & collect et visibilité sur Google.',
    heading: 'Vendez aussi en ligne, et soyez trouvé sur Google.',
  },
  restaurant: {
    path: '/site-restaurant',
    title: 'Site internet pour restaurant, kebab ou snack à Amiens',
    description: 'Un site pour votre restaurant, kebab ou snack : la carte modifiable depuis votre téléphone, un QR code, les horaires et le bouton Appeler.',
    heading: 'Votre carte toujours à jour, modifiée depuis votre téléphone.',
  },
  independant: {
    path: '/site-independant',
    title: 'Site internet pour indépendant à Amiens',
    description:
      'Un site pour les professionnels de la santé et du bien-être : présentation rassurante, rendez-vous en ligne ou votre Doctolib, moins de téléphone.',
    heading: 'Moins de temps au téléphone, plus avec vos clients.',
  },
  batiment: {
    path: '/site-batiment',
    title: 'Site internet pour artisan du bâtiment à Amiens',
    description: 'Plombier, électricien, couvreur, menuisier : un site qui fait appeler, reçoit les demandes de devis et montre vos chantiers.',
    heading: 'Les demandes de devis arrivent, même quand vous êtes sur un chantier.',
  },
  beaute: {
    path: '/site-beaute',
    title: 'Site internet pour coiffeur et esthéticienne à Amiens',
    description: 'Coiffure, esthétique, ongles : réservation en ligne, prestations et prix, rappel la veille.',
    heading: 'Vos clientes réservent en ligne, même pendant vos rendez-vous.',
  },
  liberal: {
    path: '/site-profession-liberale',
    title: 'Site internet pour avocat, expert-comptable ou notaire à Amiens',
    description: 'Un site sobre et sérieux pour votre cabinet : domaines d’intervention, contact, rendez-vous, mentions de votre profession.',
    heading: 'Un site sobre et sérieux, à l’image de votre cabinet.',
  },
  cours: {
    path: '/site-cours-coaching',
    title: 'Site internet pour coach, professeur ou auto-école à Amiens',
    description: 'Coach sportif, professeur, auto-école : planning, réservation des séances, paiement en ligne et espace élève.',
    heading: 'Vos élèves réservent leurs séances, sans vous appeler.',
  },
  hebergement: {
    path: '/site-gite',
    title: 'Site internet pour gîte et chambres d’hôtes près d’Amiens',
    description: 'Gîte, chambres d’hôtes, location : réservation en direct sans commission, photos, version anglaise.',
    heading: 'Vos voyageurs réservent en direct, sans commission.',
  },
  association: {
    path: '/site-association',
    title: 'Site internet pour association et club à Amiens',
    description: 'Associations et clubs : actualités, événements, adhésions en ligne, espace adhérents. Tarif adapté.',
    heading: 'Vos actualités, vos événements et vos adhésions au même endroit.',
  },
  evenementiel: {
    path: '/site-evenementiel',
    title: 'Site internet pour photographe, DJ ou traiteur à Amiens',
    description: 'Photographe, DJ, traiteur, organisateur de mariages : portfolio, formules, demande de date et de devis.',
    heading: 'Vos futurs clients voient votre travail et demandent leur date.',
  },
  informatique: {
    path: '/informatique',
    title: 'Dépannage et informatique à domicile à Amiens',
    description:
      'Installation, passage à Linux, dépannage, sauvegarde et formation à domicile, autour d’Amiens.',
    heading: 'Votre PC ne passe pas à Windows 11 ? Ne le jetez pas.',
  },
  aPropos: {
    path: '/a-propos',
    title: 'À propos',
    description: 'Qui je suis, mon parcours, mes valeurs et ma zone d’intervention autour d’Amiens.',
    heading: 'À propos',
  },
  devis: {
    path: '/devis',
    title: 'Demande de devis',
    description: 'Décrivez votre projet en quelques lignes : je vous réponds sous 24 h avec une proposition.',
    heading: 'Demande de devis',
  },
  rendezVous: {
    path: '/rendez-vous',
    title: 'Rendez-vous découverte',
    description: 'Un rendez-vous découverte gratuit d’une heure : chez vous autour d’Amiens, en visio ou par téléphone.',
    heading: 'Comment préférez-vous me présenter votre projet ?',
  },
  mentionsLegales: {
    path: '/mentions-legales',
    title: 'Mentions légales',
    description: 'Mentions légales du site bsandoz.fr.',
    heading: 'Mentions légales',
  },
  cgv: {
    path: '/cgv',
    title: 'Conditions générales de vente',
    description: 'Conditions générales de vente de Baptiste Sandoz.',
    heading: 'Conditions générales de vente',
  },
  confidentialite: {
    path: '/confidentialite',
    title: 'Politique de confidentialité',
    description: 'Comment vos données personnelles sont collectées, utilisées et protégées.',
    heading: 'Politique de confidentialité',
  },
  monEspace: {
    path: '/mon-espace',
    title: 'Mon espace',
    description: 'Votre espace client : compte, sécurité et appareils connectés.',
    heading: 'Mon espace',
  },
  connexion: {
    path: '/mon-espace/connexion',
    title: 'Connexion',
    description: 'Connectez-vous à votre espace client, par mot de passe ou par un lien reçu par mail.',
    heading: 'Connexion à votre espace',
  },
  lienConnexion: {
    path: '/mon-espace/lien',
    title: 'Connexion par lien',
    description: 'Ouverture du lien reçu par mail.',
    heading: 'Connexion en cours',
  },
  motDePasse: {
    path: '/mon-espace/mot-de-passe',
    title: 'Mot de passe',
    description: 'Choisissez un nouveau mot de passe pour votre espace client.',
    heading: 'Choisir un mot de passe',
  },
  confirmerEmail: {
    path: '/mon-espace/email',
    title: 'Nouvelle adresse e-mail',
    description: 'Confirmation de la nouvelle adresse e-mail de votre espace client.',
    heading: 'Nouvelle adresse e-mail',
  },
  admin: {
    path: '/admin',
    title: 'Back-office',
    description: 'Demandes, devis, prix et disponibilités.',
    heading: 'Back-office',
  },
  suppression: {
    path: '/mon-espace/suppression',
    title: 'Supprimer mon compte',
    description: 'Confirmation de la suppression de votre espace client.',
    heading: 'Supprimer mon compte',
  },
} as const satisfies Record<string, PageInfo>;

export const notFoundPage = {
  path: '*',
  title: 'Page introuvable',
  description: 'Cette page n’existe pas ou a été déplacée.',
  heading: 'Page introuvable',
} as const satisfies PageInfo;

export const notFoundContent = {
  text: "La page que vous cherchez n'existe pas ou a été déplacée.",
  backLabel: "Retour à l'accueil",
};

export const placeholderContent = {
  text: 'Cette page est en cours de construction.',
};
