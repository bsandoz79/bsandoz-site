/** Formules de site (cahier des charges, section 4). Prix nets, TVA non applicable. */
export type FormuleId = 'vitrine' | 'vitrinePlus' | 'fonctionnel';

export type Formule = {
  id: FormuleId;
  nom: string;
  accroche: string;
  /** Prix en euros. */
  prix: number;
  /** Vrai si le prix est un minimum (« dès … »). */
  prixMinimum: boolean;
  delai: string;
  /** Points forts affichés sur les cartes d'offre. */
  pointsForts: string[];
};

export const formules: Formule[] = [
  {
    id: 'vitrine',
    nom: 'Vitrine',
    accroche: 'Être visible, vite.',
    prix: 99,
    prixMinimum: false,
    delai: '3 jours',
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
    prixMinimum: false,
    delai: '1 à 2 semaines',
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
    pointsForts: [
      'Rendez-vous en ligne et acompte',
      'Appli installable sur téléphone',
      'Calculateur ou générateur de devis',
      'Boutique, espace client, sur mesure',
    ],
  },
];

/** Tarif horaire après la mise en ligne. */
export const tarifHoraire = 50;

export const mentionsPrix = {
  tva: 'Prix nets, TVA non applicable (art. 293 B du CGI).',
  apresMiseEnLigne: `Après la mise en ligne : ${tarifHoraire} € de l'heure, sans engagement.`,
};

/** Formate un montant en euros, à la française : « 1 200 € ». */
export function formatPrix(montant: number) {
  const nombre = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(montant);
  return `${nombre} €`.replace(/[  ]/g, ' ');
}

/** Prix affiché d'une formule : « 99 € » ou « dès 989 € ». */
export function prixFormule(formule: Formule) {
  return formule.prixMinimum ? `dès ${formatPrix(formule.prix)}` : formatPrix(formule.prix);
}
