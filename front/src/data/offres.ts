/** Formules de site (cahier des charges, section 4). Prix nets, TVA non applicable. */
export type FormuleId = 'vitrine' | 'vitrinePlus' | 'fonctionnel';

export type Formule = {
  id: FormuleId;
  nom: string;
  accroche: string;
  /** Prix en euros. */
  prix: number;
  /** Vrai si le prix est un point de départ (« à partir de … ») : les options s'y ajoutent. */
  prixMinimum: boolean;
  delai: string;
  /** Points forts affichés sur les cartes d'offre. */
  pointsForts: string[];
  /** Description courte, pour le configurateur. */
  description: string;
};

export const formules: Formule[] = [
  {
    id: 'vitrine',
    nom: 'Vitrine',
    accroche: 'Être visible, vite.',
    prix: 99,
    prixMinimum: true,
    delai: '3 jours',
    description: '1 page pour être visible vite.',
    pointsForts: [
      '1 page sur un modèle soigné',
      'Mise en ligne et HTTPS',
      '1 série de retouches',
      "1 h de formation si vous gérez l'hébergement",
    ],
  },
  {
    id: 'vitrinePlus',
    nom: 'Vitrine+',
    accroche: 'Une vitrine qui ramène des contacts.',
    prix: 390,
    prixMinimum: true,
    delai: '1 à 2 semaines',
    description: "Jusqu'à 5 pages, formulaire, référencement local.",
    pointsForts: [
      "Jusqu'à 5 pages, design personnalisé",
      'Formulaire de contact, galerie',
      'Référencement local + fiche Google',
      '2 séries de retouches',
    ],
  },
  {
    id: 'fonctionnel',
    nom: 'Fonctionnel',
    accroche: 'Un outil qui travaille pour vous.',
    prix: 989,
    prixMinimum: true,
    delai: '3 à 6 semaines',
    description: 'Rendez-vous, devis, boutique, appli : un outil qui travaille.',
    pointsForts: [
      'Rendez-vous en ligne et acompte',
      'Appli installable sur téléphone',
      'Calculateur ou générateur de devis',
      'Boutique, espace client, sur mesure',
    ],
  },
];

/** Retrouve une formule par son identifiant. */
export function formuleParId(id: FormuleId) {
  return formules.find((formule) => formule.id === id) as Formule;
}

/** Activités proposées dans le configurateur. */
export type MetierId = 'artisan' | 'commerce' | 'restaurant' | 'sante' | 'autre';

export const metiers: { id: MetierId; nom: string }[] = [
  { id: 'artisan', nom: 'Artisan à domicile' },
  { id: 'commerce', nom: 'Commerce / e-commerce' },
  { id: 'restaurant', nom: 'Restaurant / bar' },
  { id: 'sante', nom: 'Santé / bien-être' },
  { id: 'autre', nom: 'Autre activité' },
];

/** Champ affiché quand on choisit « Autre activité ». */
export const metierAutreTextes = {
  label: 'Précisez votre activité',
  placeholder: 'Ex. : toiletteur canin, photographe…',
  /** Longueur maximale gardée. */
  max: 80,
};

/** Nom de l'activité à afficher : le métier écrit, sinon le nom de sa catégorie. */
export function nomActivite(metier: MetierId | null, metierAutre = ''): string {
  if (metierAutre.trim()) return metierAutre.trim();
  return metiers.find((m) => m.id === metier)?.nom ?? '';
}

/** Options (cahier des charges, section 4). */
export type OptionId =
  | 'page'
  | 'galerie'
  | 'textes'
  | 'logo'
  | 'avantapres'
  | 'avis'
  | 'seo'
  | 'anglais'
  | 'rdv'
  | 'acompte'
  | 'calcul'
  | 'pwa'
  | 'espace'
  | 'boutique'
  | 'table'
  | 'clickcollect';

export type Option = {
  id: OptionId;
  nom: string;
  description: string;
  prix: number;
  /** Prix minimum : « dès + 300 € ». */
  prixMinimum?: boolean;
  /** Unité de prix, par exemple « / page ». */
  unite?: string;
  /** Gros module (rendez-vous, boutique…) : toujours payant, jamais compté dans les options incluses. */
  gros?: boolean;
};

export const options: Record<OptionId, Option> = {
  page: { id: 'page', nom: 'Page supplémentaire', description: 'Une page de plus : services, équipe…', prix: 50 },
  galerie: { id: 'galerie', nom: 'Galerie photos', description: 'Montrez votre travail en images.', prix: 80 },
  textes: { id: 'textes', nom: 'Rédaction des textes', description: 'Je les écris pour vous.', prix: 60, unite: ' / page' },
  logo: { id: 'logo', nom: 'Logo simple', description: 'Une identité à vous.', prix: 150 },
  avantapres: { id: 'avantapres', nom: 'Avant / après', description: 'Glissez pour voir la différence.', prix: 80 },
  avis: { id: 'avis', nom: 'Avis Google affichés', description: 'Vos étoiles mises en avant.', prix: 60 },
  seo: { id: 'seo', nom: 'SEO avancé', description: 'Pages par ville, suivi Google.', prix: 150 },
  anglais: { id: 'anglais', nom: 'Site en anglais', description: "Pour les touristes et l'export.", prix: 150 },
  rdv: { id: 'rdv', nom: 'Rendez-vous en ligne', description: 'Vos clients réservent seuls, rappel la veille.', prix: 400, gros: true },
  acompte: { id: 'acompte', nom: 'Acompte en ligne', description: 'Fini les rendez-vous non honorés.', prix: 150 },
  calcul: {
    id: 'calcul',
    nom: 'Calculateur de prix',
    description: 'Le prix selon vos critères, en direct.',
    prix: 300,
    prixMinimum: true,
    gros: true,
  },
  pwa: { id: 'pwa', nom: 'Appli sur téléphone', description: "Le site s'installe comme une appli.", prix: 200, gros: true },
  espace: { id: 'espace', nom: 'Espace client', description: 'Historique, factures, suivi.', prix: 300, gros: true },
  boutique: {
    id: 'boutique',
    nom: 'Boutique en ligne',
    description: 'Vendez vos produits, paiement sécurisé.',
    prix: 600,
    prixMinimum: true,
    gros: true,
  },
  table: { id: 'table', nom: 'Réservation de table', description: 'Vos clients réservent en 2 clics.', prix: 300, gros: true },
  clickcollect: {
    id: 'clickcollect',
    nom: 'Click & collect',
    description: 'Commande en ligne, retrait sur place.',
    prix: 300,
    gros: true,
  },
};

/**
 * Options incluses dans le prix de chaque formule, à choisir parmi les petites options (pas les gros modules).
 * Les premières cochées sont incluses ; les suivantes restent possibles, mais payantes.
 */
export const inclusParFormule: Record<FormuleId, number> = { vitrine: 1, vitrinePlus: 2, fonctionnel: 3 };

/** Petites options : proposées avec toutes les formules (la galerie est déjà dans Vitrine+). */
export const petitesOptions: OptionId[] = ['page', 'galerie', 'textes', 'logo', 'avantapres', 'avis', 'seo', 'anglais'];

/** Options proposées pour les formules Vitrine et Vitrine+ (quel que soit le métier). */
export const optionsParFormule: Record<Exclude<FormuleId, 'fonctionnel'>, OptionId[]> = {
  vitrine: petitesOptions,
  vitrinePlus: petitesOptions.filter((id) => id !== 'galerie'),
};

/** Gros modules proposés pour la formule Fonctionnel, selon le métier (les petites options s'y ajoutent). */
export const optionsParMetier: Record<MetierId, OptionId[]> = {
  artisan: ['rdv', 'acompte', 'calcul', 'pwa', 'espace', 'avantapres'],
  commerce: ['boutique', 'clickcollect', 'espace', 'seo', 'avis', 'pwa'],
  restaurant: ['table', 'clickcollect', 'avis', 'pwa', 'anglais'],
  sante: ['rdv', 'acompte', 'espace', 'pwa', 'avis'],
  autre: ['rdv', 'calcul', 'boutique', 'espace', 'pwa', 'seo'],
};

/** Précisions demandées pour certaines options (sous-questions). */
export type Precision = {
  question: string;
  choix: { id: string; label: string; prix: number; note?: string }[];
};

export const precisions: Partial<Record<OptionId, Precision>> = {
  rdv: {
    question: 'Où ont lieu vos rendez-vous ?',
    choix: [
      { id: 'client', label: 'Chez le client', prix: 0, note: "Zone et frais de déplacement calculés selon l'adresse." },
      { id: 'chezvous', label: 'Chez vous', prix: 0, note: 'Adresse et accès affichés à la réservation.' },
      { id: 'deux', label: 'Les deux', prix: 0, note: "Le client choisit, les frais s'ajoutent si besoin." },
    ],
  },
  boutique: {
    question: 'Combien de produits à vendre ?',
    choix: [
      { id: 'p20', label: 'Moins de 20', prix: 0 },
      { id: 'p100', label: '20 à 100', prix: 200 },
      { id: 'p100plus', label: 'Plus de 100', prix: 500 },
    ],
  },
  calcul: {
    question: 'Votre prix dépend surtout…',
    choix: [
      { id: 'surface', label: "d'une surface", prix: 0, note: 'Le client saisit ses m², le prix s’affiche.' },
      { id: 'vehicule', label: "d'un véhicule ou modèle", prix: 0, note: "Le client choisit son modèle, le tarif s'adapte." },
      { id: 'quantite', label: "d'une quantité", prix: 0, note: 'Prix dégressif selon la quantité.' },
      { id: 'distance', label: "d'une distance", prix: 0, note: 'Calcul automatique depuis votre adresse.' },
    ],
  },
  pwa: {
    question: 'Des notifications sur le téléphone ?',
    choix: [
      { id: 'oui', label: 'Oui, rappels et nouveautés', prix: 0 },
      { id: 'non', label: 'Non, pas besoin', prix: 0 },
    ],
  },
  table: {
    question: 'Un acompte pour les grandes tablées ?',
    choix: [
      { id: 'oui', label: 'Oui', prix: 150, note: "Acompte demandé au-delà d'un nombre de couverts." },
      { id: 'non', label: 'Non', prix: 0 },
    ],
  },
};

/** Prix du marché, avec leur source (à toujours afficher). */
export type MarcheId = 'vitrine' | 'vitrinePlus' | 'boutique' | 'surMesure' | 'seo';
export type Marche = { fourchette: string; bas: number; haut: number; description: string; source: string };

export const marche: Record<MarcheId, Marche> = {
  vitrine: {
    fourchette: '300 – 1 200 €',
    bas: 300,
    haut: 1200,
    description: 'site une page par un freelance',
    source: 'Plateya, 2026',
  },
  vitrinePlus: {
    fourchette: '800 – 4 000 €',
    bas: 800,
    haut: 4000,
    description: 'site vitrine 5 à 10 pages par un freelance',
    source: 'Plateya, 2026',
  },
  boutique: {
    fourchette: '3 000 – 40 000 €',
    bas: 3000,
    haut: 40000,
    description: 'site e-commerce en agence (médiane 10 000 €)',
    source: 'La Fabrique du Net, 2026',
  },
  surMesure: {
    fourchette: '6 000 – 45 000 €',
    bas: 6000,
    haut: 45000,
    description: 'site sur mesure / applicatif en agence (médiane 18 000 €)',
    source: 'La Fabrique du Net, 2026',
  },
  seo: {
    fourchette: '500 – 1 200 €',
    bas: 500,
    haut: 1200,
    description: 'audit et optimisation SEO d’un site vitrine par un freelance',
    source: 'Freelance Solution, 2026',
  },
};

/**
 * Seul prix affiché sur le site : « à partir de », celui de la Vitrine+ (plusieurs pages, design personnalisé,
 * modifiable par le client). Le reste est chiffré dans le devis. Suit le prix modifié dans le back-office.
 */
export function prixDepart() {
  return formuleParId('vitrinePlus').prix;
}

/** Tarif horaire après la mise en ligne. */
export const tarifHoraire = 29;

/** Abonnement mensuel de suivi : maintenance et mises à jour du site. */
export const abonnementMensuel = 29;

/** Remise du référencement seul sur le bas de la fourchette du marché. */
export const REMISE_SEO = 0.2;

/** Prix du référencement seul (site existant) : 20 % sous le bas du marché. */
export function prixSeoSeul() {
  return Math.round(marche.seo.bas * (1 - REMISE_SEO));
}

export type Complement = { id: string; nom: string; prix: string; detail: string };

/**
 * Compléments affichés à part, sous les trois formules : page en plus et suivi après la mise en ligne
 * (avec le tarif horaire). Calculés à l'appel : ils suivent les prix modifiés dans le back-office.
 */
export function complements(): Complement[] {
  return [
    { id: 'page', nom: options.page.nom, prix: prixOption(options.page), detail: 'Sur n’importe quelle formule.' },
    {
      id: 'abonnement',
      nom: 'Suivi mensuel',
      prix: `${formatPrix(abonnementMensuel)} / mois`,
      detail: `Maintenance et mises à jour de votre site. Sans suivi : ${formatPrix(tarifHoraire)} de l’heure, à la demande.`,
    },
  ];
}

/**
 * Référencement Google seul, mis en avant à part : une offre pour ceux qui ont déjà un site.
 * Prix : 20 % sous le bas de la fourchette du marché (source affichée).
 */
export function offreSeo() {
  return {
    badge: `− ${Math.round(REMISE_SEO * 100)} % sur le prix du marché`,
    titre: 'Vous avez déjà un site ?',
    texte: 'Je peux améliorer sa place sur Google sans le refaire : audit et optimisation du référencement.',
    prix: formatPrix(prixSeoSeul()),
    marche: `Sur le marché : ${marche.seo.fourchette}`,
    source: `${marche.seo.description} (${marche.seo.source})`,
  };
}

export const mentionsPrix = {
  tva: 'Prix nets, TVA non applicable (art. 293 B du CGI).',
  apresMiseEnLigne: `Après la mise en ligne : ${tarifHoraire} € de l'heure, sans engagement.`,
};

/** Formate un montant en euros, à la française : « 1 200 € ». */
export function formatPrix(montant: number) {
  const nombre = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(montant);
  return `${nombre} €`.replace(/[  ]/g, ' ');
}

/** Prix affiché d'une option : « + 80 € », « dès + 300 € » ou « + 60 € / page ». */
export function prixOption(option: Option) {
  return `${option.prixMinimum ? 'dès ' : ''}+ ${formatPrix(option.prix)}${option.unite ?? ''}`;
}

/** Mention placée devant un prix de départ. */
export const A_PARTIR_DE = 'à partir de';

/** Prix affiché d'une formule : « à partir de 99 € », ou « 99 € » pour un prix fixe. */
export function prixFormule(formule: Formule) {
  return formule.prixMinimum ? `${A_PARTIR_DE} ${formatPrix(formule.prix)}` : formatPrix(formule.prix);
}
