import { contactRapide } from '../../data/contact';
import { formules, prixFormule } from '../../data/offres';

export type TypeDemande = (typeof contactRapide.demande.choix)[number]['value'];
export type StyleMaquette = (typeof contactRapide.maquette.style.choix)[number]['value'];

export type MessageContact = {
  /** Un devis, ou d'abord une maquette gratuite de la page d'accueil (ville et style en plus, téléphone facultatif). */
  demande: TypeDemande;
  nom: string;
  entreprise: string;
  telephone: string;
  email: string;
  /** Métier ou activité, écrit librement (avec des suggestions). */
  activite: string;
  projet: string;
  ville: string;
  style: StyleMaquette;
  consentement: boolean;
};

export const messageVide: MessageContact = {
  demande: 'devis',
  nom: '',
  entreprise: '',
  telephone: '',
  email: '',
  activite: '',
  projet: '',
  ville: '',
  style: 'sobre',
  consentement: false,
};

export type ErreursContact = Partial<Record<keyof MessageContact, string>>;

const E = contactRapide.erreurs;

/** Erreurs du formulaire (mêmes règles que l'API). */
export function validerContact(m: MessageContact): ErreursContact {
  const erreurs: ErreursContact = {};
  if (!m.nom.trim()) erreurs.nom = E.nom;
  const maquette = m.demande === 'maquette';
  // Pour une maquette, la réponse part par e-mail : le téléphone est facultatif, mais vérifié s'il est donné.
  if ((!maquette || m.telephone.trim()) && !/^\+?[\d\s.-]{10,20}$/.test(m.telephone.trim())) erreurs.telephone = E.telephone;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m.email.trim())) erreurs.email = E.email;
  if (m.activite.trim().length < 2) erreurs.activite = E.activite;
  if (m.projet.trim().length < 10) erreurs.projet = E.projet;
  if (maquette && m.ville.trim().length < 2) erreurs.ville = E.ville;
  if (!m.consentement) erreurs.consentement = E.consentement;
  return erreurs;
}

/**
 * Données envoyées à `devis.php` ou à l'API `POST /demandes` : la demande est enregistrée
 * et un accusé de réception part au client. Pas de prix : Baptiste répond avec une proposition.
 */
export function construireEnvoiContact(m: MessageContact, piege: string) {
  const activite = m.activite.trim();
  const maquette = m.demande === 'maquette';
  const style = contactRapide.maquette.style.choix.find((c) => c.value === m.style)?.label ?? m.style;
  const lignes: [string, string][] = maquette
    ? [
        ['Demande', 'Maquette gratuite de la page d’accueil (sous 72 h ouvrées)'],
        ['Activité', activite],
        ['Ville', m.ville.trim()],
        ['Ce qu’il fait', m.projet.trim()],
        ['Style', style],
      ]
    : [['Activité', activite]];
  if (!maquette && m.projet.trim()) lignes.push(['Projet', m.projet.trim()]);
  lignes.push(['Nom', m.nom.trim()]);
  if (m.entreprise.trim()) lignes.push(['Entreprise', m.entreprise.trim()]);
  lignes.push(['Téléphone', m.telephone.trim()], ['E-mail', m.email.trim()]);
  const donnees = new FormData();
  donnees.append('nom', m.nom.trim());
  donnees.append('email', m.email.trim());
  donnees.append('telephone', m.telephone.trim());
  donnees.append('entreprise', m.entreprise.trim());
  donnees.append('titre', `${maquette ? 'Maquette gratuite' : 'Projet'} · ${activite}`);
  donnees.append('recapitulatif', lignes.map(([cle, valeur]) => `${cle} : ${valeur}`).join('\n'));
  donnees.append('predevis', '');
  donnees.append('site_web', piege);
  return donnees;
}

/** Projet pré-rempli quand on arrive d'une carte de tarif (/devis?formule=vitrinePlus) : la formule et son prix. */
export function projetDeFormule(id: string | null): string {
  const formule = formules.find((f) => f.id === id);
  return formule ? `Formule ${formule.nom} (${prixFormule(formule)}). ` : '';
}
