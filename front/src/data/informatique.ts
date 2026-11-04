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
  zone: "Je me déplace dans un rayon de 50 km autour d'Amiens.",
};
