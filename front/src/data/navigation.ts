import { lienFaq } from './faq';
import { pages } from './pages';

/** Lien de navigation : `to` pour une page du site, `href` pour un site externe. */
export type NavLink = { label: string } & ({ to: string; href?: undefined } | { href: string; to?: undefined });

/** Réseau social de l'entreprise (pied de page, données structurées « sameAs », llms.txt). */
export type Reseau = { nom: 'Instagram' | 'Facebook'; compte: string; url: string };

export const contact: {
  email: string;
  phone: string;
  portfolio: string;
  adresse: { rue: string; codePostal: string; ville: string };
  reseaux: Reseau[];
} = {
  email: 'contact@bsandoz.fr',
  /** Rien n'est affiché si le numéro est vide. */
  phone: '07 69 28 78 37',
  adresse: { rue: '319 rue de Rouen', codePostal: '80000', ville: 'Amiens' },
  portfolio: 'https://portfolio.bsandoz.fr',
  /** Comptes créés par Baptiste (Instagram le 23/11/2026). Facebook : à ajouter quand la Page existe. */
  reseaux: [{ nom: 'Instagram', compte: '@bsandoz_', url: 'https://www.instagram.com/bsandoz_/' }],
};

/** Onglets des deux catégories de services (cahier des charges, section 2). */
/** Tous les appels à l'action mènent au formulaire de demande de devis. */
export const lienDevis = pages.devis.path;

/** Pages métier, listées dans le pied de page. */
export const metierLinks: NavLink[] = [
  { label: 'Bâtiment', to: pages.batiment.path },
  { label: 'Services à domicile', to: pages.artisan.path },
  { label: 'Beauté', to: pages.beaute.path },
  { label: 'Santé et bien-être', to: pages.independant.path },
  { label: 'Restaurant', to: pages.restaurant.path },
  { label: 'Commerce', to: pages.ecommerce.path },
  { label: 'Professions libérales', to: pages.liberal.path },
  { label: 'Cours et coaching', to: pages.cours.path },
  { label: 'Gîtes', to: pages.hebergement.path },
  { label: 'Associations', to: pages.association.path },
  { label: 'Événementiel', to: pages.evenementiel.path },
];

/** Bouton de thème de l'en-tête : libellé selon le thème vers lequel il bascule. */
export const themeTextes = {
  vers: { clair: 'Passer en thème clair', nuit: 'Passer en thème nuit' },
};

export const header = {
  name: 'Baptiste Sandoz',
  navLabel: 'Navigation principale',
  openMenu: 'Ouvrir le menu',
  closeMenu: 'Fermer le menu',
  /** Toujours visible dans la barre : icône, et texte sur grand écran. */
  espaceClient: { label: 'Espace client', to: pages.monEspace.path },
  /** Le seul bouton reste « Demander un devis ». */
  links: [
    { label: 'Réalisations', to: pages.realisations.path },
    { label: 'À propos', to: pages.aPropos.path },
    { label: 'Questions fréquentes', to: lienFaq },
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
    { label: 'Réalisations', to: pages.realisations.path },
    { label: 'Dépannage informatique à domicile', to: pages.informatique.path },
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
  hiddenOn: [pages.devis.path, pages.rendezVous.path] as string[],
  /** Débuts d'adresse où la barre est masquée : l'espace client. */
  hiddenUnder: [pages.monEspace.path] as string[],
};
