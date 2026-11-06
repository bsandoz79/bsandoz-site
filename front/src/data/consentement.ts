import { pages } from './pages';

/** Textes du bandeau des services tiers (en bas de l'écran, il ne bloque pas la page). */
export const bandeau = {
  label: 'Services tiers',
  texte:
    'Ni cookie publicitaire, ni mesure d’audience. Seule la carte vient d’un autre site (OpenStreetMap), qui reçoit votre adresse IP.',
  enSavoirPlus: { label: 'En savoir plus', to: pages.confidentialite.path },
  accepter: 'Accepter',
  refuser: 'Refuser',
  fermer: 'Fermer, je choisirai plus tard',
  /** Lien du pied de page pour rouvrir le bandeau. */
  gerer: 'Services tiers',
};
