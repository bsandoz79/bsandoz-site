import { Link } from 'react-router-dom';
import { Container, MoyensPaiement, buttonClassName } from '@bsandoz79/blocs';
import { hero } from '../../../data/accueil';
import { pages } from '../../../data/pages';
import { BoutonRdv } from '../../../components/BoutonRdv';
import { HeroDemo } from './HeroDemo';
import styles from './Hero.module.css';
import { medias } from '../../../data/medias';
import { formatPrix, prixDepart } from '../../../data/offres';
import { paiement } from '../../../data/paiement';

/** Haut de l'accueil : promesse, mots qui tournent, appels à l'action et écran de démonstration. */
export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="accueil-titre">
      <Container className={styles.inner}>
        <div className={styles.content}>
          <p className={styles.identite}>
            <img src={medias.vignette} alt="" width="56" height="56" className={styles.vignette} />
            <span>
              <strong>{hero.identite.nom}</strong>
              <span className={styles.role}>{hero.identite.role}</span>
            </span>
          </p>
          <p className={styles.badge}>{hero.badge}</p>
          <h1 id="accueil-titre" className={styles.title}>
            {pages.accueil.heading}
          </h1>
          <p className={styles.text}>{hero.text}</p>
          <p className={styles.prix}>
            {hero.prix.avant} <strong>{formatPrix(prixDepart())}</strong>. {hero.prix.apres}
          </p>
          <MoyensPaiement className={styles.paiement} label={paiement.label} moyens={paiement.moyens} taille="petite" />
          <div className={styles.actions}>
            <Link to={hero.primary.to} className={buttonClassName({ size: 'lg', className: 'anim-reflet' })}>
              {hero.primary.label}
            </Link>
            <Link to={hero.secondary.to} className={buttonClassName({ variant: 'secondary', size: 'lg' })}>
              {hero.secondary.label}
            </Link>
          </div>
          <p className={styles.rdv}>
            <span>{hero.rdv.question}</span>
            <BoutonRdv to={hero.rdv.to} label={hero.rdv.label} />
          </p>
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
