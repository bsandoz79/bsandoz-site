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
};

export const realisations: Realisation[] = [
  {
    id: 'christophe-poix-moto',
    categorie: 'Réparation moto à domicile',
    titre: 'Christophe Poix Moto',
    resume: 'Un site une page, rapide et clair sur téléphone, pour être trouvé et contacté en un geste.',
    lien: { label: 'Voir le projet', to: '/realisations' },
    apercu: 'site',
    emplacements: ['[capture du site]'],
  },
  {
    id: 'demo-detailing',
    categorie: 'Detailing auto à domicile · démo',
    titre: 'Réservation avec acompte',
    resume: 'Configurateur de prestation, calendrier du mois, frais selon la distance et acompte en ligne.',
    lien: { label: 'Voir la démo', to: '/realisations' },
    apercu: 'telephones',
    emplacements: ['[écran réservation]', '[écran acompte]'],
  },
  {
    id: 'ordv',
    categorie: 'Plateforme de réservation',
    titre: "O'RDV",
    resume: 'Des indépendants proposent leurs créneaux, les clients trouvent et réservent. Espaces client et pro.',
    lien: { label: 'Découvrir le projet', to: '/realisations' },
    apercu: 'plateforme',
    emplacements: ['[recherche de professionnels]'],
  },
];
