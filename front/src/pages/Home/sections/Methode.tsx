import { Container } from '../../../blocks/Container';
import { Reveal } from '../../../blocks/Reveal';
import { SectionTitle } from '../../../blocks/SectionTitle';
import { methode } from '../../../data/accueil';
import sections from './Sections.module.css';
import styles from './Methode.module.css';

/** Les quatre étapes d'un projet. */
export function Methode() {
  return (
    <section className="section section--white" aria-labelledby="methode-titre">
      <Container className={sections.stack}>
        <SectionTitle id="methode-titre" eyebrow={methode.eyebrow} title={methode.title} />
        <ol className={sections.grid4}>
          {methode.steps.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 80} className={styles.step}>
              <span className={i === methode.steps.length - 1 ? `${styles.number} ${styles.last}` : styles.number}>
                {i + 1}
              </span>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={sections.muted}>{step.text}</p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
