import { formuleParId, options, tarifHoraire } from './offres';
import { pages } from './pages';

/**
 * Questions fréquentes (cahier des charges, section 9) : délais, quoi fournir, propriété,
 * hébergement, modifications, WordPress, paiement. Les réponses ne reprennent que des faits établis.
 * Le texte brut sert aussi aux données structurées FAQPage.
 */
export type QuestionFaq = { id: string; question: string; reponse: string[] };

const vitrine = formuleParId('vitrine');
const vitrinePlus = formuleParId('vitrinePlus');
const fonctionnel = formuleParId('fonctionnel');

export const questionsFaq: QuestionFaq[] = [
  {
    id: 'delais',
    question: 'En combien de temps mon site est-il prêt ?',
    reponse: [
      `Comptez ${vitrine.delai} pour une Vitrine, ${vitrinePlus.delai} pour une Vitrine+ et ${fonctionnel.delai} pour un site fonctionnel.`,
    ],
  },
  {
    id: 'contenus',
    question: 'Que dois-je fournir ?',
    reponse: [
      'Vos textes, vos photos et votre logo si vous en avez un.',
      `Pas de textes ? Je peux les rédiger (${options.textes.prix} € par page). Pas de logo ? Je peux en créer un simple (${options.logo.prix} €).`,
    ],
  },
  {
    id: 'propriete',
    question: 'À qui appartient le site ?',
    reponse: ['À vous. Votre site vous appartient, sans abonnement imposé.'],
  },
  {
    id: 'hebergement',
    question: 'Qui s’occupe de l’hébergement et du nom de domaine ?',
    reponse: [
      'Avec la Vitrine, le nom de domaine et l’hébergement sont à votre charge, et je vous forme pendant 1 h si vous les gérez vous-même.',
      'Si vous préférez déléguer, demandez-moi la formule hébergement + maintenance.',
    ],
  },
  {
    id: 'modifications',
    question: 'Et si je veux modifier mon site après la mise en ligne ?',
    reponse: [
      'Prix, horaires, photos : vous pouvez les changer vous-même.',
      `Pour le reste, je m’en occupe à ${tarifHoraire} € de l’heure, sans engagement (toute demi-heure entamée est due).`,
    ],
  },
  {
    id: 'wordpress',
    question: 'Utilisez-vous WordPress ?',
    reponse: [
      'Rarement : je développe le plus souvent sur mesure, selon ce dont vous avez besoin.',
    ],
  },
  {
    id: 'paiement',
    question: 'Comment se passe le paiement ?',
    reponse: [
      'Un acompte à la commande, le solde à la mise en ligne.',
      'Prix nets, TVA non applicable (art. 293 B du CGI).',
    ],
  },
];

/** Section FAQ de l'accueil, juste avant la carte : 3 questions, puis 3 de plus à chaque « Voir plus ». */
export const faqAccueil = {
  /** Ancre de la section : le lien « Questions fréquentes » mène à `/#faq`. */
  id: 'faq',
  eyebrow: 'Questions fréquentes',
  titre: 'Vos questions, mes réponses.',
  intro: 'Les réponses aux questions qu’on me pose le plus souvent. Une autre question ? Parlons-en.',
  parPaquet: 3,
  voirPlus: 'Voir plus de questions',
};

/** Lien vers la section FAQ de l'accueil. */
export const lienFaq = `${pages.accueil.path}#${faqAccueil.id}`;

/** Ancienne adresse de la page FAQ : redirigée vers la section de l'accueil. */
export const ancienneAdresseFaq = '/faq';
