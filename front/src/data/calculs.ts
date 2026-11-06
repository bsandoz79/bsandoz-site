/**
 * Calculs du configurateur : fonctions pures, sans état, entièrement testées.
 * Référence : logique de `docs/maquette/Configurateur.dc.html`.
 */
import {
  formatPrix,
  formuleParId,
  marche,
  options,
  optionsParFormule,
  optionsParMetier,
  packs,
  precisions,
  type FormuleId,
  type Marche,
  type MetierId,
  type OptionId,
  type Pack,
} from './offres';

/** Choix faits dans le configurateur. */
export type Configuration = {
  formule: FormuleId | null;
  metier: MetierId | null;
  options: OptionId[];
  /** Réponse choisie pour chaque sous-question (identifiant du choix). */
  precisions: Partial<Record<OptionId, string>>;
  /** Activité précisée quand `metier` vaut « autre ». */
  metierAutre?: string;
};

export const configurationVide: Configuration = { formule: null, metier: null, options: [], precisions: {} };

/** Options proposées pour une formule (et un métier, pour le Fonctionnel). */
export function optionsDisponibles(formule: FormuleId | null, metier: MetierId | null): OptionId[] {
  if (!formule) return [];
  if (formule === 'fonctionnel') return metier ? optionsParMetier[metier] : [];
  return optionsParFormule[formule];
}

/** Ne garde que les options encore proposées après un changement de formule ou de métier. */
export function garderOptionsValides(choix: OptionId[], formule: FormuleId | null, metier: MetierId | null) {
  const disponibles = optionsDisponibles(formule, metier);
  return choix.filter((id) => disponibles.includes(id));
}

export type PackActif = {
  pack: Pack;
  offerte: OptionId;
  valeur: number;
  /** L'option offerte était déjà choisie : elle devient gratuite. */
  dejaChoisie: boolean;
};

/** Packs dont toutes les options requises sont choisies. Une même option n'est offerte qu'une fois. */
export function packsActifs(choix: OptionId[]): PackActif[] {
  const offertes = new Set<OptionId>();
  const actifs: PackActif[] = [];
  for (const pack of packs) {
    if (!pack.requises.every((id) => choix.includes(id)) || offertes.has(pack.offerte)) continue;
    offertes.add(pack.offerte);
    actifs.push({
      pack,
      offerte: pack.offerte,
      valeur: options[pack.offerte].prix,
      dejaChoisie: choix.includes(pack.offerte),
    });
  }
  return actifs;
}

export type Ligne = { libelle: string; prix: number; offerte?: boolean };

export type Estimation = {
  lignes: Ligne[];
  /** Valeur totale, options offertes comprises (prix barré). */
  valeur: number;
  /** Montant offert par les packs. */
  offert: number;
  /** Prix à payer. */
  total: number;
  /** Fourchette (−5 % / +10 %, arrondie à 10 €), seulement pour le Fonctionnel. */
  fourchette: { bas: number; haut: number } | null;
  delai: string | null;
  packs: PackActif[];
};

const arrondi10 = (montant: number) => Math.round(montant / 10) * 10;

/** Estimation détaillée d'une configuration. */
export function calculerEstimation(config: Configuration): Estimation {
  const lignes: Ligne[] = [];
  let total = 0;

  if (config.formule) {
    const formule = formuleParId(config.formule);
    total += formule.prix;
    lignes.push({ libelle: `Site ${formule.nom}`, prix: formule.prix });
  }

  for (const id of config.options) {
    const option = options[id];
    total += option.prix;
    lignes.push({ libelle: option.nom, prix: option.prix });
    const precision = precisions[id];
    const choix = precision?.choix.find((c) => c.id === config.precisions[id]);
    if (choix?.prix) {
      total += choix.prix;
      lignes.push({ libelle: `${option.nom} · ${choix.label}`, prix: choix.prix });
    }
  }

  const actifs = packsActifs(config.options);
  let valeur = total;
  let offert = 0;
  for (const actif of actifs) {
    offert += actif.valeur;
    if (!actif.dejaChoisie) {
      valeur += actif.valeur;
      lignes.push({ libelle: options[actif.offerte].nom, prix: actif.valeur, offerte: true });
    }
  }
  total = valeur - offert;

  return {
    lignes,
    valeur,
    offert,
    total,
    // Le bas de la fourchette ne descend jamais sous le prix plancher de la formule (« dès 989 € »).
    fourchette:
      config.formule === 'fonctionnel'
        ? {
            bas: Math.max(arrondi10(total * 0.95), formuleParId('fonctionnel').prix),
            haut: arrondi10(total * 1.1),
          }
        : null,
    delai: config.formule ? formuleParId(config.formule).delai : null,
    packs: actifs,
  };
}

export type Suggestion = {
  titre: string;
  texte: string;
  libelle: string;
  action: { type: 'option'; option: OptionId } | { type: 'formule'; formule: FormuleId };
};

/**
 * Suggestions personnalisées (2 au plus) : d'abord les packs presque complets,
 * puis les montées en gamme et les options utiles selon les choix.
 */
export function suggestions(config: Configuration): Suggestion[] {
  const { formule, metier } = config;
  const choisie = (id: OptionId) => config.options.includes(id);
  const disponibles = optionsDisponibles(formule, metier);
  const proposee = (id: OptionId) => disponibles.includes(id);
  const liste: Suggestion[] = [];

  // Options déjà mises en avant (offertes par un pack, ou proposées une fois).
  const dejaProposees = new Set<OptionId>(packsActifs(config.options).map((actif) => actif.offerte));

  for (const pack of packs) {
    const manquantes = pack.requises.filter((id) => !choisie(id));
    if (manquantes.length !== 1 || !pack.requises.every(proposee)) continue;
    const [manquante] = manquantes;
    if (dejaProposees.has(manquante)) continue;
    dejaProposees.add(manquante);
    const offerte = options[pack.offerte];
    liste.push({
      titre: pack.nom,
      texte: `Ajoutez « ${options[manquante].nom} » et je vous offre « ${offerte.nom} » (valeur ${formatPrix(offerte.prix)}).`,
      libelle: "Ajouter et profiter de l'offre",
      action: { type: 'option', option: manquante },
    });
  }

  const ajouter = (option: OptionId, titre: string, texte: string, libelle: string) => {
    if (!proposee(option) || choisie(option) || dejaProposees.has(option)) return;
    dejaProposees.add(option);
    liste.push({ titre, texte, libelle, action: { type: 'option', option } });
  };
  const monter = (vers: FormuleId, titre: string, texte: string, libelle: string) =>
    liste.push({ titre, texte, libelle, action: { type: 'formule', formule: vers } });

  if (formule === 'vitrine' && metier) {
    monter(
      'vitrinePlus',
      "Un formulaire et jusqu'à 5 pages ?",
      'Vitrine+ ajoute le contact, la galerie et le référencement local.',
      `Passer à Vitrine+ (${formatPrix(formuleParId('vitrinePlus').prix)})`,
    );
  }
  if (formule === 'vitrinePlus' && (metier === 'artisan' || metier === 'sante')) {
    monter(
      'fonctionnel',
      'Et si vos clients réservaient seuls ?',
      'Avec le Fonctionnel, la prise de rendez-vous travaille pour vous, même la nuit.',
      'Voir le Fonctionnel',
    );
  }
  if (formule === 'vitrinePlus' && metier === 'commerce') {
    monter('fonctionnel', 'Vendre aussi en ligne ?', 'Le Fonctionnel ajoute une boutique simple à gérer.', 'Voir le Fonctionnel');
  }
  if (formule === 'vitrinePlus' && metier === 'restaurant') {
    monter(
      'fonctionnel',
      'Des réservations sans téléphone ?',
      'Le Fonctionnel ajoute la réservation de table et le click & collect.',
      'Voir le Fonctionnel',
    );
  }
  if (choisie('rdv')) {
    ajouter(
      'acompte',
      'Des clients qui ne viennent pas ?',
      'Un acompte en ligne au moment de réserver règle le problème.',
      `Ajouter l'acompte (+ ${formatPrix(options.acompte.prix)})`,
    );
  }
  if (choisie('rdv') || choisie('table')) {
    ajouter(
      'pwa',
      'Pour vos clients fidèles',
      "Ils réservent depuis l'écran d'accueil de leur téléphone.",
      `Ajouter l'appli (+ ${formatPrix(options.pwa.prix)})`,
    );
  }
  if (choisie('boutique')) {
    ajouter(
      'seo',
      'Être trouvé sur vos produits',
      'Le SEO avancé travaille vos pages produits et votre ville.',
      `Ajouter le SEO avancé (+ ${formatPrix(options.seo.prix)})`,
    );
  }
  if (choisie('calcul')) {
    ajouter(
      'avantapres',
      'Montrez vos résultats',
      'Un avant / après rassure juste avant de réserver.',
      `Ajouter l'avant / après (+ ${formatPrix(options.avantapres.prix)})`,
    );
  }
  if (choisie('table') || choisie('clickcollect')) {
    ajouter(
      'avis',
      'Vos avis Google',
      'Les étoiles sur votre site donnent envie de venir.',
      `Ajouter les avis (+ ${formatPrix(options.avis.prix)})`,
    );
  }
  if (choisie('acompte')) {
    ajouter(
      'espace',
      'Un espace pour vos clients',
      'Ils retrouvent leurs rendez-vous, acomptes et factures.',
      `Ajouter l'espace client (+ ${formatPrix(options.espace.prix)})`,
    );
  }

  return liste.slice(0, 2);
}

export type Comparaison = {
  marche: Marche;
  /** Hauteur des barres, en % du haut de la fourchette du marché (4 % minimum pour rester visible). */
  pourcentBas: number;
  pourcentMonPrix: number;
  phrase: string;
};

const pourcent = (montant: number, haut: number) => Math.max(4, Math.min(100, Math.round((montant / haut) * 100)));

/** Compare le prix à la fourchette du marché correspondant à la formule (et à la boutique). */
export function comparaisonMarche(formule: FormuleId | null, choix: OptionId[], total: number): Comparaison | null {
  if (!formule) return null;
  const reference =
    formule === 'fonctionnel' ? marche[choix.includes('boutique') ? 'boutique' : 'surMesure'] : marche[formule];
  return {
    marche: reference,
    pourcentBas: pourcent(reference.bas, reference.haut),
    pourcentMonPrix: pourcent(total, reference.haut),
    phrase:
      total < reference.bas
        ? `Soit ${formatPrix(reference.bas - total)} de moins que le bas de la fourchette du marché.`
        : 'Dans la fourchette du marché, avec un seul interlocuteur local.',
  };
}
