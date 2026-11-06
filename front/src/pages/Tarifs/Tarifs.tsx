import { Card, Container, SectionTitle } from '@bsandoz79/blocs';
import { PageMeta } from '../../components/PageMeta';
import { StructuredData } from '../../components/StructuredData';
import { formules, mentionsPrix, prixFormule, lignePageSupplementaire } from '../../data/offres';
import { pages } from '../../data/pages';
import { jsonLdOffres } from '../../data/seo';
import { apresMiseEnLigne, contenuFormules, formulesSection, intro, pourquoiFonctionnel } from '../../data/tarifs';
import { Simulateur } from './Simulateur';
import styles from './Tarifs.module.css';

/** Page Tarifs : formules, explication du prix du fonctionnel, simulateur, après la mise en ligne. */
export function Tarifs() {
  const page = pages.tarifs;

  return (
    <>
      <PageMeta title={page.title} description={page.description} />
      <StructuredData data={jsonLdOffres(formules)} />

      <section className={styles.intro} aria-labelledby="tarifs-titre">
        <Container>
          <SectionTitle id="tarifs-titre" level={1} title={page.heading} intro={intro.text} className={styles.introTitle} />
        </Container>
      </section>

      <section className={styles.formulesSection} aria-label={formulesSection.title}>
        <Container className={styles.stack}>
          <ul className={styles.formules}>
            {formules.map((formule) => {
              const featured = formule.id === 'fonctionnel';
              return (
                <li key={formule.id}>
                  <Card
                    as="article"
                    tone={featured ? 'dark' : 'surface'}
                    className={featured ? `${styles.formule} ${styles.featured}` : styles.formule}
                    aria-labelledby={`tarif-${formule.id}`}
                  >
                    <h2 id={`tarif-${formule.id}`} className={styles.formuleNom}>
                      {formule.nom}
                    </h2>
                    <p className={styles.formulePrix}>{prixFormule(formule)}</p>
                    <p className={featured ? styles.formuleContenuDark : styles.formuleContenu}>
                      {contenuFormules[formule.id].join(' · ')}
                    </p>
                    <p className={featured ? styles.formuleContenuDark : styles.formuleContenu}>
                      {formulesSection.delaiLabel} : {formule.delai}
                    </p>
                    <p className={featured ? `${styles.pageSup} ${styles.pageSupDark}` : styles.pageSup}>{lignePageSupplementaire()}</p>
                  </Card>
                </li>
              );
            })}
          </ul>
          <aside className={styles.pourquoi} aria-labelledby="pourquoi-fonctionnel">
            <span className={styles.pourquoiIcone} aria-hidden="true">
              ?
            </span>
            <p>
              <strong id="pourquoi-fonctionnel">{pourquoiFonctionnel.title}</strong> {pourquoiFonctionnel.text}
            </p>
          </aside>
          <p className={styles.note}>{mentionsPrix.tva}</p>
        </Container>
      </section>

      <section className="section section--white" aria-labelledby="simulateur-titre">
        <Container>
          <Simulateur />
        </Container>
      </section>

      <section className="section" aria-labelledby="apres-titre">
        <Container className={styles.stack}>
          <SectionTitle id="apres-titre" title={apresMiseEnLigne.title} />
          <ul className={styles.apres}>
            {apresMiseEnLigne.items.map((item) => (
              <li key={item.title}>
                <Card className={styles.fill}>
                  <h3 className={styles.apresTitre}>{item.title}</h3>
                  <p className={styles.formuleContenu}>{item.text}</p>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
