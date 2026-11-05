import { Button, ChoiceChips, OptionCard } from '@bsandoz79/blocs';
import { optionsDisponibles, packsActifs, suggestions } from '../../data/calculs';
import { estimationTextes, etapes } from '../../data/configurateur';
import {
  formatPrix,
  formules,
  metiers,
  options,
  precisions,
  prixFormule,
  prixOption,
  type OptionId,
} from '../../data/offres';
import { Estimation } from './Estimation';
import type { useComposer } from './useComposer';
import styles from './Composer.module.css';

type Props = { composer: ReturnType<typeof useComposer> };

/** Onglet « Sites & applis » : étapes qui s'ouvrent l'une après l'autre, puis l'estimation. */
export function ConfigurateurWeb({ composer }: Props) {
  const { config } = composer.etat;
  const { formule, metier } = config;
  const disponibles = optionsDisponibles(formule, metier);
  const offertes = new Set(packsActifs(config.options).map((actif) => actif.offerte));
  const aPreciser = config.options.filter((id): id is OptionId => Boolean(precisions[id]));
  const listeSuggestions = suggestions(config);
  const fonctionnel = formule === 'fonctionnel';

  return (
    <div className={styles.etapes}>
      <section className={styles.etape} aria-label={etapes.type}>
        <ChoiceChips
          legend={<h2 className={styles.etapeTitre}>{etapes.type}</h2>}
          name="composer-formule"
          variant="cards"
          choices={formules.map((f) => ({ value: f.id, label: f.nom, meta: prixFormule(f), description: f.description }))}
          value={formule}
          onChange={composer.choisirFormule}
        />
      </section>

      {formule && (
        <section className={`${styles.etape} anim-appear`} aria-label={etapes.metier}>
          <ChoiceChips
            legend={<h2 className={styles.etapeTitre}>{etapes.metier}</h2>}
            name="composer-metier"
            choices={metiers.map((m) => ({ value: m.id, label: m.nom }))}
            value={metier}
            onChange={composer.choisirMetier}
          />
        </section>
      )}

      {disponibles.length > 0 && (
        <section className={`${styles.etape} anim-appear`} aria-labelledby="etape-options">
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>
              <h2 id="etape-options" className={styles.etapeTitre}>
                {fonctionnel ? etapes.optionsFonctionnel : etapes.optionsVitrine}
              </h2>
              <span className={styles.aide}>{fonctionnel ? etapes.aideFonctionnel : etapes.aideVitrine}</span>
            </legend>
            <ul className={styles.grille}>
              {disponibles.map((id) => (
                <li key={id}>
                  <OptionCard
                    title={options[id].nom}
                    description={options[id].description}
                    price={prixOption(options[id])}
                    badge={offertes.has(id) ? estimationTextes.offert : undefined}
                    checked={config.options.includes(id)}
                    onChange={() => composer.basculerOption(id)}
                  />
                </li>
              ))}
            </ul>
          </fieldset>
        </section>
      )}

      {aPreciser.length > 0 && (
        <section className={`${styles.etape} anim-appear`} aria-labelledby="etape-precisions">
          <h2 id="etape-precisions" className={styles.etapeTitre}>
            {etapes.precisions}
          </h2>
          {aPreciser.map((id) => {
            const precision = precisions[id]!;
            const choisi = precision.choix.find((c) => c.id === config.precisions[id]);
            return (
              <div key={id} className={styles.precision}>
                <ChoiceChips
                  legend={
                    <>
                      <span className={styles.precisionOption}>{options[id].nom}</span> {precision.question}
                    </>
                  }
                  name={`composer-precision-${id}`}
                  choices={precision.choix.map((c) => ({
                    value: c.id,
                    label: c.prix ? `${c.label} (+ ${formatPrix(c.prix)})` : c.label,
                  }))}
                  value={config.precisions[id] ?? null}
                  onChange={(reponse) => composer.choisirPrecision(id, reponse)}
                />
                {choisi?.note && <p className={styles.note}>✓ {choisi.note}</p>}
              </div>
            );
          })}
        </section>
      )}

      {listeSuggestions.length > 0 && (
        <section className={`${styles.etape} anim-appear`} aria-labelledby="etape-suggestions">
          <h2 id="etape-suggestions" className={styles.etapeTitre}>
            {etapes.suggestions}
          </h2>
          <ul className={styles.suggestions}>
            {listeSuggestions.map((suggestion) => (
              <li key={suggestion.titre} className={styles.suggestion}>
                <p className={styles.suggestionTitre}>{suggestion.titre}</p>
                <p>{suggestion.texte}</p>
                <Button variant="secondary" onClick={() => composer.appliquerSuggestion(suggestion)}>
                  {suggestion.libelle}
                </Button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {formule && <Estimation config={config} onRecommencer={composer.recommencer} />}
    </div>
  );
}
