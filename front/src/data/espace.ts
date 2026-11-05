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
  compte: {
    bonjour: (nom: string) => (nom ? `Bonjour ${nom}` : 'Bonjour'),
    aVenir: 'Bientôt ici : vos demandes, vos devis et vos rendez-vous.',
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

/** Date lisible : « 5 novembre 2026 ». */
export function dateLisible(iso: string | null | undefined) {
  if (!iso) return '';
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));
}
