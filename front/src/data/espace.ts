import { pages } from './pages';

/** Longueur minimale d'un mot de passe : la même règle que l'API (module Auth). */
export const MOT_DE_PASSE_MIN = 12;

/** Textes de l'espace client : connexion, lien reçu par mail, mot de passe, compte (cahier des charges, section 8). */
export const espaceTextes = {
  chargement: 'Chargement…',
  erreurReseau: 'Le serveur ne répond pas. Vérifiez votre connexion et réessayez dans un instant.',
  tropDEssais: 'Trop d’essais. Patientez quelques minutes avant de réessayer.',
  connexion: {
    intro: 'Suivez vos demandes, vos devis et vos rendez-vous.',
    email: 'E-mail',
    motDePasse: 'Mot de passe',
    seConnecter: 'Se connecter',
    enCours: 'Connexion…',
    incorrect: 'E-mail ou mot de passe incorrect.',
    oubli: { label: 'Mot de passe oublié ?', to: pages.motDePasse.path },
    lien: {
      titre: 'Sans mot de passe',
      texte: 'Recevez un lien de connexion par mail, valable 15 minutes.',
      bouton: 'Recevoir un lien de connexion',
      envoye: (email: string) =>
        `Si un compte existe pour ${email}, un lien de connexion vient de partir. Pensez à vérifier vos indésirables.`,
    },
    premiereFois:
      'Votre espace est créé avec votre première demande ou votre premier rendez-vous : un lien d’activation vous est alors envoyé par mail.',
  },
  lien: {
    absent: 'Ce lien est incomplet. Ouvrez-le directement depuis le mail reçu.',
    invalide: 'Ce lien a expiré ou a déjà servi.',
    nouveau: { label: 'Recevoir un nouveau lien', to: pages.connexion.path },
  },
  motDePasse: {
    demande: {
      intro: 'Indiquez votre e-mail : je vous envoie un lien sécurisé, valable 1 heure, pour choisir un nouveau mot de passe.',
      bouton: 'Recevoir le lien par mail',
      envoye: (email: string) =>
        `Si un compte existe pour ${email}, un lien vient de partir. Il est valable 1 heure. Pensez à vérifier vos indésirables.`,
    },
    nouveau: 'Nouveau mot de passe',
    aide: `${MOT_DE_PASSE_MIN} caractères au moins. Une phrase facile à retenir convient très bien.`,
    confirmation: 'Confirmez le mot de passe',
    enregistrer: 'Enregistrer le mot de passe',
    tropCourt: `Le mot de passe doit contenir au moins ${MOT_DE_PASSE_MIN} caractères.`,
    different: 'Les deux mots de passe ne sont pas identiques.',
    enregistre: 'Votre mot de passe est enregistré. Vos appareils ont été déconnectés : connectez-vous avec votre nouveau mot de passe.',
    seConnecter: { label: 'Se connecter', to: pages.connexion.path },
  },
  rendezVous: {
    titre: 'Mes rendez-vous',
    aucun: 'Aucun rendez-vous pour le moment.',
    prendre: { label: 'Prendre rendez-vous (gratuit)', to: pages.rendezVous.path },
    type: 'Rendez-vous découverte',
    passes: 'Rendez-vous passés et annulés',
    annule: 'annulé',
    agenda: 'Ajouter à l’agenda',
    deplacer: { label: 'Déplacer', to: pages.rendezVous.path },
    deplacerAide: 'Pour déplacer : choisissez un nouveau créneau, puis annulez celui-ci.',
    annuler: 'Annuler',
    confirmer: 'Confirmer l’annulation',
    garder: 'Garder le rendez-vous',
    annuleOk: 'Le rendez-vous est annulé. Un e-mail de confirmation vous a été envoyé.',
    echec: 'L’annulation n’a pas abouti. Réessayez, ou répondez au mail de confirmation.',
  },
  demandes: {
    titre: 'Mes demandes',
    aucune: 'Aucune demande de devis pour le moment.',
    nouvelle: { label: 'Nouvelle demande', to: pages.devis.path },
    entete: (numero: string, date: string) => `Demande n° ${numero} · envoyée le ${date}`,
    etapes: 'Avancement',
    devis: (numero: string) => `Devis n° ${numero}`,
    total: 'Total',
    accepter: 'Accepter le devis',
    confirmer: 'Oui, j’accepte ce devis',
    garder: 'Pas maintenant',
    accepteLe: (date: string) => `Devis accepté le ${date}. Merci !`,
    acceptationOk: 'C’est noté : votre devis est accepté. Je reviens vers vous très vite pour la suite.',
    echec: 'L’acceptation n’a pas abouti. Réessayez, ou répondez au mail du devis.',
    pdf: 'PDF',
    mentions: 'Prix nets, TVA non applicable (art. 293 B du CGI).',
  },
  monCompte: {
    titre: 'Mon compte',
    nom: 'Prénom et nom',
    entreprise: 'Entreprise',
    telephone: 'Téléphone',
    adresse: 'Adresse',
    enregistrer: 'Enregistrer',
    enregistre: 'Vos informations sont enregistrées.',
    email: 'E-mail',
    changerEmail: 'Changer d’e-mail',
    nouvelEmail: 'Nouvelle adresse e-mail',
    envoyerLien: 'Envoyer le lien de confirmation',
    emailAide: 'Changer d’e-mail envoie un lien de confirmation à la nouvelle adresse.',
    lienEnvoye: (email: string) =>
      `Un lien de confirmation vient de partir à ${email}. Votre adresse actuelle reste valable tant qu’il n’est pas ouvert.`,
  },
  confidentialite: {
    titre: 'Confidentialité et préférences',
    localisation: 'Localisation',
    localisationAide:
      'Elle sert seulement à vérifier si je peux me déplacer chez vous (50 km autour d’Amiens) et à pré-remplir votre adresse.',
    etats: {
      granted: 'Autorisée.',
      denied: 'Désactivée : vous l’avez refusée.',
      prompt: 'Pas encore demandée.',
      inconnu: 'Votre navigateur ne permet pas de connaître ce réglage.',
    },
    autoriser: 'Autoriser la localisation',
    aideNavigateur:
      'Si votre navigateur bloque la demande : icône cadenas à gauche de l’adresse du site → Autorisations → Position → Autoriser.',
    notifications: 'Rappels et notifications par mail',
    notificationsAide: 'Rappel la veille d’un rendez-vous, nouvelles réponses.',
    preferencesEnregistrees: 'Préférence enregistrée.',
    donnees: 'Mes données',
    donneesAide: 'Téléchargez tout ce que j’ai sur vous : compte, appareils connectés, rendez-vous.',
    telecharger: 'Télécharger mes données',
  },
  zoneDanger: {
    titre: 'Zone danger',
    supprimer: 'Supprimer mon compte',
    texte:
      'Vos informations, rendez-vous et échanges seront effacés définitivement. Les factures sont conservées 10 ans, comme la loi l’impose. Un mail de confirmation vous sera envoyé.',
    confirmer: 'Oui, m’envoyer le mail de confirmation',
    garder: 'Garder mon compte',
    envoye: (email: string) => `Un mail de confirmation vient de partir à ${email}. Le lien est valable 1 heure.`,
  },
  confirmerEmail: {
    ok: (email: string) => `C’est fait : votre espace client utilise désormais ${email}.`,
    refuse: 'Cette adresse est déjà utilisée par un autre compte.',
    espace: { label: 'Aller à mon espace', to: pages.monEspace.path },
  },
  suppression: {
    avertissement:
      'Vous êtes sur le point de supprimer définitivement votre espace client : vos informations, vos rendez-vous et vos échanges seront effacés. Les rendez-vous à venir seront annulés.',
    bouton: 'Supprimer définitivement mon compte',
    garder: { label: 'Garder mon compte', to: pages.monEspace.path },
    fait: 'Votre compte est supprimé. Un mail de confirmation vous a été envoyé. Merci de votre confiance.',
    accueil: { label: 'Retour à l’accueil', to: pages.accueil.path },
  },
  compte: {
    bonjour: (nom: string) => (nom ? `Bonjour ${nom}` : 'Bonjour'),
    deconnexion: 'Se déconnecter',
    securite: 'Sécurité',
    motDePasse: 'Mot de passe',
    sansMotDePasse: 'Vous n’avez pas encore de mot de passe : vous vous connectez par un lien reçu par mail.',
    modifieLe: (date: string) => `Modifié le ${date}.`,
    lienSecurise: 'Pour le choisir ou le changer, je vous envoie un lien sécurisé par mail (valable 1 h).',
    recevoirLien: 'Recevoir le lien par mail',
    lienEnvoye: (email: string) => `Lien envoyé à ${email}. Pensez à vérifier vos indésirables.`,
    appareils: 'Appareils connectés',
    cetAppareil: 'cet appareil',
    actifLe: (date: string) => `actif le ${date}`,
    deconnecterAutres: 'Déconnecter les autres appareils',
    autresDeconnectes: (n: number) =>
      n === 0 ? 'Aucun autre appareil n’était connecté.' : n === 1 ? '1 appareil a été déconnecté.' : `${n} appareils ont été déconnectés.`,
  },
};

/** Jour d'un rendez-vous : « Mardi 17 novembre » (date AAAA-MM-JJ, sans fuseau horaire). */
export function jourLisible(jour: string) {
  const [annee, mois, j] = jour.split('-').map(Number);
  const texte = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(
    new Date(Date.UTC(annee, mois - 1, j)),
  );
  return texte.charAt(0).toUpperCase() + texte.slice(1);
}

/** Date lisible : « 5 novembre 2026 ». */
export function dateLisible(iso: string | null | undefined) {
  if (!iso) return '';
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));
}
