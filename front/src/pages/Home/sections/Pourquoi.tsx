import { Container, Reveal, SectionTitle, buttonClassName } from '@bsandoz79/blocs';
import { pourquoi } from '../../../data/accueil';
import styles from './Pourquoi.module.css';
import portrait from '../../../assets/baptiste/portrait.webp';
import { Rideau } from '../../../components/Rideau';

/** Pourquoi travailler avec Baptiste : photo, quatre arguments et lien vers le portfolio. */
export function Pourquoi() {
  return (
    <section className="section" aria-labelledby="pourquoi-titre">
      <Container className={styles.inner}>
        <Reveal className={styles.photoWrap}>
          <figure className={styles.photo}>
            <Rideau>
              <img src={portrait} alt={pourquoi.photo} width="600" height="800" loading="lazy" decoding="async" className={styles.image} />
            </Rideau>
            <figcaption className={styles.caption}>{pourquoi.photoCaption}</figcaption>
          </figure>
        </Reveal>
        <div className={styles.content}>
          <SectionTitle id="pourquoi-titre" title={pourquoi.title} />
          <ul className={styles.items}>
            {pourquoi.items.map((item) => (
              <li key={item.title} className={styles.item}>
                <strong className={styles.itemTitle}>{item.title}</strong>
                {item.text}
              </li>
            ))}
          </ul>
          <a href={pourquoi.portfolio.href} className={buttonClassName({ variant: 'secondary', className: styles.portfolio })}>
            {pourquoi.portfolio.label} <span aria-hidden="true">→</span>
          </a>
        </div>
      </Container>
    </section>
  );
}
