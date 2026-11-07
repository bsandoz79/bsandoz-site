import { pages } from './pages';

/** Activités proposées dans le formulaire de contact : « Autre » ouvre un champ pour la préciser. */
export const activitesContact = [
  { value: 'artisan', label: 'Artisan, bâtiment' },
  { value: 'commerce', label: 'Commerce' },
  { value: 'restauration', label: 'Restauration' },
  { value: 'sante', label: 'Santé, bien-être' },
  { value: 'liberal', label: 'Profession libérale' },
  { value: 'particulier', label: 'Particulier' },
  { value: 'autre', label: 'Autre' },
] as const;

export type ActiviteContact = (typeof activitesContact)[number]['value'];

/**
 * Formulaire de contact : le seul du site. Bas de l'accueil et page « Demande de devis ».
 * Court : coordonnées, activité, quelques lignes sur le projet. Baptiste répond avec une proposition.
 */
export const contactRapide = {
  titre: 'Parlez-moi de votre projet.',
  intro: 'Quelques lignes suffisent. Je vous réponds sous 24 h avec une proposition.',
  nom: 'Prénom et nom',
  entreprise: 'Entreprise (facultatif)',
  telephone: 'Téléphone',
  email: 'E-mail',
  activite: 'Votre domaine d’activité',
  activiteAutre: 'Précisez votre activité',
  activiteAutreAide: 'Ex. : avocat, couvreur, photographe…',
  projet: 'Votre projet',
  projetAide: 'Ce que vous attendez du site, ce qui vous ferait gagner du temps, un site que vous aimez…',
  consentement:
    "J'accepte que mes informations soient utilisées pour répondre à ma demande. Elles ne sont ni revendues ni utilisées à d'autres fins.",
  confidentialite: { label: 'Politique de confidentialité', to: pages.confidentialite.path },
  envoyer: 'Envoyer ma demande',
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
    promesses: ['Réponse sous 24 h', 'Un seul interlocuteur, du devis à la mise en ligne', 'Sans engagement'],
  },
  erreurs: {
    nom: 'Indiquez votre nom.',
    telephone: 'Numéro de téléphone invalide.',
    email: 'Adresse e-mail invalide.',
    activite: 'Choisissez votre domaine d’activité.',
    activiteAutre: 'Précisez votre activité en quelques mots.',
    projet: 'Décrivez votre projet en quelques mots.',
    consentement: 'Cochez la case pour que je puisse vous répondre.',
  },
};
