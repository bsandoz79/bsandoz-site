import { Container } from '../../blocks/Container';
import { SectionTitle } from '../../blocks/SectionTitle';
import { PageMeta } from '../../components/PageMeta';
import { miseAJour, pagesLegales, type PageLegaleId } from '../../data/legal';
import styles from './Legal.module.css';

/** Page légale (mentions légales, CGV, confidentialité) : un titre et des sections. */
export function Legal({ id }: { id: PageLegaleId }) {
  const { page, contenu } = pagesLegales[id];

  return (
    <>
      <PageMeta title={page.title} description={page.description} />
      <Container as="article" size="narrow" className={styles.page}>
        <SectionTitle level={1} title={page.heading} intro={contenu.intro} />
        {contenu.sections.map((section) => (
          <section key={section.titre} className={styles.section} aria-label={section.titre}>
            <h2 className={styles.titre}>{section.titre}</h2>
            {section.paragraphes.map((paragraphe) => (
              <p key={paragraphe}>{paragraphe}</p>
            ))}
          </section>
        ))}
        <p className={styles.miseAJour}>{miseAJour}</p>
      </Container>
    </>
  );
}
