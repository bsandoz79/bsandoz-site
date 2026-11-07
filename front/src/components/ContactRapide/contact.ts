import { contactRapide } from '../../data/contact';

export type MessageContact = {
  nom: string;
  entreprise: string;
  telephone: string;
  email: string;
  /** Métier ou activité, écrit librement (avec des suggestions). */
  activite: string;
  projet: string;
  consentement: boolean;
};

export const messageVide: MessageContact = {
  nom: '',
  entreprise: '',
  telephone: '',
  email: '',
  activite: '',
  projet: '',
  consentement: false,
};

/** Estimation validée, jointe à la demande : son récapitulatif et son texte pour l'accusé de réception. */
export type EstimationJointe = {
  /** Titre de la demande (« Site Vitrine+ · Galerie photos »). */
  titre: string;
  /** Métier saisi pendant l'estimation : pré-remplit le champ. */
  activite: string;
  lignes: [string, string][];
  /** Texte de l'estimation, envoyé au client dans l'accusé de réception. */
  predevis: string;
};

export type ErreursContact = Partial<Record<keyof MessageContact, string>>;

const E = contactRapide.erreurs;

/** Erreurs du formulaire (mêmes règles que l'API). Avec une estimation jointe, le projet est facultatif. */
export function validerContact(m: MessageContact, avecEstimation = false): ErreursContact {
  const erreurs: ErreursContact = {};
  if (!m.nom.trim()) erreurs.nom = E.nom;
  if (!/^\+?[\d\s.-]{10,20}$/.test(m.telephone.trim())) erreurs.telephone = E.telephone;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m.email.trim())) erreurs.email = E.email;
  if (m.activite.trim().length < 2) erreurs.activite = E.activite;
  if (!avecEstimation && m.projet.trim().length < 10) erreurs.projet = E.projet;
  if (!m.consentement) erreurs.consentement = E.consentement;
  return erreurs;
}

/**
 * Données envoyées à `devis.php` ou à l'API `POST /demandes` : la demande est enregistrée
 * et un accusé de réception part au client, avec l'estimation si elle est jointe.
 */
export function construireEnvoiContact(m: MessageContact, piege: string, estimation?: EstimationJointe) {
  const activite = m.activite.trim();
  const lignes: [string, string][] = [];
  if (estimation) lignes.push(['Origine', 'Estimation en ligne'], ...estimation.lignes);
  lignes.push(['Activité', activite]);
  if (m.projet.trim()) lignes.push(['Projet', m.projet.trim()]);
  lignes.push(['Nom', m.nom.trim()]);
  if (m.entreprise.trim()) lignes.push(['Entreprise', m.entreprise.trim()]);
  lignes.push(['Téléphone', m.telephone.trim()], ['E-mail', m.email.trim()]);
  const donnees = new FormData();
  donnees.append('nom', m.nom.trim());
  donnees.append('email', m.email.trim());
  donnees.append('telephone', m.telephone.trim());
  donnees.append('entreprise', m.entreprise.trim());
  donnees.append('titre', estimation?.titre ?? `Projet · ${activite}`);
  donnees.append('recapitulatif', lignes.map(([cle, valeur]) => `${cle} : ${valeur}`).join('\n'));
  donnees.append('predevis', estimation?.predevis ?? '');
  donnees.append('site_web', piege);
  return donnees;
}
