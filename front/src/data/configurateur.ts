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
    subtitle: 'Chaque choix met le prix à jour. Validez à la fin : votre estimation devient une demande de devis.',
  },
  informatique: {
    title: 'Votre informatique, installée et réglée chez vous.',
    subtitle: "Installation, passage à Linux, dépannage, sauvegardes : je me déplace autour d'Amiens.",
  },
};

/** Question posée à une nouvelle visite, quand une estimation précédente est enregistrée. */
export const reprise = {
  titre: 'Voulez-vous reprendre là où vous en étiez ?',
  texte: 'Votre dernière estimation :',
  oui: 'Oui, reprendre',
  non: 'Non, recommencer',
};

export const etapes = {
  type: '1. Quel type de site ?',
  metier: '2. Quel est votre métier ?',
  metierChamp: 'Votre métier',
  metierAide: 'Commencez à écrire : menuisier, coiffeur, avocat…',
  annonce: (n: number) => (n > 1 ? `${n} suggestions` : n === 1 ? '1 suggestion' : ''),
  optionsFonctionnel: '3. Que doit faire votre site ?',
  optionsVitrine: "3. Envie d'ajouter quelque chose ?",
  /** Options incluses dans la formule : combien il en reste à choisir. */
  inclus: (total: number, restantes: number) =>
    restantes > 0
      ? `${total > 1 ? `${total} options incluses` : '1 option incluse'} dans la formule, parmi les petites (pas les gros modules). Encore ${restantes} à choisir.`
      : 'Options incluses choisies. Les suivantes restent possibles, au prix indiqué.',
  inclusBadge: 'Inclus',
  precisions: '4. Quelques précisions',
  suggestions: 'Vous pourriez aussi y penser',
};

export const estimationTextes = {
  title: 'Votre estimation',
  valeur: 'Valeur',
  offert: 'Inclus',
  fourchette: 'Fourchette',
  delai: 'Délai indicatif',
  recommencer: 'Recommencer',
  footnote: 'Estimation indicative, devis précis après échange. Prix nets, TVA non applicable.',
  valider: 'Valider et recevoir mon devis',
  rdv: { label: 'En parler en rendez-vous', to: pages.rendezVous.path },
  finirAvantDevis: 'Indiquez votre métier pour valider votre estimation.',
  /** Formulaire affiché après « Valider ». */
  formulaire: {
    titre: 'Où vous envoyer votre devis ?',
    intro: 'Votre estimation est jointe à la demande. Je la confirme ou l’ajuste sous 24 h.',
  },
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
