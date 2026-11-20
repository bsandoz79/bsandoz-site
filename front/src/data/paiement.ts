import type { MoyenPaiement } from '@bsandoz79/blocs';

/**
 * Moyens de paiement réellement acceptés (choisis par Baptiste le 20/11/2026) : carte par Stripe (Visa, Mastercard,
 * American Express), Apple Pay et Google Pay (proposés par la page de paiement Stripe), virement bancaire.
 * Repris dans l'accueil (sous le prix), le pied de page, la FAQ et les conditions de vente.
 */
export const paiement = {
  moyens: ['visa', 'mastercard', 'amex', 'applepay', 'googlepay', 'virement'] as MoyenPaiement[],
  label: 'Moyens de paiement acceptés',
  /** Phrase courte, sous les pastilles et dans la FAQ. */
  phrase: 'Carte bancaire, Apple Pay ou Google Pay par Stripe (paiement chiffré), ou virement bancaire.',
  /** Pour les conditions de vente. */
  conditions:
    'Moyens de paiement : carte bancaire (Visa, Mastercard, American Express), Apple Pay et Google Pay, par la plateforme de paiement sécurisé Stripe, ou virement bancaire.',
};
