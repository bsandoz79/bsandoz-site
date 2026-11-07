import { activitesContact, contactRapide, type ActiviteContact } from '../../data/contact';

export type MessageContact = {
  nom: string;
  entreprise: string;
  telephone: string;
  email: string;
  activite: ActiviteContact | '';
  /** Activité précisée quand `activite` vaut « autre ». */
  activiteAutre: string;
  projet: string;
  consentement: boolean;
};

export const messageVide: MessageContact = {
  nom: '',
  entreprise: '',
  telephone: '',
  email: '',
  activite: '',
  activiteAutre: '',
  projet: '',
  consentement: false,
};

export type ErreursContact = Partial<Record<keyof MessageContact, string>>;

const E = contactRapide.erreurs;

/** Erreurs du formulaire (mêmes règles que l'API). */
export function validerContact(m: MessageContact): ErreursContact {
  const erreurs: ErreursContact = {};
  if (!m.nom.trim()) erreurs.nom = E.nom;
  if (!/^\+?[\d\s.-]{10,20}$/.test(m.telephone.trim())) erreurs.telephone = E.telephone;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m.email.trim())) erreurs.email = E.email;
  if (!m.activite) erreurs.activite = E.activite;
  if (m.activite === 'autre' && m.activiteAutre.trim().length < 2) erreurs.activiteAutre = E.activiteAutre;
  if (m.projet.trim().length < 10) erreurs.projet = E.projet;
  if (!m.consentement) erreurs.consentement = E.consentement;
  return erreurs;
}

/** Nom de l'activité : celle précisée pour « Autre », sinon le libellé de la liste. */
export function nomActiviteContact(m: Pick<MessageContact, 'activite' | 'activiteAutre'>) {
  if (m.activite === 'autre') return m.activiteAutre.trim();
  return activitesContact.find((a) => a.value === m.activite)?.label ?? '';
}

/**
 * Données envoyées à `devis.php` ou à l'API `POST /demandes` : la demande est enregistrée
 * et un accusé de réception part au client. Pas de pré-devis : Baptiste répond avec une proposition.
 */
export function construireEnvoiContact(m: MessageContact, piege: string) {
  const activite = nomActiviteContact(m);
  const lignes: [string, string][] = [
    ['Activité', activite],
    ['Projet', m.projet.trim()],
    ['Nom', m.nom.trim()],
  ];
  if (m.entreprise.trim()) lignes.push(['Entreprise', m.entreprise.trim()]);
  lignes.push(['Téléphone', m.telephone.trim()], ['E-mail', m.email.trim()]);
  const donnees = new FormData();
  donnees.append('nom', m.nom.trim());
  donnees.append('email', m.email.trim());
  donnees.append('telephone', m.telephone.trim());
  donnees.append('entreprise', m.entreprise.trim());
  donnees.append('titre', `Projet · ${activite}`);
  donnees.append('recapitulatif', lignes.map(([cle, valeur]) => `${cle} : ${valeur}`).join('\n'));
  donnees.append('predevis', '');
  donnees.append('site_web', piege);
  return donnees;
}
