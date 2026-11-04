import type { MetierId, OptionId } from './offres';
import { pages } from './pages';

/** Pages métier (cahier des charges, sections 3 et 9). */
export type PageMetierId = 'artisan' | 'ecommerce' | 'restaurant' | 'independant';

export type PageMetier = {
  page: PageMetierId;
  metier: MetierId;
  /** Public visé, en petit au-dessus du titre. */
  public: string;
  intro: string;
  /** Options mises en avant dans l'aperçu d'exemple. */
  exemple: OptionId[];
  /** Réalisation en lien avec le métier, s'il y en a une. */
  realisation?: string;
};

export const pagesMetier: Record<PageMetierId, PageMetier> = {
  artisan: {
    page: 'artisan',
    metier: 'artisan',
    public: 'Artisans à domicile',
    intro:
      'Vous êtes chez vos clients toute la journée. Votre site prend les rendez-vous, demande un acompte et calcule vos prix pendant que vous travaillez.',
    exemple: ['rdv', 'acompte', 'calcul'],
    realisation: 'demo-detailing',
  },
  ecommerce: {
    page: 'ecommerce',
    metier: 'commerce',
    public: 'Commerçants',
    intro:
      'Vos clients vous cherchent sur Google avant de passer la porte. Votre site les guide jusqu’à vous, et vend aussi en ligne ou en click & collect.',
    exemple: ['boutique', 'clickcollect', 'seo'],
  },
  restaurant: {
    page: 'restaurant',
    metier: 'restaurant',
    public: 'Restaurants et bars',
    intro:
      'Pendant le service, vous ne pouvez pas répondre au téléphone. Votre site montre la carte et les horaires, et prend les réservations à votre place.',
    exemple: ['table', 'clickcollect', 'avis'],
  },
  independant: {
    page: 'independant',
    metier: 'sante',
    public: 'Santé et bien-être',
    intro:
      'Vos clients réservent leur séance en ligne et reçoivent un rappel la veille. Moins d’appels à gérer, plus de temps pour les accompagner.',
    exemple: ['rdv', 'acompte', 'espace'],
    realisation: 'ordv',
  },
};

export const metierTextes = {
  fonctions: { eyebrow: 'Ce que votre site peut faire', title: 'Les fonctions utiles à votre métier' },
  prix: (prix: string) => `Site fonctionnel ${prix}. Chaque fonction s’ajoute au prix indiqué.`,
  exemple: {
    eyebrow: 'Exemple',
    title: 'À quoi votre site pourrait ressembler',
    note: 'Entreprise fictive, pour l’exemple. Votre site est fait à vos couleurs, avec vos textes et vos photos.',
  },
  realisation: { eyebrow: 'Réalisation', title: 'Un projet proche du vôtre' },
  appel: {
    title: 'Voyons ce dont vous avez besoin.',
    text: 'Composez votre site option par option, ou parlons-en de vive voix : le rendez-vous découverte est gratuit.',
    composer: 'Composer mon site',
    rdv: { label: 'Prendre rendez-vous (gratuit)', to: pages.rendezVous.path },
  },
};

/** Adresse du configurateur préréglé sur le Fonctionnel et le métier de la page. */
export const lienComposerMetier = (metier: MetierId) => `${pages.composer.path}?formule=fonctionnel&metier=${metier}`;
