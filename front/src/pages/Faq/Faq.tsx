import { Link } from 'react-router-dom';
import { Accordion } from '../../blocks/Accordion';
import { buttonClassName } from '../../blocks/Button';
import { Container } from '../../blocks/Container';
import { SectionTitle } from '../../blocks/SectionTitle';
import { PageMeta } from '../../components/PageMeta';
import { pageFaq, questionsFaq } from '../../data/faq';
import { pages } from '../../data/pages';
import styles from './Faq.module.css';

/** Page FAQ : questions dépliables et appel à l'action. */
export function Faq() {
  const page = pages.faq;

  return (
    <>
      <PageMeta title={page.title} description={page.description} />
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
