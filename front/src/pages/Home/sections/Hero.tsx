import { Link } from 'react-router-dom';
import { Container, RotatingWords, buttonClassName } from '@bsandoz79/blocs';
import { hero } from '../../../data/accueil';
import { pages } from '../../../data/pages';
import { HeroDemo } from './HeroDemo';
import styles from './Hero.module.css';
import vignette from '../../../assets/baptiste/vignette.webp';

/** Haut de l'accueil : promesse, mots qui tournent, appels à l'action et écran de démonstration. */
export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="accueil-titre">
      <Container className={styles.inner}>
        <div className={styles.content}>
          <p className={styles.identite}>
            <img src={vignette} alt="" width="56" height="56" className={styles.vignette} />
            <span>
              <strong>{hero.identite.nom}</strong>
              <span className={styles.role}>{hero.identite.role}</span>
            </span>
          </p>
          <p className={styles.badge}>{hero.badge}</p>
          <h1 id="accueil-titre" className={styles.title}>
            {pages.accueil.heading}
          </h1>
          <p className={styles.rotating}>
            {hero.rotatingPrefix} <RotatingWords words={hero.rotatingWords} />
          </p>
          <p className={styles.text}>{hero.text}</p>
          <div className={styles.actions}>
            <Link to={hero.primary.to} className={buttonClassName({ size: 'lg', className: 'anim-pulse' })}>
              {hero.primary.label}
            </Link>
            <Link to={hero.secondary.to} className={buttonClassName({ variant: 'secondary', size: 'lg' })}>
              {hero.secondary.label}
            </Link>
          </div>
          <Link to={hero.rdv.to} className={styles.rdv}>
            {hero.rdv.label} <span aria-hidden="true">→</span>
          </Link>
          <ul className={styles.reassurance}>
            {hero.reassurance.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <HeroDemo />
      </Container>
    </section>
  );
}
