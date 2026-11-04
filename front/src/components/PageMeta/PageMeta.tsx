import { useEffect } from 'react';
import type { PageInfo } from '../../data/pages';
import { formatTitle } from './formatTitle';

type PageMetaProps = Pick<PageInfo, 'title' | 'description'>;

/** Met à jour (ou crée) la balise `<meta name="…">` du `<head>`. */
function setMeta(name: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.name = name;
    document.head.appendChild(tag);
  }
  tag.content = content;
}

/**
 * Titre de l'onglet et meta description de la page.
 * Met à jour les balises déjà présentes dans `index.html` plutôt que d'en ajouter de nouvelles.
 */
export function PageMeta({ title, description }: PageMetaProps) {
  useEffect(() => {
    document.title = formatTitle(title);
    setMeta('description', description);
  }, [title, description]);

  return null;
}
