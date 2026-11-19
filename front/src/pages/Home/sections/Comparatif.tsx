import { Container, SectionTitle } from '@bsandoz79/blocs';
import { comparatif, type Verdict } from '../../../data/accueil';
import sections from './Sections.module.css';
import styles from './Comparatif.module.css';

const SIGNES: Record<Verdict, { signe: string; texte: string; classe: string }> = {
  oui: { signe: '✓', texte: 'Oui', classe: styles.oui },
  non: { signe: '✕', texte: 'Non', classe: styles.non },
  variable: { signe: '~', texte: 'Ça dépend', classe: styles.variable },
};

/**
 * Avec moi, plateforme à abonnement, agence web : un vrai tableau (une liste par critère sur téléphone).
 * Chaque case a un signe (✓, ✕, ~) ; la colonne « Avec moi », au milieu, est mise en avant, les autres sont plus discrètes.
 */
export function Comparatif() {
  const avant = (i: number) => i === comparatif.miseEnAvant;
  return (
    <section className="section section--white" aria-labelledby="comparatif-titre">
      <Container className={sections.stack}>
        <SectionTitle id="comparatif-titre" title={comparatif.titre} />
        <p className={sections.muted}>{comparatif.intro}</p>
        <table className={styles.tableau}>
          <caption className="sr-only">{comparatif.titre}</caption>
          <thead>
            <tr>
              <td />
              {comparatif.colonnes.map((nom, i) => (
                <th key={nom} scope="col" className={avant(i) ? `${styles.avant} ${styles.enTeteAvant}` : styles.autre}>
                  {avant(i) && <span className={styles.badge}>{comparatif.badge}</span>}
                  {nom}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparatif.lignes.map((ligne) => (
              <tr key={ligne.critere}>
                <th scope="row">{ligne.critere}</th>
                {ligne.valeurs.map((v, i) => {
                  const s = SIGNES[v.verdict];
                  return (
                    <td key={comparatif.colonnes[i]} data-colonne={comparatif.colonnes[i]} className={avant(i) ? styles.avant : styles.autre}>
                      <span className={`${styles.signe} ${s.classe}`} aria-hidden="true">{s.signe}</span>
                      <span className="sr-only">{s.texte} : </span>
                      {v.texte}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <p className={styles.note}>{comparatif.note}</p>
      </Container>
    </section>
  );
}
