import { Link } from 'react-router-dom';
import { ChoiceChips, OptionCard, PriceSummary, buttonClassName } from '@bsandoz79/blocs';
import { informatiqueTextes } from '../../data/configurateur';
import { informatiqueMentions, publicsInformatique, servicesInformatique } from '../../data/informatique';
import type { useComposer } from './useComposer';
import styles from './Composer.module.css';

type Props = { composer: ReturnType<typeof useComposer> };

/** Onglet « Informatique sur place » : pour qui, prestations, demande (tarif sur devis). */
export function ConfigurateurInformatique({ composer }: Props) {
  const { informatique } = composer.etat;
  const publicNom = publicsInformatique.find((p) => p.id === informatique.public)?.nom.toLowerCase();
  const choisis = servicesInformatique.filter((s) => informatique.services.includes(s.id));

  return (
    <div className={styles.etapes}>
      <section className={styles.etape} aria-label={informatiqueTextes.public}>
        <ChoiceChips
          legend={<h2 className={styles.etapeTitre}>{informatiqueTextes.public}</h2>}
          name="composer-public"
          choices={publicsInformatique.map((p) => ({ value: p.id, label: p.nom }))}
          value={informatique.public}
          onChange={composer.choisirPublic}
        />
      </section>

      <section className={styles.etape} aria-labelledby="etape-services">
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>
            <h2 id="etape-services" className={styles.etapeTitre}>
              {informatiqueTextes.besoins}
            </h2>
            <span className={styles.aide}>{informatiqueTextes.aide}</span>
          </legend>
          <ul className={styles.grille}>
            {servicesInformatique.map((service) => (
              <li key={service.id}>
                <OptionCard
                  title={service.nom}
                  description={service.description}
                  badge={service.bientot ? informatiqueMentions.bientot : undefined}
                  disabled={service.bientot}
                  checked={informatique.services.includes(service.id)}
                  onChange={() => composer.basculerService(service.id)}
                />
              </li>
            ))}
          </ul>
        </fieldset>
      </section>

      <PriceSummary
        className={styles.estimation}
        title={informatiqueTextes.resume}
        eyebrow={`${informatiqueTextes.resume} · ${publicNom ?? informatiqueTextes.publicParDefaut}`}
        total={informatiqueTextes.tarif}
        caption={informatiqueTextes.tarifTexte}
      >
        {choisis.length > 0 ? (
          <ul className={styles.demande}>
            {choisis.map((service) => (
              <li key={service.id}>{service.nom}</li>
            ))}
          </ul>
        ) : (
          <p className={styles.aide}>{informatiqueTextes.aucun}</p>
        )}
        <div className={styles.actions}>
          <Link to={informatiqueTextes.rdv.to} className={buttonClassName({ block: true })}>
            {informatiqueTextes.rdv.label}
          </Link>
          <Link to={informatiqueTextes.devis.to} className={`${buttonClassName({ block: true })} ${styles.outline}`}>
            {informatiqueTextes.devis.label}
          </Link>
        </div>
      </PriceSummary>
    </div>
  );
}
