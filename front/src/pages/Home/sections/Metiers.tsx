import { Link } from 'react-router-dom';
import { Container, Marquee } from '@bsandoz79/blocs';
import { metiers } from '../../../data/accueil';
import styles from './Metiers.module.css';

/** Bande des métiers qui ont besoin d'un site : chacun mène à sa page (la bande s'arrête au survol). */
export function Metiers() {
  const vers = new Map(metiers.items.map((m) => [m.nom, m.to]));
  return (
    <div className={styles.band}>
      <Container>
        <p className={styles.question}>{metiers.question}</p>
      </Container>
      <Marquee
        label={metiers.label}
        items={metiers.items.map((m) => m.nom)}
        className={styles.marquee}
        renderItem={(nom, copie) => (
          <Link to={vers.get(nom) ?? '/'} className={styles.lien} tabIndex={copie ? -1 : undefined}>
            {nom}
          </Link>
        )}
      />
    </div>
  );
}
