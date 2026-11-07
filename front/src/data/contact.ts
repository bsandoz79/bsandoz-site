import { pages } from './pages';

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
  activite: 'Votre métier ou activité',
  activiteAide: 'Commencez à écrire : menuisier, avocat, photographe…',
  projet: 'Votre projet',
  projetAide: 'Ce que vous attendez du site, ce qui vous ferait gagner du temps, un site que vous aimez…',
  suggestions: (n: number) => (n > 1 ? `${n} suggestions` : n === 1 ? '1 suggestion' : ''),
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
    activite: 'Indiquez votre métier ou votre activité.',
    projet: 'Décrivez votre projet en quelques mots.',
    consentement: 'Cochez la case pour que je puisse vous répondre.',
  },
};
