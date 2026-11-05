import { Link } from 'react-router-dom';
import { Container, Reveal, buttonClassName } from '@bsandoz79/blocs';
import { appelAction } from '../../../data/accueil';
import styles from './AppelAction.module.css';

/** Dernier appel à l'action : décrire son projet ou prendre rendez-vous. */
export function AppelAction() {
  return (
    <section className={styles.section} aria-labelledby="appel-titre">
      <Container>
        <Reveal className={styles.box}>
          <div className={styles.text}>
            <h2 id="appel-titre" className={styles.title}>
              {appelAction.title}
            </h2>
            <p className={styles.intro}>{appelAction.text}</p>
          </div>
          <div className={styles.actions}>
            <Link to={appelAction.primary.to} className={buttonClassName({ size: 'lg', className: 'anim-pulse' })}>
              {appelAction.primary.label}
            </Link>
            <Link to={appelAction.secondary.to} className={`${buttonClassName({ size: 'lg' })} ${styles.outline}`}>
              {appelAction.secondary.label}
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
