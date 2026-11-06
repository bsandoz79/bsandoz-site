import { besoinsContact, contactRapide, type BesoinContact } from '../../data/contact';

export type MessageContact = {
  nom: string;
  telephone: string;
  email: string;
  besoin: BesoinContact | '';
  projet: string;
  consentement: boolean;
};

export const messageVide: MessageContact = { nom: '', telephone: '', email: '', besoin: '', projet: '', consentement: false };

export type ErreursContact = Partial<Record<keyof MessageContact, string>>;

const E = contactRapide.erreurs;

/** Erreurs du formulaire (mêmes règles que le devis et l'API). */
export function validerContact(m: MessageContact): ErreursContact {
  const erreurs: ErreursContact = {};
  if (!m.nom.trim()) erreurs.nom = E.nom;
  if (!/^\+?[\d\s.-]{10,20}$/.test(m.telephone.trim())) erreurs.telephone = E.telephone;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m.email.trim())) erreurs.email = E.email;
  if (!m.besoin) erreurs.besoin = E.besoin;
  if (!m.consentement) erreurs.consentement = E.consentement;
  return erreurs;
}

/**
 * Données envoyées : le même formulaire que la demande de devis (`devis.php` ou l'API `POST /demandes`),
 * pour que le message arrive au même endroit, avec le même accusé de réception.
 */
export function construireEnvoiContact(m: MessageContact, piege: string) {
  const besoin = besoinsContact.find((b) => b.value === m.besoin)?.label ?? '';
  const lignes = [
    ['Origine', 'Formulaire de contact rapide'],
    ['Besoin', besoin],
    ['Projet', m.projet.trim() || '(non précisé)'],
    ['Nom', m.nom.trim()],
    ['Téléphone', m.telephone.trim()],
    ['E-mail', m.email.trim()],
  ];
  const donnees = new FormData();
  donnees.append('nom', m.nom.trim());
  donnees.append('email', m.email.trim());
  donnees.append('telephone', m.telephone.trim());
  donnees.append('entreprise', '');
  donnees.append('titre', besoin);
  donnees.append('recapitulatif', lignes.map(([cle, valeur]) => `${cle} : ${valeur}`).join('\n'));
  donnees.append('predevis', '');
  donnees.append('site_web', piege);
  return donnees;
}
