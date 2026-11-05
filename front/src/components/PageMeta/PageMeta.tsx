import { useEffect } from 'react';
import type { PageInfo } from '../../data/pages';
import { urlComplete } from '../../data/seo';
import { formatTitle } from './formatTitle';

type PageMetaProps = Pick<PageInfo, 'title' | 'description'> & {
  /** Page à ne pas indexer (page provisoire, 404). */
  noindex?: boolean;
};

/** Met à jour (ou crée) la balise `<meta name="…">` du `<head>`. */
function setMeta(name: string, content: string | null) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (content === null) {
    tag?.remove();
    return;
  }
  if (!tag) {
    tag = document.createElement('meta');
    tag.name = name;
    document.head.appendChild(tag);
  }
  tag.content = content;
}

/** Met à jour (ou crée) le lien canonique. */
function setCanonical(href: string) {
  let tag = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!tag) {
    tag = document.createElement('link');
    tag.rel = 'canonical';
    document.head.appendChild(tag);
  }
  tag.href = href;
}

/**
 * Titre de l'onglet, meta description, adresse canonique et, si besoin, « noindex ».
 * Met à jour les balises déjà présentes dans `index.html` plutôt que d'en ajouter de nouvelles.
 */
export function PageMeta({ title, description, noindex = false }: PageMetaProps) {
  useEffect(() => {
    document.title = formatTitle(title);
    setMeta('description', description);
    setMeta('robots', noindex ? 'noindex' : null);
    setCanonical(urlComplete(window.location.pathname));
  }, [title, description, noindex]);

  return null;
}
