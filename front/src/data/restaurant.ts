/**
 * Page « Site pour restaurant » : ce qui compte pour un restaurant, un kebab ou un snack, et un exemple de site
 * (entreprise fictive, plats et prix pour l'exemple seulement, toujours annoncés comme tels).
 */
export const exempleRestaurant = {
  titre: 'Pour un restaurant, un kebab ou un snack',
  points: [
    {
      titre: 'Votre carte, modifiée depuis votre téléphone',
      texte: 'Un prix change, un plat est épuisé : vous le corrigez en quelques secondes, sans m’appeler.',
    },
    {
      titre: 'Un QR code pour vos tables et votre vitrine',
      texte: 'Vos clients ouvrent la carte sur leur téléphone, et c’est toujours la bonne.',
    },
    {
      titre: 'Appeler et venir en un clic',
      texte: 'Bouton « Appeler », itinéraire, horaires et jours de fermeture bien visibles.',
    },
    {
      titre: 'La commande à emporter, si vous le voulez',
      texte: 'Vos clients commandent et passent récupérer au bon moment.',
    },
  ],
  note: 'Entreprise fictive, pour l’exemple. Votre site est fait à vos couleurs, avec votre carte et vos photos.',
  /** Téléphone d'exemple. */
  site: {
    nom: 'Le Comptoir Kebab',
    lieu: 'Amiens · centre-ville',
    statut: 'Ouvert · jusqu’à 23 h',
    actions: ['Appeler', 'Itinéraire', 'À emporter'],
    categories: [
      {
        titre: 'Sandwichs',
        plats: [
          { nom: 'Kebab classique', detail: 'Viande, salade, tomate, oignon, sauce au choix', prix: '7,50 €' },
          { nom: 'Galette poulet', detail: 'Poulet mariné, crudités, sauce blanche', prix: '8 €' },
        ],
      },
      {
        titre: 'Assiettes',
        plats: [{ nom: 'Assiette kebab', detail: 'Frites, salade, pain maison', prix: '11 €' }],
      },
      {
        titre: 'Menus',
        plats: [{ nom: 'Menu sandwich', detail: 'Sandwich, frites, boisson', prix: '10 €' }],
      },
    ],
    maj: 'Carte mise à jour aujourd’hui',
  },
};
