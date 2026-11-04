import type { CSSProperties } from 'react';
import type { Comparaison } from '../../data/calculs';
import { marcheTextes } from '../../data/configurateur';
import styles from './Composer.module.css';

type Props = { comparaison: Comparaison; total: string };

/** Deux barres : la fourchette du marché (du bas au haut) et « mon prix », avec la source. */
export function ComparaisonMarche({ comparaison, total }: Props) {
  const { marche, pourcentBas, pourcentMonPrix, phrase } = comparaison;
  const barreMarche = { marginLeft: `${pourcentBas}%`, width: `${100 - pourcentBas}%` } as CSSProperties;
  const barrePrix = { width: `${pourcentMonPrix}%` } as CSSProperties;

  return (
    <div className={styles.marche}>
      <p className={styles.marcheTitre}>{marcheTextes.title}</p>
      <p>
        {marcheTextes.marche} : {marche.fourchette}
      </p>
      <div className={styles.piste} aria-hidden="true">
        <div className={styles.barreMarche} style={barreMarche} />
      </div>
      <p>
        {marcheTextes.monPrix} : {total}
      </p>
      <div className={styles.piste} aria-hidden="true">
        <div className={styles.barrePrix} style={barrePrix} />
      </div>
      <p className={styles.marchePhrase}>{phrase}</p>
      <p className={styles.marcheSource}>{marcheTextes.source(marche.description, marche.source)}</p>
    </div>
  );
}
