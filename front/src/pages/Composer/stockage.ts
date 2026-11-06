import { configurationVide, garderOptionsValides, type Configuration } from '../../data/calculs';
import {
  publicsInformatique,
  servicesInformatique,
  type PublicInformatique,
  type ServiceInformatiqueId,
} from '../../data/informatique';
import { formules, metierAutreTextes, metiers, options, precisions, type FormuleId, type MetierId, type OptionId } from '../../data/offres';

export type Onglet = 'web' | 'informatique';

/** Tout ce que la personne a choisi dans le configurateur. */
export type EtatComposer = {
  onglet: Onglet;
  config: Configuration;
  informatique: { public: PublicInformatique | null; services: ServiceInformatiqueId[] };
};

export const etatVide: EtatComposer = {
  onglet: 'web',
  config: configurationVide,
  informatique: { public: null, services: [] },
};

/** Clé du navigateur : la configuration est reprise par le parcours de devis. */
export const CLE_STOCKAGE = 'bsandoz.composer';

const estFormule = (v: unknown): v is FormuleId => formules.some((f) => f.id === v);
const estMetier = (v: unknown): v is MetierId => metiers.some((m) => m.id === v);
const estOption = (v: unknown): v is OptionId => typeof v === 'string' && v in options;
const estService = (v: unknown): v is ServiceInformatiqueId =>
  servicesInformatique.some((s) => s.id === v && !s.bientot);
const estPublic = (v: unknown): v is PublicInformatique => publicsInformatique.some((p) => p.id === v);

/** Relit et valide un état enregistré : toute valeur inconnue est ignorée. */
export function lireEtat(brut: unknown): EtatComposer {
  if (!brut || typeof brut !== 'object') return etatVide;
  const objet = brut as Record<string, unknown>;
  const config = (objet.config ?? {}) as Record<string, unknown>;
  const info = (objet.informatique ?? {}) as Record<string, unknown>;

  const formule = estFormule(config.formule) ? config.formule : null;
  const metier = estMetier(config.metier) ? config.metier : null;
  const choix = Array.isArray(config.options) ? config.options.filter(estOption) : [];
  const reponses: Configuration['precisions'] = {};
  if (config.precisions && typeof config.precisions === 'object') {
    for (const [id, valeur] of Object.entries(config.precisions as Record<string, unknown>)) {
      if (estOption(id) && precisions[id]?.choix.some((c) => c.id === valeur)) reponses[id] = valeur as string;
    }
  }

  return {
    onglet: objet.onglet === 'informatique' ? 'informatique' : 'web',
    config: {
      formule,
      metier,
      options: garderOptionsValides([...new Set(choix)], formule, metier),
      precisions: reponses,
      ...(metier === 'autre' && typeof config.metierAutre === 'string' && config.metierAutre.trim()
        ? { metierAutre: config.metierAutre.slice(0, metierAutreTextes.max) }
        : {}),
    },
    informatique: {
      public: estPublic(info.public) ? info.public : null,
      services: Array.isArray(info.services) ? [...new Set(info.services.filter(estService))] : [],
    },
  };
}

/** Lit l'état enregistré dans le navigateur (vide si absent, illisible ou bloqué). */
export function chargerEtat(): EtatComposer {
  try {
    const texte = window.localStorage.getItem(CLE_STOCKAGE);
    return texte ? lireEtat(JSON.parse(texte)) : etatVide;
  } catch {
    return etatVide;
  }
}

/** Enregistre l'état dans le navigateur ; sans effet si le stockage est bloqué. */
export function enregistrerEtat(etat: EtatComposer) {
  try {
    window.localStorage.setItem(CLE_STOCKAGE, JSON.stringify(etat));
  } catch {
    // Navigation privée ou stockage bloqué : la configuration reste en mémoire seulement.
  }
}

/** Onglet demandé dans l'adresse (`/composer?onglet=informatique`), si il existe. */
export function ongletDepuisAdresse(recherche: string): Onglet | null {
  const valeur = new URLSearchParams(recherche).get('onglet');
  return valeur === 'web' || valeur === 'informatique' ? valeur : null;
}

/** Formule demandée dans l'adresse (`/composer?formule=vitrine`), si elle existe. */
export function formuleDepuisAdresse(recherche: string): FormuleId | null {
  const valeur = new URLSearchParams(recherche).get('formule');
  return estFormule(valeur) ? valeur : null;
}

/** Métier demandé dans l'adresse (`/composer?metier=artisan`), si il existe. */
export function metierDepuisAdresse(recherche: string): MetierId | null {
  const valeur = new URLSearchParams(recherche).get('metier');
  return estMetier(valeur) ? valeur : null;
}

/**
 * Applique l'adresse à l'état enregistré : `?onglet=`, `?formule=` et `?metier=`.
 * Une formule ou un métier ramène sur l'onglet des sites ; les options incompatibles sont retirées.
 */
export function etatDepuisAdresse(etat: EtatComposer, recherche: string): EtatComposer {
  const onglet = ongletDepuisAdresse(recherche);
  const formule = formuleDepuisAdresse(recherche) ?? etat.config.formule;
  const metier = metierDepuisAdresse(recherche) ?? etat.config.metier;
  const changeConfig = formule !== etat.config.formule || metier !== etat.config.metier;
  if (!changeConfig) return onglet ? { ...etat, onglet } : etat;
  return {
    ...etat,
    onglet: 'web',
    config: { ...etat.config, formule, metier, options: garderOptionsValides(etat.config.options, formule, metier) },
  };
}
