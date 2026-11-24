import { Link } from 'react-router-dom';
import { Container, MoyensPaiement, SectionTitle } from '@bsandoz79/blocs';
import { tarifs } from '../../../data/accueil';
import { A_PARTIR_DE, complements, formatPrix, formules, mentionsPrix } from '../../../data/offres';
import { pages } from '../../../data/pages';
import { paiement } from '../../../data/paiement';
import sections from './Sections.module.css';
import styles from './Tarifs.module.css';

/** Adresse de la demande de devis avec la formule choisie (pré-remplie dans le formulaire). */
const lienFormule = (id: string) => `${pages.devis.path}?formule=${id}`;

/**
 * Les trois formules en cartes cliquables (chacune mène à la demande de devis, formule pré-remplie),
 * la page en plus, puis le paiement : en 3 ou 4 fois sans frais, et les moyens acceptés (liens vers leur site officiel).
 */
export function Tarifs() {
  const page = complements().find((c) => c.id === 'page');
  return (
    <section className="section" aria-labelledby="tarifs-titre">
      <Container className={sections.stack}>
        <SectionTitle id="tarifs-titre" title={tarifs.titre} />
        <p className={sections.muted}>{tarifs.intro}</p>

        <ul className={styles.cartes}>
          {formules.map((f) => (
            <li key={f.id}>
              <Link to={lienFormule(f.id)} className={styles.carte} aria-label={`${f.nom}, ${f.prixMinimum ? `${A_PARTIR_DE} ` : ''}${formatPrix(f.prix)} : ${tarifs.appel}`}>
                <span className={styles.nom}>{f.nom}</span>
                <span className={styles.accroche}>{f.accroche}</span>
                <span className={styles.prix}>
                  {f.prixMinimum && <span className={styles.aPartirDe}>{A_PARTIR_DE}</span>}
                  <strong>{formatPrix(f.prix)}</strong>
                </span>
                <span className={styles.delai}>En ligne en {f.delai}</span>
                <span className={styles.points}>
                  {f.pointsForts.map((p) => <span key={p} className={styles.point}>{p}</span>)}
                </span>
                <span className={styles.appel}>{tarifs.appel} <span aria-hidden="true">→</span></span>
              </Link>
            </li>
          ))}
        </ul>

        {page && (
          <p className={styles.page}>
            <strong>{page.nom} : {page.prix}</strong> · {page.detail}
          </p>
        )}

        <div className={styles.paiement}>
          <p className={styles.plusieursFois}>{paiement.plusieursFois}</p>
          <MoyensPaiement label={paiement.label} moyens={paiement.moyens} liens={paiement.liens} />
          <p className={styles.mention}>{mentionsPrix.tva}</p>
        </div>
      </Container>
    </section>
  );
}
