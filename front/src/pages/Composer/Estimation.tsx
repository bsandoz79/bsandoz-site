import { Button, PriceSummary } from '@bsandoz79/blocs';
import { BoutonRdv } from '../../components/BoutonRdv';
import { calculerEstimation, comparaisonMarche, type Configuration } from '../../data/calculs';
import { estimationTextes } from '../../data/configurateur';
import { formatPrix, nomActivite } from '../../data/offres';
import { ComparaisonMarche } from './ComparaisonMarche';
import styles from './Composer.module.css';

type Props = { config: Configuration; onRecommencer: () => void; onValider: () => void };

/** Estimation détaillée : total, options incluses, fourchette, délai, lignes, comparaison au marché, validation. */
export function Estimation({ config, onRecommencer, onValider }: Props) {
  const estimation = calculerEstimation(config);
  const total = formatPrix(estimation.total);
  const comparaison = comparaisonMarche(config.formule, config.options, estimation.total);
  const metierNom = nomActivite(config.metier, config.metierAutre);

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
      {comparaison && <ComparaisonMarche comparaison={comparaison} total={total} />}
      {config.metier ? (
        <div className={styles.actions}>
          <Button block onClick={onValider}>
            {estimationTextes.valider}
          </Button>
          <BoutonRdv to={estimationTextes.rdv.to} label={estimationTextes.rdv.label} block className={styles.rdvClair} />
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
