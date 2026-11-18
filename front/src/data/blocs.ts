import { autonomie, comparatif, hero, livraison, methode, metiers, realisationsSection } from './accueil';
import { contactRapide } from './contact';
import { faqAccueil, questionsFaq } from './faq';
import { medias } from './medias';
import { formules } from './offres';
import { pages } from './pages';
import { carteTextes } from './zones';

/**
 * Registre des blocs modifiables : pour chaque bloc, tout ce qu'il contient.
 * Les pages lisent leurs données à l'affichage : changer une valeur ici change la page.
 */
export type TypeChamp = 'texte' | 'long' | 'image' | 'prix';

export type Champ = {
  /** `accueil.hero.badge`, ou `formule.vitrine` pour un prix. */
  cle: string;
  libelle: string;
  type: TypeChamp;
  /** Valeur écrite dans le code : y revenir efface la modification. */
  base: string;
  lire: () => string;
  ecrire: (valeur: string) => void;
};

export type Bloc = { titre: string; champs: Champ[] };

type Conteneur = Record<string | number, unknown>;

function champ(cle: string, libelle: string, objet: object, prop: string | number, type: TypeChamp = 'texte'): Champ {
  const cible = objet as Conteneur;
  return {
    cle,
    libelle,
    type,
    base: String(cible[prop]),
    lire: () => String(cible[prop]),
    ecrire: (valeur) => {
      cible[prop] = valeur;
    },
  };
}

function prix(cle: string, libelle: string, objet: { prix: number }): Champ {
  return {
    cle,
    libelle,
    type: 'prix',
    base: String(objet.prix),
    lire: () => String(objet.prix),
    ecrire: (valeur) => {
      objet.prix = Number(valeur);
    },
  };
}

/** Une liste de textes : un champ par élément. */
const liste = (cle: string, libelle: string, valeurs: string[], type: TypeChamp = 'texte') =>
  valeurs.map((_, i) => champ(`${cle}.${i}`, `${libelle} ${i + 1}`, valeurs, i, type));

export const blocs: Record<string, Bloc> = {
  'accueil.hero': {
    titre: 'Haut de page',
    champs: [
      champ('accueil.hero.badge', 'Petite étiquette', hero, 'badge'),
      champ('accueil.hero.titre', 'Grand titre', pages.accueil, 'heading', 'long'),
      champ('accueil.hero.texte', 'Texte', hero, 'text', 'long'),
      champ('accueil.hero.prixAvant', 'Avant le prix', hero.prix, 'avant'),
      prix('formule.vitrinePlus', 'Prix « à partir de » (€)', formules.find((f) => f.id === 'vitrinePlus')!),
      champ('accueil.hero.prixApres', 'Après le prix', hero.prix, 'apres'),
      champ('accueil.hero.nom', 'Votre nom', hero.identite, 'nom'),
      champ('accueil.hero.role', 'Votre métier', hero.identite, 'role'),
      champ('media.portrait', 'Grande photo', medias, 'portrait', 'image'),
      champ('media.vignette', 'Petite photo', medias, 'vignette', 'image'),
      champ('accueil.hero.bouton', 'Bouton principal', hero.primary, 'label'),
      champ('accueil.hero.bouton2', 'Second bouton', hero.secondary, 'label'),
      champ('accueil.hero.rdvQuestion', 'Question avant le rendez-vous', hero.rdv, 'question'),
      champ('accueil.hero.rdv', 'Bouton rendez-vous', hero.rdv, 'label'),
      ...liste('accueil.hero.garantie', 'Garantie', hero.reassurance),
    ],
  },
  'accueil.metiers': {
    titre: 'Bande des métiers',
    champs: [champ('accueil.metiers.question', 'Question', metiers, 'question'), ...liste('accueil.metiers', 'Métier', metiers.items)],
  },
  'accueil.autonomie': {
    titre: 'Vous le modifiez vous-même',
    champs: [
      champ('accueil.autonomie.titre', 'Titre', autonomie, 'titre'),
      champ('accueil.autonomie.intro', 'Introduction', autonomie, 'intro', 'long'),
      ...autonomie.items.flatMap((a, i) => [
        champ(`accueil.autonomie.${i}.titre`, `Carte ${i + 1}`, a, 'titre'),
        champ(`accueil.autonomie.${i}.texte`, `Texte de la carte ${i + 1}`, a, 'texte', 'long'),
      ]),
      champ('accueil.autonomie.note', 'Note', autonomie, 'note'),
    ],
  },
  'accueil.realisations': {
    titre: 'Titre des réalisations',
    champs: [
      champ('accueil.realisations.titre', 'Titre', realisationsSection, 'title'),
      champ('accueil.realisations.lien', 'Lien', realisationsSection, 'lien'),
    ],
  },
  'accueil.methode': {
    titre: 'Comment ça se passe',
    champs: [
      champ('accueil.methode.titre', 'Titre', methode, 'title'),
      ...methode.steps.flatMap((s, i) => [
        champ(`accueil.methode.${i}.duree`, `Durée de l’étape ${i + 1}`, s, 'duree'),
        champ(`accueil.methode.${i}.titre`, `Étape ${i + 1}`, s, 'title'),
        champ(`accueil.methode.${i}.texte`, `Texte de l’étape ${i + 1}`, s, 'text', 'long'),
      ]),
    ],
  },
  'accueil.livraison': {
    titre: 'Ce que vous recevez',
    champs: [
      champ('accueil.livraison.titre', 'Titre', livraison, 'titre'),
      ...livraison.items.flatMap((l, i) => [
        champ(`accueil.livraison.${i}.titre`, `Point ${i + 1}`, l, 'titre'),
        champ(`accueil.livraison.${i}.texte`, `Texte du point ${i + 1}`, l, 'texte', 'long'),
      ]),
    ],
  },
  'accueil.comparatif': {
    titre: 'Trois façons d’avoir un site',
    champs: [
      champ('accueil.comparatif.titre', 'Titre', comparatif, 'titre'),
      champ('accueil.comparatif.intro', 'Introduction', comparatif, 'intro', 'long'),
      ...comparatif.lignes.flatMap((l, i) => [
        champ(`accueil.comparatif.${i}.critere`, `Critère ${i + 1}`, l, 'critere'),
        ...l.valeurs.map((_, j) => champ(`accueil.comparatif.${i}.${j}`, `${l.critere} · ${comparatif.colonnes[j]}`, l.valeurs, j)),
      ]),
      champ('accueil.comparatif.note', 'Note', comparatif, 'note', 'long'),
    ],
  },
  'accueil.faq': {
    titre: 'Questions fréquentes',
    champs: [
      champ('accueil.faq.titre', 'Titre', faqAccueil, 'titre'),
      champ('accueil.faq.intro', 'Introduction', faqAccueil, 'intro', 'long'),
      ...questionsFaq.flatMap((q) => [
        champ(`faq.${q.id}.question`, 'Question', q, 'question'),
        ...q.reponse.map((_, i) => champ(`faq.${q.id}.reponse.${i}`, 'Réponse', q.reponse, i, 'long')),
      ]),
    ],
  },
  'accueil.carte': {
    titre: 'Carte des déplacements',
    champs: [champ('accueil.carte.titre', 'Titre', carteTextes, 'titre')],
  },
  'accueil.contact': {
    titre: 'Formulaire de contact',
    champs: [
      champ('accueil.contact.titre', 'Titre', contactRapide, 'titre'),
      champ('accueil.contact.intro', 'Introduction', contactRapide, 'intro', 'long'),
    ],
  },
};

/** Tous les champs de textes et d'images, par clé (une même image peut être dans plusieurs blocs). */
function champsParCle() {
  const parCle = new Map<string, Champ[]>();
  for (const bloc of Object.values(blocs)) {
    for (const c of bloc.champs) {
      if (c.type !== 'prix') parCle.set(c.cle, [...(parCle.get(c.cle) ?? []), c]);
    }
  }
  return parCle;
}

/** Applique des contenus enregistrés ; une clé inconnue est ignorée, jamais affichée. */
export function appliquerContenus(contenus: Record<string, string>) {
  const parCle = champsParCle();
  for (const [cle, valeur] of Object.entries(contenus)) {
    if (typeof valeur !== 'string') continue;
    parCle.get(cle)?.forEach((c) => c.ecrire(valeur));
  }
}

/** Contenus actuellement modifiés : ce qui diffère du code. */
export function contenusActuels(): Record<string, string> {
  const actuels: Record<string, string> = {};
  for (const [cle, champs] of champsParCle()) {
    const c = champs[0];
    if (c.lire() !== c.base) actuels[cle] = c.lire();
  }
  return actuels;
}
