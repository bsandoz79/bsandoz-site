import type { MoyenPaiement } from '@bsandoz79/blocs';

/**
 * Moyens de paiement réellement acceptés (choisis par Baptiste le 20/11/2026, revus le 24/11/2026) : carte bancaire par
 * Stripe (une seule pastille « Carte bancaire » plutôt que Visa, Mastercard, American Express), Apple Pay et Google Pay
 * (proposés par la page de paiement Stripe), Klarna (paiement en 3 ou 4 fois, activé dans Stripe), virement bancaire.
 * Repris sous les tarifs de l'accueil, dans le pied de page, la FAQ et les conditions de vente.
 */
export const paiement = {
  moyens: ['cb', 'applepay', 'googlepay', 'klarna', 'virement'] as MoyenPaiement[],
  /** Site officiel de chaque moyen, ouvert au clic sur sa pastille (pour savoir ce que c'est). */
  liens: {
    cb: 'https://www.cartes-bancaires.com/',
    applepay: 'https://www.apple.com/fr/apple-pay/',
    googlepay: 'https://pay.google.com/intl/fr_fr/about/',
    klarna: 'https://www.klarna.com/fr/',
    virement: 'https://www.banque-france.fr/fr/a-votre-service/particuliers/mieux-connaitre-moyens-paiement/virement-sepa',
  } satisfies Partial<Record<MoyenPaiement, string>>,
  label: 'Moyens de paiement acceptés',
  /** Mis en avant sous les tarifs. */
  plusieursFois: 'Payable en 3 ou 4 fois sans frais',
  /** Phrase courte, sous les pastilles et dans la FAQ. */
  phrase: 'Carte bancaire, Apple Pay ou Google Pay par Stripe (paiement chiffré), Klarna, ou virement bancaire.',
  /** Pour les conditions de vente. */
  conditions:
    'Moyens de paiement : carte bancaire, Apple Pay et Google Pay, par la plateforme de paiement sécurisé Stripe, Klarna (paiement en plusieurs fois), ou virement bancaire.',
};
