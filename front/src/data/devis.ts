import { contact } from './navigation';
import { pages } from './pages';

/** Parcours de demande de devis (cahier des charges, section 6, maquette `Devis`). */
export const etapesDevis = ['Activité', 'Besoins', 'Avec vos mots', 'Budget et délai', 'Coordonnées'];

export type BesoinId =
  | 'rdv'
  | 'realisations'
  | 'contact'
  | 'prix'
  | 'devis'
  | 'appli'
  | 'vente'
  | 'google'
  | 'sais-pas';

export const besoins: { id: BesoinId; nom: string; description: string }[] = [
  { id: 'rdv', nom: 'Prendre des rendez-vous', description: 'Vos clients réservent un créneau' },
  { id: 'realisations', nom: 'Montrer mes réalisations', description: 'Photos, avant / après' },
  { id: 'contact', nom: 'Être contacté', description: 'Un simple formulaire de contact' },
  { id: 'prix', nom: 'Calculer un prix', description: 'Selon la taille, la distance, le modèle…' },
  { id: 'devis', nom: 'Faire des devis', description: 'Un devis généré automatiquement' },
  { id: 'appli', nom: 'Avoir une appli', description: 'Sur le téléphone de mes clients' },
  { id: 'vente', nom: 'Vendre en ligne', description: 'Une boutique pour mes produits' },
  { id: 'google', nom: 'Être trouvé sur Google', description: 'Dans ma ville et mon métier' },
  { id: 'sais-pas', nom: 'Je ne sais pas encore', description: 'On en parle ensemble' },
];

export const budgets = [
  { value: 'moins-500', label: 'Moins de 500 €' },
  { value: '500-1000', label: '500 à 1 000 €' },
  { value: '1000-2000', label: '1 000 à 2 000 €' },
  { value: 'plus-2000', label: 'Plus de 2 000 €' },
  { value: 'sais-pas', label: 'Je ne sais pas encore' },
];

export const delais = [
  { value: 'vite', label: 'Dès que possible' },
  { value: 'mois', label: 'Dans le mois' },
  { value: 'trimestre', label: 'Dans 2 à 3 mois' },
  { value: 'pas-presse', label: 'Pas pressé' },
];

/** Limites des pièces jointes (photos). */
export const limitesPhotos = { nombre: 3, tailleMo: 5, types: ['image/jpeg', 'image/png', 'image/webp'] };

export const devisTextes = {
  progression: 'Étapes de la demande',
  etape: (n: number, total: number) => `Étape ${n} sur ${total}`,
  retour: '← Retour',
  continuer: 'Continuer →',
  envoyer: 'Envoyer ma demande',
  envoi: 'Envoi en cours…',
  activite: {
    titre: 'Quelle est votre activité ?',
    aide: 'Pour vous proposer ce qui sert vraiment à votre métier.',
    legende: 'Votre activité',
  },
  besoins: {
    titre: "Qu'aimeriez-vous que votre site fasse pour vous ?",
    aide: "Cochez tout ce qui vous parle. Pas d'inquiétude : on affinera ensemble.",
    legende: 'Besoins',
  },
  mots: {
    titre: 'Racontez-moi avec vos mots',
    aide: 'Pas besoin de termes techniques : expliquez simplement comment vous travaillez et ce qui vous ferait gagner du temps.',
    description: 'Votre projet',
    lien: 'Un site que vous aimez (facultatif)',
    lienAide: 'Son adresse, pour que je voie le style qui vous plaît.',
    photos: 'Photos (facultatif)',
    photosAide: (nombre: number, taille: number) =>
      `Jusqu'à ${nombre} photos (JPEG, PNG ou WebP, ${taille} Mo maximum chacune) : votre travail, votre vitrine…`,
  },
  budget: {
    titre: 'Votre budget et votre délai',
    aide: 'Une idée suffit, rien ne vous engage.',
    budget: 'Budget envisagé',
    delai: 'Pour quand ?',
  },
  coordonnees: {
    titre: 'Où vous répondre ?',
    aide: 'Je vous réponds sous 24 h avec une première estimation.',
    nom: 'Nom et prénom',
    entreprise: 'Entreprise (facultatif)',
    email: 'E-mail',
    telephone: 'Téléphone (facultatif)',
    consentement:
      "J'accepte que mes informations soient utilisées pour répondre à ma demande. Elles ne sont ni revendues ni utilisées à d'autres fins.",
    confidentialite: { label: 'Politique de confidentialité', to: pages.confidentialite.path },
    recapitulatif: 'Récapitulatif',
    piege: 'Ne pas remplir ce champ',
  },
  erreurs: {
    activite: 'Choisissez votre activité.',
    besoins: 'Cochez au moins un besoin.',
    description: 'Décrivez votre projet en quelques mots (20 caractères au moins).',
    lien: "L'adresse du site doit commencer par http:// ou https://.",
    photosNombre: (n: number) => `${n} photos au maximum.`,
    photosType: 'Seules les photos JPEG, PNG ou WebP sont acceptées.',
    photosTaille: (taille: number) => `Chaque photo doit faire ${taille} Mo au maximum.`,
    budget: 'Choisissez un budget, même approximatif.',
    delai: 'Choisissez un délai.',
    nom: 'Indiquez votre nom.',
    email: 'Indiquez une adresse e-mail valide, par exemple nom@exemple.fr.',
    telephone: 'Le numéro de téléphone ne semble pas valide.',
    consentement: 'Cochez la case pour que je puisse vous répondre.',
    resume: (n: number) => (n > 1 ? `${n} champs sont à corriger.` : 'Un champ est à corriger.'),
  },
  apercu: {
    titre: 'Votre projet',
    configuration: 'Depuis « Composer mon site »',
    estimation: 'Première estimation',
    conseil: '« Pas besoin de termes techniques : racontez-moi simplement comment vous travaillez. »',
    signature: 'Baptiste',
    vide: 'Vos réponses s’afficheront ici.',
  },
  envoye: {
    titre: 'Merci, votre demande est envoyée !',
    texte:
      'Vous allez recevoir un e-mail de confirmation avec une première estimation, calculée d’après vos réponses. Je vous réponds ensuite sous 24 h pour la confirmer ou l’ajuster.',
    accueil: { label: "Retour à l'accueil", to: pages.accueil.path },
    rdv: { label: 'Prendre rendez-vous (gratuit)', to: pages.rendezVous.path },
  },
  echec: {
    titre: "La demande n'a pas pu être envoyée.",
    texte: `Vos réponses sont gardées. Réessayez dans un instant, ou écrivez-moi directement à ${contact.email}.`,
    tropRapide: 'Merci de patienter une minute avant un nouvel envoi.',
  },
};

/**
 * Adresse d'envoi de la demande. Par défaut, le script déposé avec le site sur o2switch (`public/api/devis.php`,
 * envoi par mail seulement). Une fois l'API en ligne, `VITE_DEVIS_URL=https://api.bsandoz.fr/demandes` au build :
 * la demande est alors enregistrée, suivie dans l'espace client, et le compte client est ouvert.
 * Les deux adresses acceptent exactement le même formulaire.
 */
export const urlEnvoiDevis = (import.meta.env.VITE_DEVIS_URL as string | undefined) ?? '/api/devis.php';
