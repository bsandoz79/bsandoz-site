import { Link } from 'react-router-dom';
import { Accordion, Container, SectionTitle, buttonClassName } from '@bsandoz79/blocs';
import { PageMeta } from '../../components/PageMeta';
import { StructuredData } from '../../components/StructuredData';
import { pageFaq, questionsFaq } from '../../data/faq';
import { pages } from '../../data/pages';
import { jsonLdFaq } from '../../data/seo';
import styles from './Faq.module.css';

/** Page FAQ : questions dépliables et appel à l'action. */
export function Faq() {
  const page = pages.faq;

  return (
    <>
      <PageMeta title={page.title} description={page.description} />
      <StructuredData data={jsonLdFaq(questionsFaq)} />
      <Container size="narrow" className={styles.page}>
        <SectionTitle level={1} title={page.heading} intro={pageFaq.intro} />
        <Accordion
          headingLevel={2}
          items={questionsFaq.map((q) => ({
            id: q.id,
            question: q.question,
            answer: q.reponse.map((paragraphe) => <p key={paragraphe}>{paragraphe}</p>),
          }))}
        />
        <div className={styles.appel}>
          <p className={styles.appelTexte}>{pageFaq.appel.texte}</p>
          <div className={styles.actions}>
            <Link to={pageFaq.appel.rdv.to} className={buttonClassName()}>
              {pageFaq.appel.rdv.label}
            </Link>
            <Link to={pageFaq.appel.devis.to} className={buttonClassName({ variant: 'secondary' })}>
              {pageFaq.appel.devis.label}
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}
