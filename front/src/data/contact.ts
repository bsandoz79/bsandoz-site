import { pages } from './pages';

/** Besoins proposés dans le formulaire de contact rapide. */
export const besoinsContact = [
  { value: 'vitrine', label: 'Un site vitrine' },
  { value: 'fonctionnel', label: 'Un site avec rendez-vous, devis ou boutique' },
  { value: 'refonte', label: 'Refaire ou améliorer mon site' },
  { value: 'informatique', label: 'Informatique sur place' },
  { value: 'autre', label: 'Autre chose' },
] as const;

export type BesoinContact = (typeof besoinsContact)[number]['value'];

/** Formulaire de contact rapide (bas de l'accueil) : une alternative courte au devis en 5 étapes. */
export const contactRapide = {
  titre: 'Parlez-moi de votre projet.',
  intro: 'Quelques lignes suffisent : je vous réponds sous 24 h, avec une première idée du prix.',
  nom: 'Prénom et nom',
  telephone: 'Téléphone',
  email: 'E-mail',
  besoin: 'Votre besoin',
  choisir: 'Sélectionnez votre besoin',
  projet: 'Votre projet',
  projetAide: 'Votre activité, ce que vous attendez du site, un site que vous aimez…',
  consentement:
    "J'accepte que mes informations soient utilisées pour répondre à ma demande. Elles ne sont ni revendues ni utilisées à d'autres fins.",
  confidentialite: { label: 'Politique de confidentialité', to: pages.confidentialite.path },
  envoyer: 'Envoyer',
  envoi: 'Envoi…',
  envoye: {
    titre: 'Merci, c’est bien reçu !',
    texte: 'Vous allez recevoir un e-mail de confirmation. Je vous réponds sous 24 h.',
  },
  echec: 'L’envoi n’a pas abouti. Réessayez dans un instant, ou écrivez-moi directement par e-mail.',
  tropRapide: 'Merci de patienter une minute avant un nouvel envoi.',
  /** Colonne de droite. */
  aCote: {
    ecrire: 'Écrivez-moi',
    rendezVous: { label: 'Prendre un rendez-vous gratuit', to: pages.rendezVous.path },
    devis: { label: 'Ou décrivez votre projet en détail', to: pages.devis.path },
    promesses: ['Réponse sous 24 h', 'Un seul interlocuteur, du devis à la mise en ligne', 'Prix affichés, sans surprise'],
  },
  erreurs: {
    nom: 'Indiquez votre nom.',
    telephone: 'Numéro de téléphone invalide.',
    email: 'Adresse e-mail invalide.',
    besoin: 'Choisissez votre besoin.',
    consentement: 'Cochez la case pour que je puisse vous répondre.',
  },
};
