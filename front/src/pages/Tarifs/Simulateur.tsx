import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, ChoiceChips, OptionCard, PriceSummary, SectionTitle, buttonClassName } from '@bsandoz79/blocs';
import {
  calculerEstimation,
  garderOptionsValides,
  optionsDisponibles,
  suggestions,
  type Configuration,
} from '../../data/calculs';
import { formatPrix, metiers, options, prixOption, type MetierId, type OptionId } from '../../data/offres';
import { simulateur } from '../../data/tarifs';
import styles from './Simulateur.module.css';

/**
 * Simulateur simplifié d'un site fonctionnel : activité + options, prix en direct.
 * Le configurateur complet (`/composer`) couvre toutes les formules et les précisions.
 */
export function Simulateur() {
  const [metier, setMetier] = useState<MetierId | null>(null);
  const [choix, setChoix] = useState<OptionId[]>([]);

  const config: Configuration = { formule: 'fonctionnel', metier, options: choix, precisions: {} };
  const disponibles = optionsDisponibles('fonctionnel', metier);
  const estimation = calculerEstimation(config);
  const offertes = new Set(estimation.packs.map((p) => p.offerte));
  // Seules les suggestions d'option ont du sens ici (la formule est déjà le Fonctionnel).
  const suggestion = suggestions(config).find((s) => s.action.type === 'option');
  const optionSuggeree = suggestion?.action.type === 'option' ? suggestion.action.option : null;
  const metierNom = metiers.find((m) => m.id === metier)?.nom;

  function choisirMetier(id: MetierId) {
    setMetier(id);
    setChoix((actuel) => garderOptionsValides(actuel, 'fonctionnel', id));
  }

  function basculer(id: OptionId, coche: boolean) {
    setChoix((actuel) => (coche ? [...actuel, id] : actuel.filter((x) => x !== id)));
  }

  const total = estimation.fourchette
    ? `${formatPrix(estimation.fourchette.bas)} – ${formatPrix(estimation.fourchette.haut)}`
    : formatPrix(estimation.total);

  return (
    <div className={styles.layout}>
      <div className={styles.form}>
        <SectionTitle id="simulateur-titre" eyebrow={simulateur.eyebrow} title={simulateur.title} intro={simulateur.intro} />
        <ChoiceChips
          legend={simulateur.activiteLegend}
          name="simulateur-activite"
          choices={metiers.map((m) => ({ value: m.id, label: m.nom }))}
          value={metier}
          onChange={choisirMetier}
        />
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>{simulateur.optionsLegend}</legend>
          {disponibles.length === 0 ? (
            <p className={styles.hint}>{simulateur.choisirActivite}</p>
          ) : (
            <ul className={styles.options}>
              {disponibles.map((id) => (
                <li key={id}>
                  <OptionCard
                    title={options[id].nom}
                    description={options[id].description}
                    price={prixOption(options[id])}
                    badge={offertes.has(id) ? simulateur.offert : undefined}
                    checked={choix.includes(id)}
                    onChange={(coche) => basculer(id, coche)}
                  />
                </li>
              ))}
            </ul>
          )}
        </fieldset>
      </div>

      <PriceSummary
        className={styles.summary}
        title={simulateur.resumeTitle}
        eyebrow={metierNom ? `${simulateur.resumeEyebrow} · ${metierNom.toLowerCase()}` : simulateur.resumeEyebrow}
        total={total}
        caption={`${simulateur.delai} : ${estimation.delai}`}
        lines={estimation.lignes.map((ligne) => ({
          label: ligne.libelle,
          amount: formatPrix(ligne.prix),
          free: ligne.offerte,
        }))}
        freeLabel={simulateur.offert}
        footnote={simulateur.footnote}
      >
        {estimation.offert > 0 && (
          <p className={styles.saving}>
            {simulateur.economie} : − {formatPrix(estimation.offert)}
          </p>
        )}
        {suggestion && optionSuggeree && (
          <div className={styles.suggestion}>
            <p className={styles.suggestionTitle}>{simulateur.suggestionTitle}</p>
            <p>
              <strong>{suggestion.titre}</strong> — {suggestion.texte}
            </p>
            <Button variant="secondary" className={styles.suggestionButton} onClick={() => basculer(optionSuggeree, true)}>
              {simulateur.suggestionAction} « {options[optionSuggeree].nom} »
            </Button>
          </div>
        )}
        <Link to={simulateur.devis.to} className={buttonClassName({ block: true })}>
          {simulateur.devis.label}
        </Link>
        <Link to={simulateur.composer.to} className={styles.composer}>
          {simulateur.composer.label} <span aria-hidden="true">→</span>
        </Link>
      </PriceSummary>
    </div>
  );
}
