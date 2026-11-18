import { pages } from './pages';

/**
 * Maquette gratuite de la page d'accueil (idée reprise de Roselyn Pro, choix de Baptiste du 18/11/2026) :
 * envoyée par e-mail sous 72 h ouvrées, sans engagement. La demande passe par `POST /demandes`, comme un devis.
 */
export const maquette = {
  titre: 'Pas encore décidé ? Voyez d’abord votre page d’accueil',
  intro: 'Répondez à quelques questions : je vous envoie la maquette de votre page d’accueil par e-mail sous 72 h ouvrées. C’est gratuit et sans engagement.',
  nom: 'Votre nom',
  entreprise: 'Nom de votre entreprise',
  activite: 'Votre métier',
  activiteAide: 'Ex. coiffeuse, couvreur, restaurant…',
  ville: 'Votre ville',
  description: 'Ce que vous faites, en deux phrases',
  descriptionAide: 'Vos services, ce qui vous distingue, pour qui vous travaillez…',
  objectif: {
    legende: 'Vos visiteurs doivent surtout…',
    choix: [
      { value: 'devis', label: 'Demander un devis' },
      { value: 'appel', label: 'Vous appeler' },
      { value: 'reservation', label: 'Réserver en ligne' },
      { value: 'visite', label: 'Venir sur place' },
    ],
  },
  style: {
    legende: 'Le style qui vous ressemble',
    choix: [
      { value: 'sobre', label: 'Sobre et rassurant' },
      { value: 'chaleureux', label: 'Chaleureux' },
      { value: 'moderne', label: 'Moderne' },
      { value: 'haut-de-gamme', label: 'Haut de gamme' },
    ],
  },
  siteActuel: 'Votre site actuel (facultatif)',
  email: 'E-mail, pour recevoir la maquette',
  telephone: 'Téléphone (facultatif)',
  consentement:
    "J'accepte que mes informations soient utilisées pour préparer la maquette et y donner suite. Elles ne sont ni revendues ni utilisées à d'autres fins.",
  confidentialite: { label: 'Politique de confidentialité', to: pages.confidentialite.path },
  envoyer: 'Recevoir ma maquette',
  envoi: 'Envoi…',
  envoye: {
    titre: 'C’est noté !',
    texte: 'Vous recevrez la maquette de votre page d’accueil par e-mail sous 72 h ouvrées. Pensez à regarder dans les indésirables.',
  },
  echec: 'L’envoi n’a pas abouti. Réessayez dans un instant, ou écrivez-moi directement par e-mail.',
  tropRapide: 'Merci de patienter une minute avant un nouvel envoi.',
  erreurs: {
    nom: 'Indiquez votre nom.',
    activite: 'Indiquez votre métier.',
    ville: 'Indiquez votre ville.',
    description: 'Décrivez votre activité en une ou deux phrases.',
    email: 'Adresse e-mail invalide.',
    telephone: 'Numéro de téléphone invalide.',
    consentement: 'Cochez la case pour que je puisse vous l’envoyer.',
  },
};

export type Objectif = (typeof maquette.objectif.choix)[number]['value'];
export type Style = (typeof maquette.style.choix)[number]['value'];

export type DemandeMaquette = {
  nom: string;
  entreprise: string;
  activite: string;
  ville: string;
  description: string;
  objectif: Objectif;
  style: Style;
  siteActuel: string;
  email: string;
  telephone: string;
  consentement: boolean;
};

export const demandeVide: DemandeMaquette = {
  nom: '',
  entreprise: '',
  activite: '',
  ville: '',
  description: '',
  objectif: 'devis',
  style: 'sobre',
  siteActuel: '',
  email: '',
  telephone: '',
  consentement: false,
};

export type ErreursMaquette = Partial<Record<keyof DemandeMaquette, string>>;

/** Erreurs du formulaire (mêmes règles que l'API pour le nom, l'e-mail et le téléphone). */
export function validerMaquette(d: DemandeMaquette): ErreursMaquette {
  const E = maquette.erreurs;
  const erreurs: ErreursMaquette = {};
  if (!d.nom.trim()) erreurs.nom = E.nom;
  if (d.activite.trim().length < 2) erreurs.activite = E.activite;
  if (d.ville.trim().length < 2) erreurs.ville = E.ville;
  if (d.description.trim().length < 10) erreurs.description = E.description;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim())) erreurs.email = E.email;
  if (d.telephone.trim() && !/^\+?[\d\s.-]{10,20}$/.test(d.telephone.trim())) erreurs.telephone = E.telephone;
  if (!d.consentement) erreurs.consentement = E.consentement;
  return erreurs;
}

const libelle = (choix: readonly { value: string; label: string }[], valeur: string) => choix.find((c) => c.value === valeur)?.label ?? valeur;

/** Données envoyées à `POST /demandes` : titre « Maquette gratuite · métier », réponses en récapitulatif. */
export function construireEnvoiMaquette(d: DemandeMaquette, piege: string): FormData {
  const lignes: [string, string][] = [
    ['Demande', 'Maquette gratuite de la page d’accueil (sous 72 h ouvrées)'],
    ['Métier', d.activite.trim()],
    ['Ville', d.ville.trim()],
    ['Activité', d.description.trim()],
    ['Les visiteurs doivent surtout', libelle(maquette.objectif.choix, d.objectif)],
    ['Style', libelle(maquette.style.choix, d.style)],
  ];
  if (d.siteActuel.trim()) lignes.push(['Site actuel', d.siteActuel.trim()]);
  const donnees = new FormData();
  donnees.append('nom', d.nom.trim());
  donnees.append('email', d.email.trim());
  donnees.append('telephone', d.telephone.trim());
  donnees.append('entreprise', d.entreprise.trim());
  donnees.append('titre', `Maquette gratuite · ${d.activite.trim()}`);
  donnees.append('recapitulatif', lignes.map(([cle, valeur]) => `${cle} : ${valeur}`).join('\n'));
  donnees.append('predevis', '');
  donnees.append('site_web', piege);
  return donnees;
}
