import { Link } from 'react-router-dom';
import { Card, Container, Reveal, SectionTitle } from '@bsandoz79/blocs';
import { cibles } from '../../../data/accueil';
import { formuleParId, prixFormule } from '../../../data/offres';
import { pages } from '../../../data/pages';
import styles from './Sections.module.css';

/** Autres besoins : photographes, restauration, PME, charcutiers. Prix de départ, ou sur devis. */
export function Cibles() {
  return (
    <section className="section" aria-labelledby="cibles-titre">
      <Container className={styles.stack}>
        <SectionTitle id="cibles-titre" title={cibles.titre} />
        <ul className={styles.grid4}>
          {cibles.items.map((cible, i) => (
            <Reveal as="li" key={cible.id} delay={i * 80}>
              <Card as="article" lift className={styles.fill} aria-labelledby={`cible-${cible.id}`}>
                <h3 id={`cible-${cible.id}`} className={styles.strong}>
                  {cible.titre}
                </h3>
                <p className={styles.muted}>{cible.texte}</p>
                <p className={styles.strong}>{cible.formule ? prixFormule(formuleParId(cible.formule)) : cibles.surDevis}</p>
                <Link to={pages.devis.path} className={styles.arrowLink}>
                  {cibles.lien} <span aria-hidden="true">→</span>
                </Link>
              </Card>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
