import { Link } from 'react-router-dom';
import { PageMeta } from '../../components/PageMeta';
import { notFoundContent, notFoundPage, pages } from '../../data/pages';
import styles from './NotFound.module.css';

/** Page 404 : affichée pour toute adresse inconnue. */
export function NotFound() {
  return (
    <section className="section">
      <PageMeta title={notFoundPage.title} description={notFoundPage.description} noindex />
      <div className={`container ${styles.inner}`}>
        <p className={styles.code} aria-hidden="true">
          404
        </p>
        <h1 className={styles.title}>{notFoundPage.heading}</h1>
        <p className={styles.text}>{notFoundContent.text}</p>
        <Link to={pages.accueil.path} className={styles.back}>
          {notFoundContent.backLabel}
        </Link>
      </div>
    </section>
  );
}
