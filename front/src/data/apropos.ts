import { pourquoi } from './accueil';
import { contact } from './navigation';
import { pages } from './pages';

/** Textes de la page À propos (cahier des charges, section 3 : photo, parcours, valeurs, zone). */
export const aPropos = {
  intro:
    'Je suis Baptiste Sandoz, développeur web à Amiens. Je crée des sites et des outils simples pour les artisans, commerçants et indépendants qui ont un vrai métier à côté.',
  photo: 'Baptiste Sandoz, développeur web à Amiens',
  photoLegende: 'Baptiste · développeur à Amiens',
  parcours: {
    titre: 'Mon parcours',
    paragraphes: [
      'Formé au développement à Amiens, j’ai obtenu un BTS SIO option SLAM en 2025, puis un Bachelor informatique et le titre de Concepteur Développeur d’Applications (Bac+3) à l’école iT. Je poursuis aujourd’hui avec un Mastère Expert DevOps à l’EPSI d’Arras.',
      'En entreprise, j’ai conçu un site e-commerce de A à Z chez Devisse Informatique à Abbeville, du cahier des charges à la mise en ligne, avec le paiement et le référencement. J’ai aussi créé une interface web pour piloter les serveurs de l’UFR des Sciences d’Amiens, puis travaillé en alternance comme développeur full stack (React, Symfony) chez La Brosse & Dupont.',
      'En parallèle de mes études, j’ai fait trois saisons en snack-bar et huit mois chez McDonald’s : le service, le rythme, les stocks et les clients, je sais ce que c’est.',
    ],
    portfolio: { label: 'Voir mon parcours et mes compétences sur mon portfolio', href: contact.portfolio },
  },
  valeurs: { titre: 'Ce qui compte pour moi', items: pourquoi.items },
  zone: {
    titre: 'Où j’interviens',
    items: [
      'Basé à Amiens, dans la Somme.',
      'Je me déplace sans frais dans un rayon de 50 km autour d’Amiens et d’Abbeville pour les rendez-vous et l’informatique sur place ; plus loin, seuls les kilomètres en plus sont facturés.',
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
