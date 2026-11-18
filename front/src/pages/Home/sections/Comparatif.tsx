import { Container, SectionTitle } from '@bsandoz79/blocs';
import { comparatif } from '../../../data/accueil';
import sections from './Sections.module.css';
import styles from './Comparatif.module.css';

/** Plateforme à abonnement, moi, agence web : un vrai tableau, qui se lit en cartes sur téléphone. */
export function Comparatif() {
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
                <th key={nom} scope="col" className={i === comparatif.miseEnAvant ? styles.avant : undefined}>
                  {nom}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparatif.lignes.map((ligne) => (
              <tr key={ligne.critere}>
                <th scope="row">{ligne.critere}</th>
                {ligne.valeurs.map((valeur, i) => (
                  <td
                    key={comparatif.colonnes[i]}
                    data-colonne={comparatif.colonnes[i]}
                    className={i === comparatif.miseEnAvant ? styles.avant : undefined}
                  >
                    {valeur}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className={styles.note}>{comparatif.note}</p>
      </Container>
    </section>
  );
}
