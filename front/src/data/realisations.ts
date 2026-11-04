/** Réalisations présentées (cahier des charges, section 9). Captures à ajouter. */
export type Realisation = {
  id: string;
  /** Métier ou type de projet. */
  categorie: string;
  titre: string;
  resume: string;
  lien: { label: string; to: string };
  /** Illustration provisoire en attendant les captures. */
  apercu: 'site' | 'telephones' | 'plateforme';
  /** Textes des emplacements de captures. */
  emplacements: string[];
  /** Étude de cas (page Réalisations) : à compléter avec le client, rien n'est inventé. */
  besoin: string;
  solution: string;
};

const A_COMPLETER = '[à compléter]';

/** Textes de la page Réalisations. */
export const pageRealisations = {
  intro: 'Des projets concrets : le besoin de départ, la solution apportée, des captures et, quand c’est possible, une démo à tester.',
  besoin: 'Le besoin',
  solution: 'La solution',
  captures: 'Captures',
  appel: { text: 'Un projet du même genre ?', label: 'Composer mon site', to: '/composer' },
};

export const realisations: Realisation[] = [
  {
    id: 'christophe-poix-moto',
    categorie: 'Réparation moto à domicile',
    titre: 'Christophe Poix Moto',
    resume: 'Un site une page, rapide et clair sur téléphone, pour être trouvé et contacté en un geste.',
    lien: { label: 'Voir le projet', to: '/realisations#christophe-poix-moto' },
    apercu: 'site',
    emplacements: ['[capture du site]'],
    besoin: A_COMPLETER,
    solution: A_COMPLETER,
  },
  {
    id: 'demo-detailing',
    categorie: 'Detailing auto à domicile · démo',
    titre: 'Réservation avec acompte',
    resume: 'Configurateur de prestation, calendrier du mois, frais selon la distance et acompte en ligne.',
    lien: { label: 'Voir la démo', to: '/realisations#demo-detailing' },
    apercu: 'telephones',
    emplacements: ['[écran réservation]', '[écran acompte]'],
    besoin: A_COMPLETER,
    solution: A_COMPLETER,
  },
  {
    id: 'ordv',
    categorie: 'Plateforme de réservation',
    titre: "O'RDV",
    resume: 'Des indépendants proposent leurs créneaux, les clients trouvent et réservent. Espaces client et pro.',
    lien: { label: 'Découvrir le projet', to: '/realisations#ordv' },
    apercu: 'plateforme',
    emplacements: ['[recherche de professionnels]'],
    besoin: A_COMPLETER,
    solution: A_COMPLETER,
  },
];
