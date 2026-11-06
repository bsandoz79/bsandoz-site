import { Card, Container, Reveal, SectionTitle } from '@bsandoz79/blocs';
import { problemes } from '../../../data/accueil';
import styles from './Sections.module.css';

/** Problèmes rencontrés par les clients, et la réponse apportée. */
export function Problemes() {
  return (
    <section className="section" aria-labelledby="problemes-titre">
      <Container className={styles.stack}>
        <SectionTitle id="problemes-titre" title={problemes.title} />
        <ul className={styles.grid4}>
          {problemes.items.map((item, i) => (
            <Reveal as="li" key={item.probleme} delay={i * 80}>
              <Card lift className={styles.fill}>
                <p className={styles.muted}>{item.probleme}</p>
                <p className={styles.strong}>{item.solution}</p>
              </Card>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
