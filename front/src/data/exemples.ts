import crm from '../assets/exemples/crm.webp';
import galerie from '../assets/exemples/galerie.webp';
import qr from '../assets/exemples/qr.webp';
import stocks from '../assets/exemples/stocks.webp';
import { pages } from './pages';
import type { CarteRealisation } from './realisations';

/**
 * Exemples d'outils que Baptiste sait faire, montrés dans la vitrine de l'accueil à côté des vraies réalisations.
 * Ce sont des maquettes : entreprises fictives, toujours marquées « Exemple », jamais présentées comme des clients.
 */
const lien = { label: 'Un outil comme celui-ci ?', to: pages.devis.path };

export const exemplesOutils: CarteRealisation[] = [
  {
    id: 'exemple-stocks',
    exemple: true,
    categorie: 'Commerce de bouche',
    titre: 'Stocks et dates limites',
    resume: 'Les produits, leurs lots et leurs DLC : ce qui est à écouler en premier saute aux yeux.',
    lien,
    apercu: 'site',
    emplacements: [],
    captures: [{ src: stocks, legende: 'Suivi des stocks et des DLC (exemple)' }],
  },
  {
    id: 'exemple-qr',
    exemple: true,
    categorie: 'Restauration',
    titre: 'Carte par QR code',
    resume: 'Un QR code sur chaque table, la carte du jour sur le téléphone, mise à jour en un instant.',
    lien,
    apercu: 'site',
    emplacements: [],
    captures: [{ src: qr, legende: 'Carte consultable par QR code (exemple)' }],
  },
  {
    id: 'exemple-crm',
    exemple: true,
    categorie: 'Entreprises',
    titre: 'Suivi des clients',
    resume: 'Fiches clients, devis envoyés, relances à faire : rien ne se perd entre deux chantiers.',
    lien,
    apercu: 'site',
    emplacements: [],
    captures: [{ src: crm, legende: 'Suivi des clients et des relances (exemple)' }],
  },
  {
    id: 'exemple-galerie',
    exemple: true,
    categorie: 'Photographes',
    titre: 'Galerie privée et vente',
    resume: 'Une galerie par client, ses favoris, et la commande des tirages en ligne.',
    lien,
    apercu: 'site',
    emplacements: [],
    captures: [{ src: galerie, legende: 'Galerie privée avec commande (exemple)' }],
  },
];
