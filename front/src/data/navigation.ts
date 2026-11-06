import { pages } from './pages';

/** Lien de navigation : `to` pour une page du site, `href` pour un site externe. */
export type NavLink = { label: string } & ({ to: string; href?: undefined } | { href: string; to?: undefined });

export const contact: { email: string; phone: string; portfolio: string } = {
  email: 'contact@bsandoz.fr',
  /** À compléter : rien n'est affiché tant que le numéro est vide. */
  phone: '',
  portfolio: 'https://portfolio.bsandoz.fr',
};

/** Onglets des deux catégories de services (cahier des charges, section 2). */
export const serviceTabs = [
  { label: 'Sites & applis', to: pages.accueil.path },
  { label: 'Informatique sur place', to: pages.informatique.path },
] as const;

/** Pages rattachées à l'onglet « Informatique sur place » : préfixe d'adresse. */
export const informatiquePrefix = pages.informatique.path;

/** Pages métier, regroupées sous « Métiers » dans le menu. */
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
  metiersLabel: 'Métiers',
  openMenu: 'Ouvrir le menu',
  closeMenu: 'Fermer le menu',
  links: [
    { label: 'Réalisations', to: pages.realisations.path },
    { label: 'Tarifs', to: pages.tarifs.path },
    { label: 'À propos', to: pages.aPropos.path },
    { label: 'Portfolio', href: contact.portfolio },
  ] satisfies NavLink[],
  cta: { label: 'Estimer mon projet', to: pages.composer.path },
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
    texte: 'Estimez-le en 2 minutes, ou parlons-en de vive voix.',
    estimer: { label: 'Estimer mon projet', to: pages.composer.path },
    rendezVous: { label: 'Rendez-vous gratuit', to: pages.rendezVous.path },
  },
  siteLabel: 'Le site',
  site: [
    { label: 'Tarifs', to: pages.tarifs.path },
    { label: 'Réalisations', to: pages.realisations.path },
    { label: 'Informatique sur place', to: pages.informatique.path },
    { label: 'Questions fréquentes', to: pages.faq.path },
  ] satisfies NavLink[],
  droits: (annee: number) => `© ${annee} Baptiste Sandoz`,
  legal: [
    { label: 'Mentions légales', to: pages.mentionsLegales.path },
    { label: 'CGV', to: pages.cgv.path },
    { label: 'Confidentialité', to: pages.confidentialite.path },
  ] satisfies NavLink[],
};

/** Barre « Estimer » fixe en bas de l'écran sur mobile. */
export const mobileBar = {
  label: 'Estimation rapide',
  text: 'Devis gratuit en 2 min',
  cta: { label: 'Estimer', to: pages.composer.path },
  /** Pages où la barre est masquée : on y est déjà en train d'estimer ou de prendre rendez-vous. */
  hiddenOn: [pages.composer.path, pages.devis.path, pages.rendezVous.path] as string[],
  /** Débuts d'adresse où la barre est masquée : l'espace client. */
  hiddenUnder: [pages.monEspace.path] as string[],
};
