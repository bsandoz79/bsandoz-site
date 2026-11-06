import { useEffect, useRef, useState } from 'react';
import { Accordion, Container, SectionTitle } from '@bsandoz79/blocs';
import { faqAccueil as t, questionsFaq } from '../../../data/faq';
import styles from './Faq.module.css';

/**
 * Questions fréquentes, en bas de l'accueil : 3 questions, puis 3 de plus à chaque « Voir plus ».
 * Les nouvelles questions reçoivent le focus clavier, pour continuer la lecture là où elle s'arrêtait.
 */
export function Faq() {
  const [nombre, setNombre] = useState(t.parPaquet);
  const premiereNouvelle = useRef<string | null>(null);
  const visibles = questionsFaq.slice(0, nombre);
  const reste = questionsFaq.length - nombre;

  useEffect(() => {
    if (!premiereNouvelle.current) return;
    document.querySelector<HTMLElement>(`#${premiereNouvelle.current} > summary`)?.focus();
    premiereNouvelle.current = null;
  }, [nombre]);

  function voirPlus() {
    premiereNouvelle.current = questionsFaq[nombre]?.id ?? null;
    setNombre((n) => n + t.parPaquet);
  }

  return (
    <section id={t.id} className={`section ${styles.section}`} aria-labelledby="faq-titre">
      <Container size="narrow" className={styles.stack}>
        <SectionTitle id="faq-titre" eyebrow={t.eyebrow} title={t.titre} intro={t.intro} />
        <div id="faq-questions">
          <Accordion
            headingLevel={3}
            items={visibles.map((q) => ({
              id: q.id,
              question: q.question,
              answer: q.reponse.map((paragraphe) => <p key={paragraphe}>{paragraphe}</p>),
            }))}
          />
        </div>
        {reste > 0 && (
          <button type="button" className={styles.voirPlus} onClick={voirPlus} aria-controls="faq-questions">
            {t.voirPlus} <span className={styles.compte}>({reste})</span>
            <span aria-hidden="true" className={styles.chevron} />
          </button>
        )}
      </Container>
    </section>
  );
}
