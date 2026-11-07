import { lienFaq } from './faq';
import { pages } from './pages';

/** Lien de navigation : `to` pour une page du site, `href` pour un site externe. */
export type NavLink = { label: string } & ({ to: string; href?: undefined } | { href: string; to?: undefined });

export const contact: { email: string; phone: string; portfolio: string; adresse: { rue: string; codePostal: string; ville: string } } = {
  email: 'contact@bsandoz.fr',
  /** Rien n'est affiché si le numéro est vide. */
  phone: '07 69 28 78 37',
  adresse: { rue: '319 rue de Rouen', codePostal: '80000', ville: 'Amiens' },
  portfolio: 'https://portfolio.bsandoz.fr',
};

/** Onglets des deux catégories de services (cahier des charges, section 2). */
export const serviceTabs = [
  { label: 'Sites & applis', to: pages.accueil.path },
  { label: 'Informatique sur place', to: pages.informatique.path },
] as const;

/** Pages rattachées à l'onglet « Informatique sur place » : préfixe d'adresse. */
export const informatiquePrefix = pages.informatique.path;

/** Tous les appels à l'action mènent au formulaire de demande de devis. */
export const lienDevis = pages.devis.path;

/** L'estimation en ligne, proposée en second plan (page Devis, Tarifs). */
export const lienEstimation = `${pages.composer.path}?onglet=web`;

/** Pages métier, listées dans le pied de page. */
export const metierLinks: NavLink[] = [
  { label: 'Artisan', to: pages.artisan.path },
  { label: 'Commerce', to: pages.ecommerce.path },
  { label: 'Restaurant', to: pages.restaurant.path },
  { label: 'Santé et bien-être', to: pages.independant.path },
];

/** Bouton de thème de l'en-tête : libellé selon le thème vers lequel il bascule. */
export const themeTextes = {
  vers: { clair: 'Passer en thème clair', nuit: 'Passer en thème nuit' },
};

export const header = {
  name: 'Baptiste Sandoz',
  navLabel: 'Navigation principale',
  tabsLabel: 'Catégories de services',
  openMenu: 'Ouvrir le menu',
  closeMenu: 'Fermer le menu',
  /** Toujours visible dans la barre : icône, et texte sur grand écran. */
  espaceClient: { label: 'Espace client', to: pages.monEspace.path },
  /** « Estimer » : un simple lien, le seul bouton reste « Demander un devis ». */
  links: [
    { label: 'Réalisations', to: pages.realisations.path },
    { label: 'Tarifs', to: pages.tarifs.path },
    { label: 'Estimer', to: lienEstimation },
    { label: 'À propos', to: pages.aPropos.path },
  ] satisfies NavLink[],
  cta: { label: 'Demander un devis', to: lienDevis },
};

export const skipLink = { label: 'Aller au contenu', target: 'contenu' };

export const footer = {
  name: 'Baptiste Sandoz',
  tagline: 'Création de sites web & développement',
  zone: 'Amiens · Somme · à distance partout en France',
  contactLabel: 'Contact',
  legalLabel: 'Informations légales',
  portfolioLabel: 'Mon portfolio',
  espaceClient: { label: 'Espace client', to: pages.monEspace.path },
  /** Bande d'appel à l'action en haut du pied de page. */
  appel: {
    titre: 'Un projet en tête ?',
    texte: 'Décrivez-le en quelques lignes, ou parlons-en de vive voix.',
    devis: { label: 'Demander un devis', to: lienDevis },
    rendezVous: { label: 'Rendez-vous gratuit', to: pages.rendezVous.path },
  },
  siteLabel: 'Le site',
  /** Pages métier : dans le pied de page (utiles pour Google), plus dans la barre. */
  metiersLabel: 'Sites par métier',
  site: [
    { label: 'Tarifs', to: pages.tarifs.path },
    { label: 'Réalisations', to: pages.realisations.path },
    { label: 'Informatique sur place', to: pages.informatique.path },
    { label: 'Questions fréquentes', to: lienFaq },
  ] satisfies NavLink[],
  droits: (annee: number) => `© ${annee} Baptiste Sandoz`,
  legal: [
    { label: 'Mentions légales', to: pages.mentionsLegales.path },
    { label: 'CGV', to: pages.cgv.path },
    { label: 'Confidentialité', to: pages.confidentialite.path },
  ] satisfies NavLink[],
};

/** Barre « Demander un devis » fixe en bas de l'écran sur mobile. */
/** Bouton « revenir en haut », en bas à droite, une fois la page un peu descendue. */
export const retourHaut = {
  label: 'Revenir en haut de la page',
  /** Défilement (en pixels) à partir duquel le bouton apparaît. */
  seuil: 600,
};

export const mobileBar = {
  label: 'Demande de devis',
  text: 'Devis gratuit, réponse sous 24 h',
  cta: { label: 'Demander', to: lienDevis },
  /** Pages où la barre est masquée : on y est déjà en train de demander un devis ou de prendre rendez-vous. */
  hiddenOn: [pages.devis.path, pages.composer.path, pages.rendezVous.path] as string[],
  /** Débuts d'adresse où la barre est masquée : l'espace client. */
  hiddenUnder: [pages.monEspace.path] as string[],
};
