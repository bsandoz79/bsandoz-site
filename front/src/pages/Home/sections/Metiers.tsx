import { Container, Marquee } from '@bsandoz79/blocs';
import { metiers } from '../../../data/accueil';
import styles from './Metiers.module.css';

/** Bande des métiers qui ont besoin d'un site, sous une question simple. */
export function Metiers() {
  return (
    <div className={styles.band}>
      <Container>
        <p className={styles.question}>{metiers.question}</p>
      </Container>
      <Marquee label={metiers.label} items={metiers.items} className={styles.marquee} />
    </div>
  );
}
