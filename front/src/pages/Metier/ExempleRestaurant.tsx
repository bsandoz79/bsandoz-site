import { exempleRestaurant } from '../../data/restaurant';
import styles from './ExempleRestaurant.module.css';

/** Téléphone d'exemple : la carte d'un kebab fictif, telle que la verraient ses clients. */
export function ExempleRestaurant() {
  const s = exempleRestaurant.site;
  return (
    <aside className={styles.telephone} aria-label="Aperçu de votre futur site">
      <p className={styles.etiquette}>Exemple</p>
      <div className={styles.ecran}>
        <header className={styles.entete}>
          <p className={styles.nom}>{s.nom}</p>
          <p className={styles.lieu}>{s.lieu}</p>
          <p className={styles.statut}>{s.statut}</p>
        </header>
        <ul className={styles.actions}>
          {s.actions.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
        {s.categories.map((c) => (
          <section key={c.titre} className={styles.categorie}>
            <h3 className={styles.categorieTitre}>{c.titre}</h3>
            <ul className={styles.plats}>
              {c.plats.map((p) => (
                <li key={p.nom} className={styles.plat}>
                  <span className={styles.platTexte}>
                    <strong>{p.nom}</strong>
                    <span>{p.detail}</span>
                  </span>
                  <span className={styles.prix}>{p.prix}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <p className={styles.maj}>{s.maj}</p>
      </div>
    </aside>
  );
}
