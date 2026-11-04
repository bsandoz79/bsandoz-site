import { site } from '../../data/pages';

/** Formate le titre de l'onglet : « Titre – Baptiste Sandoz ». */
export function formatTitle(title: string) {
  return title ? `${title} – ${site.name}` : site.defaultTitle;
}
