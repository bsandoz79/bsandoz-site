import type { Champ } from '../../data/blocs';
import { formatPrix } from '../../data/offres';

/** Un endroit de la page qui affiche un champ : on clique dessus pour le modifier. */
export type Cible = {
  champ: Champ;
  /** Position par rapport au bloc, en pixels. */
  haut: number;
  gauche: number;
  largeur: number;
  hauteur: number;
};

/** Espaces normalisés (insécables compris) : « 390 € » et « 390 € » se valent. */
const normaliser = (texte: string) => texte.replace(/\s+/g, ' ').trim();

/** Texte que le champ affiche sur la page : la valeur, ou le prix mis en forme. */
function texteAffiche(champ: Champ): string {
  const valeur = champ.lire();
  if (champ.type === 'prix') return /^\d+$/.test(valeur) ? normaliser(formatPrix(Number(valeur))) : '';
  return normaliser(valeur);
}

type Zone = { rect: DOMRect | { top: number; left: number; width: number; height: number } };

/**
 * Cherche dans le bloc où chaque champ est affiché : les textes et les prix dans les nœuds de texte
 * (le texte exact), les images par leur adresse. Un champ affiché à plusieurs endroits est repéré partout.
 * Les éléments de l'interface d'édition (`data-edition`) sont ignorés.
 */
export function trouverCibles(racine: HTMLElement, champs: Champ[]): { cibles: Cible[]; absents: Champ[] } {
  const base = racine.getBoundingClientRect();
  // Sans mise en page (tests), on garde tout ; dans un navigateur, on ignore ce qui est caché (taille nulle).
  const avecMiseEnPage = base.width > 0;
  const cibles: Cible[] = [];
  const trouves = new Set<string>();

  const ajouter = (champ: Champ, { rect }: Zone) => {
    if (avecMiseEnPage && rect.width === 0 && rect.height === 0) return;
    trouves.add(champ.cle);
    cibles.push({
      champ,
      haut: rect.top - base.top,
      gauche: rect.left - base.left,
      largeur: rect.width,
      hauteur: rect.height,
    });
  };

  const textes = champs.filter((c) => c.type !== 'image');
  const parTexte = new Map<string, Champ[]>();
  for (const c of textes) {
    const t = texteAffiche(c);
    if (t) parTexte.set(t, [...(parTexte.get(t) ?? []), c]);
  }

  const marcheur = document.createTreeWalker(racine, NodeFilter.SHOW_TEXT, {
    acceptNode: (noeud) =>
      noeud.parentElement?.closest('[data-edition]') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
  });
  for (let noeud = marcheur.nextNode(); noeud; noeud = marcheur.nextNode()) {
    const correspondants = parTexte.get(normaliser(noeud.textContent ?? ''));
    if (!correspondants) continue;
    const range = document.createRange();
    range.selectNodeContents(noeud);
    // Le premier champ qui affiche ce texte (deux champs de même valeur se modifient l'un après l'autre).
    const champ = correspondants.find((c) => !trouves.has(c.cle)) ?? correspondants[0];
    ajouter(champ, { rect: range.getBoundingClientRect?.() ?? { top: 0, left: 0, width: 0, height: 0 } });
  }

  for (const c of champs.filter((x) => x.type === 'image')) {
    for (const img of Array.from(racine.querySelectorAll('img'))) {
      if (img.closest('[data-edition]') || img.getAttribute('src') !== c.lire()) continue;
      ajouter(c, { rect: img.getBoundingClientRect() });
    }
  }

  return { cibles, absents: champs.filter((c) => !trouves.has(c.cle)) };
}
