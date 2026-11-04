/** Informations générales du site. */
export const site = {
  name: 'Baptiste Sandoz',
  defaultTitle: 'Baptiste Sandoz – Création de sites web à Amiens',
} as const;

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
    title: 'Création de sites web à Amiens',
    description:
      "Sites internet, prise de rendez-vous en ligne et applis pour artisans, commerçants et indépendants autour d'Amiens.",
    heading: 'Un site qui travaille pour vous, même quand vous êtes sur le terrain.',
  },
  tarifs: {
    path: '/tarifs',
    title: 'Tarifs',
    description:
      'Trois formules aux prix affichés : vitrine, vitrine+ et site fonctionnel. Simulez le prix de votre site.',
    heading: 'Des prix clairs, selon ce dont vous avez vraiment besoin.',
  },
  composer: {
    path: '/composer',
    title: 'Composer mon site',
    description: 'Composez votre site option par option et voyez le résultat et le prix en direct.',
    heading: 'Composer mon site',
  },
  realisations: {
    path: '/realisations',
    title: 'Réalisations',
    description: 'Des réalisations concrètes : le besoin, la solution, des captures et des démos à tester.',
    heading: 'Réalisations',
  },
  artisan: {
    path: '/site-artisan',
    title: 'Site internet pour artisan',
    description: 'Un site pour artisan à domicile, avec prise de rendez-vous en ligne, autour d’Amiens.',
    heading: 'Vos clients réservent pendant que vous travaillez.',
  },
  ecommerce: {
    path: '/site-ecommerce',
    title: 'Site internet pour commerce',
    description: 'Un site pour votre commerce : vente en ligne, click & collect et visibilité sur Google.',
    heading: 'Vendez aussi en ligne, et soyez trouvé sur Google.',
  },
  restaurant: {
    path: '/site-restaurant',
    title: 'Site internet pour restaurant',
    description: 'Un site pour votre restaurant : carte, horaires et réservations de table toujours à jour.',
    heading: 'Votre carte, vos horaires et vos réservations, toujours à jour.',
  },
  independant: {
    path: '/site-independant',
    title: 'Site internet pour indépendant',
    description:
      'Un site pour les professionnels de la santé et du bien-être : rendez-vous en ligne et moins de téléphone.',
    heading: 'Moins de temps au téléphone, plus avec vos clients.',
  },
  informatique: {
    path: '/informatique',
    title: 'Informatique sur place',
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
    description: 'Décrivez votre projet en quelques étapes et recevez une première estimation par mail.',
    heading: 'Demande de devis',
  },
  rendezVous: {
    path: '/rendez-vous',
    title: 'Rendez-vous découverte',
    description: 'Un rendez-vous découverte gratuit d’une heure : chez vous autour d’Amiens, en visio ou par téléphone.',
    heading: 'Rendez-vous découverte gratuit',
  },
  faq: {
    path: '/faq',
    title: 'Questions fréquentes',
    description: 'Délais, contenus à fournir, propriété du site, hébergement, modifications et paiement.',
    heading: 'Questions fréquentes',
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
