import { deroulementInformatique, informatiqueMentions } from './informatique';
import { pages } from './pages';

/** Textes du configurateur `/composer` (maquette `Configurateur`). */
export const onglets = {
  label: 'Catégorie de service',
  web: 'Sites & applis',
  informatique: 'Informatique sur place',
};

export const titres = {
  web: {
    title: pages.composer.heading,
    subtitle: "Chaque choix ajoute sa partie à l'aperçu et met le prix à jour.",
  },
  informatique: {
    title: 'Votre informatique, installée et réglée chez vous.',
    subtitle: "Installation, passage à Linux, dépannage, sauvegardes : je me déplace autour d'Amiens.",
  },
};

export const etapes = {
  type: '1. Quel type de site ?',
  metier: '2. Quelle est votre activité ?',
  optionsFonctionnel: '3. Que doit faire votre site ?',
  optionsVitrine: "3. Envie d'ajouter quelque chose ?",
  aideFonctionnel: 'Les fonctions proposées dépendent de votre activité. Cochez tout ce qui vous sert.',
  aideVitrine: 'Facultatif : cochez ce qui vous sert.',
  precisions: '4. Quelques précisions',
  suggestions: 'Vous pourriez aussi y penser',
};

export const estimationTextes = {
  title: 'Votre estimation',
  valeur: 'Valeur',
  offert: 'Offert',
  fourchette: 'Fourchette',
  delai: 'Délai indicatif',
  recommencer: 'Recommencer',
  footnote: 'Estimation indicative, devis précis après échange. Prix nets, TVA non applicable.',
  devis: { label: 'Recevoir mon devis détaillé', to: pages.devis.path },
  rdv: { label: 'En parler en rendez-vous', to: pages.rendezVous.path },
  finirAvantDevis: 'Choisissez votre activité pour recevoir votre devis détaillé.',
};

export const marcheTextes = {
  title: 'Comparé au marché',
  marche: 'Marché',
  monPrix: 'Mon prix',
  source: (description: string, source: string) => `Prix constatés pour un ${description}. Source : ${source}.`,
};

/** Encadré de droite de l'onglet informatique (à la place de l'aperçu). */
export const bonASavoir = {
  label: 'Bon à savoir',
  eyebrow: 'Le bon à savoir',
  title: 'Votre PC ne passe pas à Windows 11 ? Ne le jetez pas.',
  text: "Windows 10 n'est plus mis à jour depuis octobre 2025. Avec Linux, un ordinateur de plusieurs années redevient rapide et sûr, et vos fichiers vous suivent.",
  etapesTitre: 'Comment ça se passe',
  etapes: deroulementInformatique,
};

export const informatiqueTextes = {
  public: '1. Pour qui ?',
  besoins: '2. De quoi avez-vous besoin ?',
  aide: `Cochez tout ce qui vous concerne. ${informatiqueMentions.zone}`,
  resume: 'Votre demande',
  publicParDefaut: 'particulier ou professionnel',
  aucun: 'Choisissez une ou plusieurs prestations.',
  tarif: informatiqueMentions.tarif,
  tarifTexte: 'Je vous donne un prix clair après un premier échange, avant toute intervention.',
  rdv: { label: 'Prendre rendez-vous (gratuit)', to: pages.rendezVous.path },
  devis: { label: 'Décrire mon besoin', to: pages.devis.path },
};
