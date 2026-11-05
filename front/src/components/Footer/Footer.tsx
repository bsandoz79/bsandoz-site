import { Link } from 'react-router-dom';
import { Container } from '@bsandoz79/blocs';
import { contact, footer } from '../../data/navigation';
import styles from './Footer.module.css';

/** Pied de page : présentation, contact et liens légaux. */
export function Footer() {
  return (
    <footer className={styles.footer}>
      <Container className={styles.inner}>
        <div className={styles.column}>
          <p className={styles.name}>{footer.name}</p>
          <p>{footer.tagline}</p>
          <p>{footer.zone}</p>
        </div>

        <nav aria-label={footer.contactLabel}>
          <ul className={styles.column}>
            <li>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </li>
            {contact.phone && (
              <li>
                <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a>
              </li>
            )}
            <li>
              <a href={contact.portfolio}>{footer.portfolioLabel}</a>
            </li>
            <li>
              <Link to={footer.espaceClient.to}>{footer.espaceClient.label}</Link>
            </li>
          </ul>
        </nav>

        <nav aria-label={footer.legalLabel}>
          <ul className={styles.column}>
            {footer.legal.map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </footer>
  );
}
