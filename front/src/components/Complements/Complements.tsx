import { complements, options, prixOption } from '../../data/offres';
import { PrixModifiable } from '../PrixModifiable';
import styles from './Complements.module.css';

/** Compléments des formules (page en plus, suivi mensuel avec le tarif horaire) : deux cadres en pointillés, prix à droite. */
export function Complements({ titreId = 'complements-titre' }: { titreId?: string }) {
  return (
    <section className={styles.bloc} aria-labelledby={titreId}>
      <h3 id={titreId} className={styles.titre}>
        Les compléments
      </h3>
      <ul className={styles.liste}>
        {complements().map((c) => (
          <li key={c.id} className={styles.item}>
            <p className={styles.nom}>{c.nom}</p>
            <p className={styles.detail}>{c.detail}</p>
            {c.id === 'page' ? (
              <div className={styles.prixModifiable}>
                <PrixModifiable cle="option.page" nom={options.page.nom} montant={() => options.page.prix}>
                  {() => <p className={styles.prix}>{prixOption(options.page)}</p>}
                </PrixModifiable>
              </div>
            ) : (
              <p className={styles.prix}>{c.prix}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
