import { PageMeta } from '../../components/PageMeta';
import { placeholderContent, type PageInfo } from '../../data/pages';
import styles from './Placeholder.module.css';

type PlaceholderProps = { page: PageInfo };

/** Page provisoire : titre, meta et h1 de la page, en attendant son contenu. */
export function Placeholder({ page }: PlaceholderProps) {
  return (
    <section className="section">
      <PageMeta title={page.title} description={page.description} />
      <div className={`container ${styles.inner}`}>
        <h1 className={styles.title}>{page.heading}</h1>
        <p className={styles.text}>{placeholderContent.text}</p>
      </div>
    </section>
  );
}
