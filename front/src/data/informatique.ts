/** Informatique sur place (cahier des charges, section 2). Pas de prix : « Tarif sur devis ». */
export type ServiceInformatiqueId =
  | 'installation'
  | 'linux'
  | 'peripheriques'
  | 'depannage'
  | 'renovation'
  | 'sauvegarde'
  | 'formation'
  | 'reseau';

export type ServiceInformatique = {
  id: ServiceInformatiqueId;
  nom: string;
  description: string;
  /** Affiché, mais pas encore proposé. */
  bientot?: boolean;
};

export const servicesInformatique: ServiceInformatique[] = [
  {
    id: 'installation',
    nom: "Installation d'un ordinateur",
    description: 'Mise en service, comptes, logiciels, transfert de vos fichiers.',
  },
  {
    id: 'linux',
    nom: 'Passage de Windows à Linux',
    description: 'Sauvegarde, installation et prise en main. Idéal si votre PC ne passe pas à Windows 11.',
  },
  {
    id: 'peripheriques',
    nom: 'Imprimante, box, wifi',
    description: 'Installation et réglages pour que tout fonctionne ensemble.',
  },
  {
    id: 'depannage',
    nom: 'Dépannage et nettoyage',
    description: "PC lent, virus, fenêtres qui s'ouvrent toutes seules, démarrage difficile.",
  },
  {
    id: 'renovation',
    nom: "Seconde vie d'un vieil ordinateur",
    description: 'Remise à neuf, disque SSD, système léger.',
  },
  { id: 'sauvegarde', nom: 'Sauvegarde de vos données', description: 'Photos et documents en sécurité, automatiquement.' },
  {
    id: 'formation',
    nom: 'Formation à domicile',
    description: 'Prendre en main son ordinateur, sa messagerie, ses outils.',
  },
  { id: 'reseau', nom: 'Réseau et NAS', description: 'Câblage, réseau pro, stockage partagé.', bientot: true },
];

export type PublicInformatique = 'particulier' | 'professionnel';

export const publicsInformatique: { id: PublicInformatique; nom: string }[] = [
  { id: 'particulier', nom: 'Particulier' },
  { id: 'professionnel', nom: 'Professionnel' },
];

export const informatiqueMentions = {
  bientot: 'Bientôt disponible',
  tarif: 'Tarif sur devis',
  zone: "Je me déplace sans frais dans un rayon de 50 km autour d'Amiens et d'Abbeville ; plus loin, seuls les kilomètres en plus sont facturés.",
};

/** Déroulement d'une intervention (page Informatique et configurateur). */
export const deroulementInformatique = [
  { titre: 'On en parle', texte: 'rendez-vous gratuit ou description en ligne.' },
  { titre: 'Devis clair', texte: 'avant toute intervention.' },
  { titre: 'Je viens chez vous', texte: "j'installe, je vous montre, et vos données restent en sécurité." },
];

/** Textes de la page Informatique sur place. */
export const pageInformatique = {
  badge: "Informatique sur place · autour d'Amiens",
  intro:
    "Windows 10 n'est plus mis à jour depuis octobre 2025. Avec Linux, un ordinateur de plusieurs années redevient rapide et sûr, et vos fichiers vous suivent. Je viens chez vous pour installer, régler, dépanner et vous montrer.",
  composer: { label: 'Décrire mon besoin', to: '/composer?onglet=informatique' },
  rdv: { label: 'Prendre rendez-vous (gratuit)', to: '/rendez-vous' },
  reassurance: ['Particuliers et professionnels', "50 km autour d'Amiens et d'Abbeville", 'Prix annoncé avant toute intervention'],
  services: { eyebrow: 'Prestations', title: 'Ce que je fais chez vous' },
  deroulement: { eyebrow: 'Comment ça se passe', title: 'Trois étapes, sans surprise.' },
  tarif: {
    title: informatiqueMentions.tarif,
    text: 'Chaque situation est différente : je vous donne un prix clair après un premier échange, avant toute intervention.',
  },
};
