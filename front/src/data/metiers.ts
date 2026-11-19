import type { MetierId, OptionId } from './offres';
import { pages } from './pages';

/** Pages métier (cahier des charges, sections 3 et 9). */
export type PageMetierId =
  | 'artisan'
  | 'batiment'
  | 'beaute'
  | 'ecommerce'
  | 'restaurant'
  | 'independant'
  | 'liberal'
  | 'cours'
  | 'hebergement'
  | 'association'
  | 'evenementiel';

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
  /** Restaurant : exemple de carte sur téléphone et points propres au métier (data/restaurant.ts). */
  exempleRestaurant?: boolean;
};

/** Pages ajoutées après la revue des 10 personas (19/11/2026). */
const pagesPersonas: Record<'batiment' | 'beaute' | 'liberal' | 'cours' | 'hebergement' | 'association' | 'evenementiel', PageMetier> = {
  batiment: {
    page: 'batiment',
    metier: 'batiment',
    public: 'Artisans du bâtiment',
    intro:
      'Plombier, électricien, couvreur, menuisier… Vos clients vous appellent en un clic, envoient leur demande de devis avec les photos du problème, et voient vos chantiers en avant / après.',
    exemple: ['calcul', 'avantapres', 'avis'],
  },
  beaute: {
    page: 'beaute',
    metier: 'beaute',
    public: 'Coiffure, esthétique, ongles',
    intro:
      'Vos prestations et vos prix, vos réalisations en photos, et la réservation en ligne avec rappel la veille : moins de téléphone pendant les rendez-vous, moins de rendez-vous oubliés.',
    exemple: ['rdv', 'acompte', 'avantapres'],
  },
  liberal: {
    page: 'liberal',
    metier: 'liberal',
    public: 'Avocats, experts-comptables, notaires',
    intro:
      'Vos domaines d’intervention expliqués simplement, un formulaire pour être recontacté, la prise de rendez-vous si vous le souhaitez, et les mentions propres à votre profession. Sobre, clair, rassurant.',
    exemple: ['rdv', 'seo', 'anglais'],
  },
  cours: {
    page: 'cours',
    metier: 'cours',
    public: 'Coachs, professeurs, auto-écoles',
    intro:
      'Votre planning en ligne : vos élèves réservent leurs séances, paient à l’avance s’il le faut, et retrouvent leurs séances dans leur espace. Vous arrêtez de tout gérer par messages.',
    exemple: ['rdv', 'acompte', 'espace'],
  },
  hebergement: {
    page: 'hebergement',
    metier: 'hebergement',
    public: 'Gîtes et chambres d’hôtes',
    intro:
      'Vos chambres en grandes photos, vos disponibilités, la réservation et l’acompte en ligne, et une version anglaise pour les touristes. Les voyageurs réservent en direct, sans commission de plateforme.',
    exemple: ['rdv', 'acompte', 'anglais'],
  },
  association: {
    page: 'association',
    metier: 'association',
    public: 'Associations et clubs',
    intro:
      'Vos actualités et vos événements, les adhésions en ligne et un espace adhérents si besoin. Tarif adapté aux associations : demandez-le dans votre devis.',
    exemple: ['espace', 'boutique'],
  },
  evenementiel: {
    page: 'evenementiel',
    metier: 'evenementiel',
    public: 'Photographes, DJ, traiteurs',
    intro:
      'Votre portfolio en grand, vos formules, et une demande de date et de devis en un clic. Pour les photographes, une galerie privée par client.',
    exemple: ['calcul', 'espace', 'avis'],
  },
};


export const pagesMetier: Record<PageMetierId, PageMetier> = {
  artisan: {
    page: 'artisan',
    metier: 'artisan',
    public: 'Services à domicile',
    intro:
      'Detailing, ménage, réparation, jardinage… Vous êtes chez vos clients toute la journée : votre site prend les rendez-vous, demande un acompte et calcule vos prix pendant que vous travaillez.',
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
    public: 'Restaurants, kebabs et snacks',
    intro:
      'Pendant le rush, vous ne pouvez pas répondre au téléphone. Votre site montre la carte et les horaires, et vous la modifiez vous-même depuis votre téléphone, en quelques secondes.',
    exemple: ['table', 'clickcollect', 'avis'],
    exempleRestaurant: true,
  },
  independant: {
    page: 'independant',
    metier: 'sante',
    public: 'Santé et bien-être',
    intro:
      'Une présentation rassurante de votre pratique, et la prise de rendez-vous en ligne avec rappel la veille. Vous utilisez déjà Doctolib ? Votre site met en avant votre bouton Doctolib, sans rien changer à vos habitudes.',
    exemple: ['rdv', 'acompte', 'espace'],
    realisation: 'ordv',
  },
  ...pagesPersonas,
};


export const metierTextes = {
  fonctions: { title: 'Les fonctions utiles à votre métier' },
  exemple: {
    title: 'À quoi votre site pourrait ressembler',
    note: 'Entreprise fictive, pour l’exemple. Votre site est fait à vos couleurs, avec vos textes et vos photos.',
  },
  realisation: { title: 'Un projet proche du vôtre' },
  appel: {
    title: 'Voyons ce dont vous avez besoin.',
    text: 'Composez votre site option par option, ou parlons-en de vive voix : le rendez-vous découverte est gratuit.',
    composer: 'Demander un devis',
    rdv: { label: 'Prendre rendez-vous (gratuit)', to: pages.rendezVous.path },
  },
};
