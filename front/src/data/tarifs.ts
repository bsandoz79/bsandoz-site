import { abonnementMensuel, tarifHoraire, type FormuleId } from './offres';
import { pages } from './pages';

/** Textes de la page Tarifs (maquette `Tarifs`, cahier des charges section 4). */
export const intro = {
  text: "Un site qui présente votre activité et un site qui prend des rendez-vous ou encaisse des acomptes, ce n'est pas le même travail. Choisissez votre point de départ, ajoutez ce qui vous sert, et voyez le prix en direct.",
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

export const simulateur = {
  eyebrow: 'Simulateur',
  title: 'Simulez votre site',
  intro: 'Choisissez une formule, puis ce que votre site doit faire : le prix se met à jour en direct.',
  formuleLegend: '1. Votre formule',
  activiteLegend: '2. Votre activité',
  optionsLegend: 'Ce que votre site doit faire',
  choisirFormule: 'Choisissez une formule pour voir les options proposées.',
  choisirActivite: 'Choisissez votre activité pour voir les options proposées.',
  resumeTitle: 'Votre estimation',
  resumeEyebrow: 'Votre estimation',
  delai: 'Délai estimé',
  suggestionTitle: 'Vous pourriez aussi avoir besoin de',
  suggestionAction: 'Ajouter',
  offert: 'Offert',
  economie: 'Offert grâce au pack',
  devis: { label: 'Recevoir mon devis détaillé', to: pages.devis.path },
  composer: { label: 'Composer mon site en détail', to: `${pages.composer.path}?onglet=web` },
  footnote: 'Estimation indicative, devis précis après échange. Prix nets, TVA non applicable.',
};

export const apresMiseEnLigne = {
  title: 'Et après la mise en ligne ?',
  items: [
    { title: 'Un changement ?', text: `${tarifHoraire} € de l'heure, sans engagement. Demi-heure entamée due.` },
    { title: 'Vous gérez vous-même', text: 'Prix, horaires, photos : modifiables depuis votre espace.' },
    { title: 'Vous préférez déléguer ?', text: `Le suivi mensuel : hébergement et maintenance pour ${abonnementMensuel} € par mois.` },
  ],
};
