import { Card, Container, Reveal, SectionTitle } from '@bsandoz79/blocs';
import { autonomie } from '../../../data/accueil';
import styles from './Sections.module.css';

/** Ce que le client change seul une fois son site livré : textes, photos, prix. */
export function Autonomie() {
  return (
    <section className="section" aria-labelledby="autonomie-titre">
      <Container className={styles.stack}>
        <SectionTitle id="autonomie-titre" title={autonomie.titre} intro={autonomie.intro} />
        <ul className={styles.grid4}>
          {autonomie.items.map((item, i) => (
            <Reveal as="li" key={item.titre} delay={i * 80}>
              <Card as="article" className={styles.fill} aria-labelledby={`autonomie-${i}`}>
                <h3 id={`autonomie-${i}`} className={styles.strong}>
                  {item.titre}
                </h3>
                <p className={styles.muted}>{item.texte}</p>
              </Card>
            </Reveal>
          ))}
        </ul>
        <p className={styles.note}>{autonomie.note}</p>
      </Container>
    </section>
  );
}
