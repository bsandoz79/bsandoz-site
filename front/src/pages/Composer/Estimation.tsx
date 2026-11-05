import { Link } from 'react-router-dom';
import { Button, PriceSummary, buttonClassName } from '@bsandoz79/blocs';
import { calculerEstimation, comparaisonMarche, type Configuration } from '../../data/calculs';
import { estimationTextes } from '../../data/configurateur';
import { formatPrix, metiers, options } from '../../data/offres';
import { ComparaisonMarche } from './ComparaisonMarche';
import styles from './Composer.module.css';

type Props = { config: Configuration; onRecommencer: () => void };

/** Estimation détaillée : total, packs offerts, fourchette, délai, lignes, comparaison au marché. */
export function Estimation({ config, onRecommencer }: Props) {
  const estimation = calculerEstimation(config);
  const total = formatPrix(estimation.total);
  const comparaison = comparaisonMarche(config.formule, config.options, estimation.total);
  const metierNom = metiers.find((m) => m.id === config.metier)?.nom;

  return (
    <PriceSummary
      className={`${styles.estimation} anim-appear`}
      title={estimationTextes.title}
      eyebrow={metierNom ? `${estimationTextes.title} · ${metierNom.toLowerCase()}` : estimationTextes.title}
      total={total}
      caption={
        <>
          {estimation.offert > 0 && (
            <span className={styles.valeur}>
              {estimationTextes.valeur} <s>{formatPrix(estimation.valeur)}</s>
              <br />
            </span>
          )}
          {estimation.fourchette && (
            <>
              {estimationTextes.fourchette} : {formatPrix(estimation.fourchette.bas)} – {formatPrix(estimation.fourchette.haut)}
              <br />
            </>
          )}
          {estimationTextes.delai} : {estimation.delai}
        </>
      }
      lines={estimation.lignes.map((ligne) => ({ label: ligne.libelle, amount: formatPrix(ligne.prix), free: ligne.offerte }))}
      freeLabel={estimationTextes.offert}
      footnote={estimationTextes.footnote}
    >
      {estimation.packs.length > 0 && (
        <div className={styles.offert}>
          <p className={styles.offertTitre}>
            {estimationTextes.offert} : − {formatPrix(estimation.offert)}
          </p>
          <ul className={styles.offertListe}>
            {estimation.packs.map((actif) => (
              <li key={actif.pack.id}>
                {actif.pack.nom} · {options[actif.offerte].nom} ({formatPrix(actif.valeur)})
              </li>
            ))}
          </ul>
        </div>
      )}
      {comparaison && <ComparaisonMarche comparaison={comparaison} total={total} />}
      {config.metier ? (
        <div className={styles.actions}>
          <Link to={estimationTextes.devis.to} className={buttonClassName({ block: true })}>
            {estimationTextes.devis.label}
          </Link>
          <Link to={estimationTextes.rdv.to} className={`${buttonClassName({ block: true })} ${styles.outline}`}>
            {estimationTextes.rdv.label}
          </Link>
        </div>
      ) : (
        <p className={styles.aide}>{estimationTextes.finirAvantDevis}</p>
      )}
      <Button variant="ghost" className={styles.recommencer} onClick={onRecommencer}>
        {estimationTextes.recommencer}
      </Button>
    </PriceSummary>
  );
}
