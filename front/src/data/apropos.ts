import { pourquoi } from './accueil';
import { contact } from './navigation';
import { pages } from './pages';

/** Textes de la page À propos (cahier des charges, section 3 : photo, parcours, valeurs, zone). */
export const aPropos = {
  intro:
    'Je suis Baptiste Sandoz, développeur web à Amiens. Je crée des sites et des outils simples pour les artisans, commerçants et indépendants qui ont un vrai métier à côté.',
  photo: '[photo à compléter]',
  photoLegende: 'Baptiste · développeur à Amiens',
  parcours: {
    titre: 'Mon parcours',
    texte: '[parcours à compléter]',
    portfolio: { label: 'Voir mon parcours et mes compétences sur mon portfolio', href: contact.portfolio },
  },
  valeurs: { titre: 'Ce qui compte pour moi', items: pourquoi.items },
  zone: {
    titre: 'Où j’interviens',
    items: [
      'Basé à Amiens, dans la Somme.',
      'Je me déplace dans un rayon de 50 km autour d’Amiens pour les rendez-vous et l’informatique sur place.',
      'Pour les sites, je travaille aussi à distance, partout en France.',
    ],
  },
  appel: {
    titre: 'On en parle ?',
    texte: 'Le rendez-vous découverte est gratuit : chez vous autour d’Amiens, en visio ou par téléphone.',
    rdv: { label: 'Prendre rendez-vous (gratuit)', to: pages.rendezVous.path },
    devis: { label: 'Décrire mon projet', to: pages.devis.path },
  },
};
