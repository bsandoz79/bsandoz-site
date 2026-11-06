import { Container, Reveal } from '@bsandoz79/blocs';
import { chiffres } from '../../../data/accueil';
import styles from './Chiffres.module.css';

/** Bande de chiffres clés, juste sous le haut de l'accueil. */
export function Chiffres() {
  return (
    <section className={styles.bande} aria-label={chiffres.label}>
      <Container>
        <ul className={styles.liste}>
          {chiffres.liste.map((chiffre, i) => (
            <Reveal as="li" key={chiffre.texte} delay={i * 90} className={styles.item}>
              <span className={styles.valeur}>{chiffre.valeur}</span>
              <span className={styles.texte}>{chiffre.texte}</span>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
