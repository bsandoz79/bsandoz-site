import { pages } from './pages';

/**
 * Fenêtre « Avant de partir » : elle s'ouvre une seule fois, après 30 secondes sur le site,
 * pour proposer une maquette gratuite ou un appel. Textes et réglages ici.
 */
export const relance = {
  /** Temps passé sur le site avant l'ouverture, en millisecondes (cumulé d'une page à l'autre). */
  delaiMs: 30_000,
  /** Après une ouverture, on ne la remontre pas avant ce nombre de jours. */
  silenceJours: 30,
  label: 'Avant de partir',
  surtitre: 'Avant de partir',
  titre: 'Donnez vie à votre idée',
  texte: 'Je vous prépare une maquette gratuite de votre page d’accueil, sous 72 h et sans engagement. Ou parlons-en de vive voix.',
  maquette: { label: 'Recevoir ma maquette gratuite', to: `${pages.devis.path}?demande=maquette` },
  appeler: 'Appeler le',
  fermer: 'Fermer',
  /** Pages où elle ne s'ouvre jamais : on y demande déjà un devis, ou on est dans un espace privé ou un texte légal. */
  masqueeSur: [pages.devis.path, pages.rendezVous.path, pages.mentionsLegales.path, pages.cgv.path, pages.confidentialite.path] as string[],
  masqueeSous: [pages.monEspace.path, pages.admin.path] as string[],
};

/** La fenêtre peut-elle s'ouvrir sur cette page ? */
export function relanceAutorisee(pathname: string) {
  return !relance.masqueeSur.includes(pathname) && !relance.masqueeSous.some((debut) => pathname.startsWith(debut));
}
