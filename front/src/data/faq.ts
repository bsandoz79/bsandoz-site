import { pages } from './pages';

/**
 * Questions fréquentes (cahier des charges, section 9) : délais, quoi fournir, propriété,
 * hébergement, modifications, WordPress, paiement. Les réponses ne reprennent que des faits établis.
 * Le texte brut sert aussi aux données structurées FAQPage.
 */
export type QuestionFaq = { id: string; question: string; reponse: string[] };

export const questionsFaq: QuestionFaq[] = [
  {
    id: 'delais',
    question: 'En combien de temps mon site est-il prêt ?',
    reponse: [
      'Comptez quelques jours pour un site d’une page, 1 à 2 semaines pour un site de plusieurs pages, et 3 à 6 semaines pour un site avec rendez-vous, boutique ou espace client. Le délai exact est dans le devis.',
      'Pour un site vitrine, vous voyez un premier aperçu privé 5 à 7 jours ouvrés après avoir répondu à mes questions.',
    ],
  },
  {
    id: 'contenus',
    question: 'Que dois-je fournir ?',
    reponse: [
      'Vos textes, vos photos et votre logo si vous en avez un.',
      'Pas de textes ? Je peux les rédiger. Pas de logo ? Je peux en créer un simple. C’est indiqué dans le devis.',
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
      'Le nom de domaine et l’hébergement sont à votre nom. Si vous les gérez vous-même, je vous forme pendant 1 h.',
      'Si vous préférez déléguer, demandez-moi la formule hébergement + maintenance.',
    ],
  },
  {
    id: 'retouches',
    question: 'Combien de retouches ai-je droit ?',
    reponse: [
      'Autant qu’il en faut avant la mise en ligne : le site part en ligne quand il vous plaît.',
      'Après la mise en ligne, 30 jours d’ajustements sont compris.',
    ],
  },
  {
    id: 'modifications',
    question: 'Et si je veux modifier mon site après la mise en ligne ?',
    reponse: [
      'Textes, prix, horaires, photos : vous les changez vous-même, directement sur votre site.',
      'Pour le reste (une nouvelle page, le menu…), je m’en occupe, au tarif indiqué dans le devis.',
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
  titre: 'Questions fréquentes',
  intro: 'Les réponses aux questions qu’on me pose le plus souvent. Une autre question ? Parlons-en.',
  parPaquet: 3,
  voirPlus: 'Voir plus de questions',
};

/** Lien vers la section FAQ de l'accueil. */
export const lienFaq = `${pages.accueil.path}#${faqAccueil.id}`;

/** Ancienne adresse de la page FAQ : redirigée vers la section de l'accueil. */
export const ancienneAdresseFaq = '/faq';
