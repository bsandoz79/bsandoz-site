import { Container, SectionTitle } from '@bsandoz79/blocs';
import { reponses } from '../../../data/accueil';
import sections from './Sections.module.css';
import styles from './Reponses.module.css';

/** Ce qu'un client dit de son métier, et le texte que ça donne sur son site (exemples fictifs). */
export function Reponses() {
  return (
    <section className="section" aria-labelledby="reponses-titre">
      <Container className={sections.stack}>
        <SectionTitle id="reponses-titre" title={reponses.titre} />
        <p className={sections.muted}>{reponses.intro}</p>
        <ul className={styles.liste}>
          {reponses.exemples.map((exemple) => (
            <li key={exemple.metier} className={styles.exemple}>
              <div className={styles.vous}>
                <p className={styles.etiquette}>
                  {reponses.vous} · {exemple.metier}
                </p>
                <blockquote className={styles.citation}>
                  <p>« {exemple.dit} »</p>
                </blockquote>
              </div>
              <span className={styles.fleche} aria-hidden="true">
                →
              </span>
              <div className={styles.site}>
                <p className={styles.etiquette}>{reponses.site}</p>
                <p className={styles.titre}>{exemple.titre}</p>
                <p className={sections.muted}>{exemple.texte}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className={styles.note}>{reponses.note}</p>
      </Container>
    </section>
  );
}
