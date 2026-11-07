import { Container, SectionTitle } from '@bsandoz79/blocs';
import { livraison } from '../../../data/accueil';
import styles from './Sections.module.css';

/** Ce que le client reçoit à la livraison : un site validé, à son nom, et qu'il sait modifier. */
export function Livraison() {
  return (
    <section className="section" aria-labelledby="livraison-titre">
      <Container className={styles.stack}>
        <SectionTitle id="livraison-titre" title={livraison.titre} />
        <ul className={styles.liste}>
          {livraison.items.map((item) => (
            <li key={item.titre}>
              <strong className={styles.strong}>{item.titre}</strong>
              <p className={styles.muted}>{item.texte}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
