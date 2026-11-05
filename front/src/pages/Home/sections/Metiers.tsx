import { Marquee } from '@bsandoz79/blocs';
import { metiers } from '../../../data/accueil';
import styles from './Metiers.module.css';

/** Bande défilante des métiers accompagnés. */
export function Metiers() {
  return (
    <div className={styles.band}>
      <Marquee label={metiers.label} items={metiers.items} className={styles.marquee} />
    </div>
  );
}
