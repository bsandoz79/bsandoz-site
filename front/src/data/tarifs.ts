import { abonnementMensuel, tarifHoraire, type FormuleId } from './offres';
import { pages } from './pages';

/** Textes de la page Tarifs (maquette `Tarifs`, cahier des charges section 4). */
export const intro = {
  text: "Un site qui présente votre activité et un site qui prend des rendez-vous ou encaisse des acomptes, ce n'est pas le même travail. Voici les prix de départ ; le prix exact dépend de votre projet.",
};

/** Contenu détaillé de chaque formule. */
export const contenuFormules: Record<FormuleId, string[]> = {
  vitrine: [
    '1 page sur un modèle',
    'contenus fournis',
    '1 série de retouches',
    'mise en ligne + HTTPS',
    'domaine et hébergement à votre charge',
  ],
  vitrinePlus: ["jusqu'à 5 pages", 'design personnalisé', 'formulaire', 'galerie', 'SEO local + fiche Google'],
  fonctionnel: ['sur mesure', 'rendez-vous, devis, boutique, appli, espace client'],
};

export const formulesSection = {
  title: 'Les trois formules',
  delaiLabel: 'Délai',
};

export const pourquoiFonctionnel = {
  title: 'Pourquoi un site fonctionnel coûte plus cher ?',
  text: 'Un site vitrine montre qui vous êtes. Un site fonctionnel calcule, enregistre vos rendez-vous, envoie des mails, encaisse des acomptes et protège les données de vos clients. Il demande plus de développement, de sécurité et de tests.',
};

/** Appel au devis, sous les formules. */
export const appelDevis = {
  titre: 'Votre projet a ses particularités ?',
  texte: 'Décrivez-le en quelques lignes : je vous réponds sous 24 h avec une proposition claire.',
  lien: { label: 'Demander un devis', to: pages.devis.path },
};

export const apresMiseEnLigne = {
  title: 'Et après la mise en ligne ?',
  items: [
    { title: 'Un changement ?', text: `${tarifHoraire} € de l'heure, sans engagement. Demi-heure entamée due.` },
    { title: 'Vous gérez vous-même', text: 'Textes, prix, photos : vous les changez directement sur votre site.' },
    { title: 'Vous préférez déléguer ?', text: `Le suivi mensuel : maintenance et mises à jour pour ${abonnementMensuel} € par mois.` },
  ],
};
