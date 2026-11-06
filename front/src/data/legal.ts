import { formuleParId, mentionsPrix, tarifHoraire } from './offres';
import { contact } from './navigation';
import { CONSOMMATION_L_100KM, COUT_KM, PRIX_GAZOLE_LITRE, RAYON_KM, formatFrais, zoneSansFrais } from './zones';
import { pages } from './pages';

/**
 * Pages légales. Seuls des faits établis sont écrits ; tout le reste est marqué [à compléter].
 * À faire relire avant la mise en ligne publique.
 */
export type SectionLegale = { titre: string; paragraphes: string[] };
export type PageLegale = { intro: string; sections: SectionLegale[] };

const A_COMPLETER = (quoi: string) => `[${quoi} à compléter]`;

export const miseAJour = 'Dernière mise à jour : novembre 2026.';

export const mentionsLegales: PageLegale = {
  intro: 'Informations sur l’éditeur et l’hébergeur du site bsandoz.fr.',
  sections: [
    {
      titre: 'Éditeur du site',
      paragraphes: [
        'Baptiste Sandoz, création de sites web et informatique sur place.',
        `Statut : ${A_COMPLETER('statut juridique')}. SIRET : en cours d’immatriculation.`,
        `Adresse : ${contact.adresse.rue}, ${contact.adresse.codePostal} ${contact.adresse.ville}.`,
        `E-mail : ${contact.email}. Téléphone : ${contact.phone}.`,
        'Directeur de la publication : Baptiste Sandoz.',
      ],
    },
    {
      titre: 'Hébergeur',
      paragraphes: [`o2switch. ${A_COMPLETER('adresse et téléphone de l’hébergeur')}.`],
    },
    {
      titre: 'Propriété intellectuelle',
      paragraphes: [
        'Les textes, images et éléments graphiques de ce site appartiennent à Baptiste Sandoz, sauf mention contraire. Leur reproduction sans autorisation est interdite.',
      ],
    },
    {
      titre: 'Données personnelles',
      paragraphes: ['Leur traitement est décrit dans la politique de confidentialité.'],
    },
  ],
};

const vitrine = formuleParId('vitrine');
const vitrinePlus = formuleParId('vitrinePlus');
const fonctionnel = formuleParId('fonctionnel');

export const cgv: PageLegale = {
  intro: 'Conditions applicables aux prestations de Baptiste Sandoz : création de sites internet et informatique sur place.',
  sections: [
    {
      titre: 'Prix',
      paragraphes: [
        mentionsPrix.tva,
        'Les prix des formules et des options sont affichés sur la page Tarifs. Les prestations d’informatique sur place sont sur devis.',
      ],
    },
    {
      titre: 'Commande',
      paragraphes: ['La commande est confirmée par l’acceptation du devis.'],
    },
    {
      titre: 'Paiement',
      paragraphes: [
        `Un acompte est versé à la commande (${A_COMPLETER('montant ou pourcentage de l’acompte')}), le solde à la mise en ligne.`,
        `Moyens de paiement : ${A_COMPLETER('moyens de paiement acceptés')}.`,
      ],
    },
    {
      titre: 'Déplacements',
      paragraphes: [
        `Les déplacements sont gratuits dans un rayon de ${RAYON_KM} km autour ${zoneSansFrais()}.`,
        `Au-delà, seuls les kilomètres en plus sont facturés, au prix de l’essence : ${formatFrais(PRIX_GAZOLE_LITRE)} le litre pour ${CONSOMMATION_L_100KM.toLocaleString('fr-FR')} L aux 100 km, soit ${COUT_KM.toLocaleString('fr-FR', { maximumFractionDigits: 4 })} € le kilomètre (pour 100 km de distance, 50 km sont facturés). Le montant est annoncé avant le rendez-vous.`,
        'Ces frais sont dus même si aucun devis n’est accepté à la suite du déplacement.',
      ],
    },
    {
      titre: 'Délais',
      paragraphes: [
        `Délais indicatifs : ${vitrine.delai} pour une Vitrine, ${vitrinePlus.delai} pour une Vitrine+, ${fonctionnel.delai} pour un site fonctionnel.`,
      ],
    },
    {
      titre: 'Nom de domaine et hébergement',
      paragraphes: [
        'Avec la formule Vitrine, le nom de domaine et l’hébergement sont à la charge du client.',
        'Une formule hébergement + maintenance est disponible sur demande.',
      ],
    },
    {
      titre: 'Après la mise en ligne',
      paragraphes: [`Les modifications sont facturées ${tarifHoraire} € de l’heure, sans engagement ; toute demi-heure entamée est due.`],
    },
    {
      titre: 'Propriété du site',
      paragraphes: [
        `Le site appartient au client. ${A_COMPLETER('conditions de transfert (par exemple après paiement complet)')}.`,
        'Le site est livré complet, avec son code : le client peut le faire héberger, le modifier ou le confier à un autre prestataire, sans dépendre de Baptiste Sandoz.',
        A_COMPLETER(
          'clause sur les briques génériques réutilisées (blocs d’interface, modules) : le client en reçoit une copie qu’il peut utiliser et modifier librement, Baptiste Sandoz conserve le droit de les réutiliser pour d’autres projets ; formulation à faire valider par un professionnel du droit',
        ),
      ],
    },
    {
      titre: 'Droit de rétractation et médiation',
      paragraphes: [A_COMPLETER('droit de rétractation pour les particuliers et coordonnées du médiateur de la consommation')],
    },
  ],
};

export const confidentialite: PageLegale = {
  intro: 'Quelles données sont collectées sur ce site, pourquoi, et comment exercer vos droits.',
  sections: [
    {
      titre: 'Responsable du traitement',
      paragraphes: [`Baptiste Sandoz, joignable à ${contact.email}.`],
    },
    {
      titre: 'Données collectées',
      paragraphes: [
        'Uniquement celles que vous envoyez par la demande de devis : activité, besoins, description du projet, site que vous aimez, photos, budget, délai, nom, entreprise, e-mail et téléphone.',
        'Elles servent à répondre à votre demande et à établir un devis. Vous les envoyez après avoir donné votre accord.',
        'Pour un rendez-vous découverte : lieu (et adresse si je viens chez vous), date et heure, nom, téléphone, e-mail, activité et message. Elles servent uniquement à organiser le rendez-vous.',
        'Votre premier rendez-vous ouvre un espace client à votre adresse e-mail. Il contient votre nom, votre e-mail, les coordonnées que vous choisissez d’ajouter (entreprise, téléphone, adresse), votre préférence de notifications, votre mot de passe si vous en choisissez un (enregistré sous une forme chiffrée qui ne permet pas de le retrouver) et la liste de vos appareils connectés (navigateur et système, date de dernière activité).',
      ],
    },
    {
      titre: 'Espace client',
      paragraphes: [
        'Les messages échangés à propos de votre demande (écrits dans votre espace, ou réponses aux mails que je vous envoie) et mes notes d’appel y sont conservés avec elle. Ils figurent dans le téléchargement de vos données et sont effacés avec votre compte.',
        'La connexion à l’espace client repose sur un cookie de session, strictement nécessaire : sans lui, vous ne pourriez pas rester connecté. Il ne sert à rien d’autre et expire après 30 jours sans activité, ou dès que vous vous déconnectez.',
        'Depuis votre espace, vous pouvez à tout moment corriger vos informations, télécharger toutes vos données (fichier JSON) et supprimer votre compte. La suppression efface votre compte, vos rendez-vous et vos échanges ; seules les factures éventuelles sont conservées 10 ans, comme la loi l’impose.',
      ],
    },
    {
      titre: 'Destinataire',
      paragraphes: [
        'Votre demande m’est transmise par e-mail, via l’hébergeur o2switch. Elle n’est ni revendue ni utilisée à d’autres fins.',
        'Vous recevez une copie de votre demande en accusé de réception.',
      ],
    },
    {
      titre: 'Durée de conservation',
      paragraphes: [A_COMPLETER('durée de conservation des demandes')],
    },
    {
      titre: 'Données gardées dans votre navigateur',
      paragraphes: [
        'Vos choix dans « Composer mon site » et le brouillon de votre demande de devis sont gardés dans votre navigateur (stockage local), pour que vous ne perdiez rien. Ils restent sur votre appareil et ne me sont pas envoyés tant que vous n’envoyez pas votre demande.',
        'Votre choix de thème (nuit ou clair) y est aussi gardé, pour l’appliquer à votre prochaine visite.',
        'Vous pouvez les effacer à tout moment en supprimant les données de ce site dans votre navigateur.',
      ],
    },
    {
      titre: 'Cookies et services tiers',
      paragraphes: [
        'Ce site n’utilise aucun cookie publicitaire ni de mesure d’audience. Le seul cookie est celui de la session de l’espace client, quand vous vous y connectez.',
        'Les polices de caractères sont hébergées avec le site : aucun appel n’est fait à Google pour les afficher.',
        'Pour un rendez-vous chez vous, l’adresse saisie est envoyée au service public de géocodage de l’IGN (Géoplateforme) afin de calculer la distance depuis Amiens.',
        'La carte des zones d’intervention (accueil) vient d’OpenStreetMap : ses images sont chargées depuis ses serveurs, qui reçoivent votre adresse IP. Un bandeau en bas de l’écran vous laisse accepter ou refuser ; si vous refusez, la carte n’est pas chargée. Votre choix est gardé 6 mois dans votre navigateur (aucun cookie) ; si vous fermez le bandeau sans choisir, il revient à votre prochaine visite. Le lien « Services tiers », en bas de chaque page, permet de changer d’avis à tout moment.',
        'Quand la carte apparaît à l’écran, votre navigateur vous demande si vous acceptez de partager votre position. Si vous acceptez, elle sert uniquement, dans votre navigateur, à placer un point sur la carte et à calculer la distance jusqu’à ma zone : elle n’est ni envoyée, ni enregistrée.',
      ],
    },
    {
      titre: 'Protection contre les envois abusifs',
      paragraphes: [
        'Pour limiter les envois automatiques, une empreinte chiffrée de votre adresse IP est gardée une heure sur le serveur. L’adresse elle-même n’est pas enregistrée.',
      ],
    },
    {
      titre: 'Vos droits',
      paragraphes: [
        `Vous pouvez demander l’accès à vos données, leur correction, leur effacement ou leur portabilité, et vous opposer à leur traitement, en écrivant à ${contact.email}.`,
        'Vous pouvez aussi adresser une réclamation à la CNIL (cnil.fr).',
      ],
    },
  ],
};

export const pagesLegales = {
  mentionsLegales: { page: pages.mentionsLegales, contenu: mentionsLegales },
  cgv: { page: pages.cgv, contenu: cgv },
  confidentialite: { page: pages.confidentialite, contenu: confidentialite },
};

export type PageLegaleId = keyof typeof pagesLegales;
