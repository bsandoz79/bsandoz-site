import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, ChoiceChips, OptionCard, PriceSummary, SectionTitle, buttonClassName } from '@bsandoz79/blocs';
import {
  calculerEstimation,
  garderOptionsValides,
  optionsDisponibles,
  suggestions,
  type Configuration,
} from '../../data/calculs';
import { formatPrix, formules, metiers, options, prixFormule, prixOption, type FormuleId, type MetierId, type OptionId } from '../../data/offres';
import { simulateur } from '../../data/tarifs';
import { chargerEtat, enregistrerEtat } from '../Composer/stockage';
import styles from './Simulateur.module.css';

/**
 * Simulateur simplifié : formule (Vitrine, Vitrine+ ou Fonctionnel), activité pour le Fonctionnel, options, prix en direct.
 * Le configurateur complet (`/composer`) ajoute les précisions et l'aperçu.
 */
export function Simulateur() {
  const [formule, setFormule] = useState<FormuleId | null>(null);
  const [metier, setMetier] = useState<MetierId | null>(null);
  const [choix, setChoix] = useState<OptionId[]>([]);

  const config: Configuration = { formule, metier, options: choix, precisions: {} };

  // La simulation devient la dernière estimation : le devis détaillé et « Composer mon site » la reprennent.
  useEffect(() => {
    if (!formule) return;
    enregistrerEtat({ ...chargerEtat(), onglet: 'web', config: { formule, metier, options: choix, precisions: {} } });
  }, [formule, metier, choix]);
  const disponibles = optionsDisponibles(formule, metier);
  const fonctionnel = formule === 'fonctionnel';
  const estimation = calculerEstimation(config);
  const offertes = new Set(estimation.packs.map((p) => p.offerte));
  // Seules les suggestions d'option ont du sens ici (la formule est déjà le Fonctionnel).
  const suggestion = suggestions(config).find((s) => s.action.type === 'option');
  const optionSuggeree = suggestion?.action.type === 'option' ? suggestion.action.option : null;
  const metierNom = metiers.find((m) => m.id === metier)?.nom;

  function choisirFormule(id: FormuleId) {
    setFormule(id);
    setChoix((actuel) => garderOptionsValides(actuel, id, metier));
  }

  function choisirMetier(id: MetierId) {
    setMetier(id);
    setChoix((actuel) => garderOptionsValides(actuel, formule, id));
  }

  function basculer(id: OptionId, coche: boolean) {
    setChoix((actuel) => (coche ? [...actuel, id] : actuel.filter((x) => x !== id)));
  }

  const total = !formule
    ? '—'
    : estimation.fourchette
      ? `${formatPrix(estimation.fourchette.bas)} – ${formatPrix(estimation.fourchette.haut)}`
      : formatPrix(estimation.total);

  return (
    <div className={styles.layout}>
      <div className={styles.form}>
        <SectionTitle id="simulateur-titre" title={simulateur.title} intro={simulateur.intro} />
        <ChoiceChips
          legend={simulateur.formuleLegend}
          name="simulateur-formule"
          choices={formules.map((f) => ({ value: f.id, label: f.nom, meta: prixFormule(f) }))}
          value={formule}
          onChange={choisirFormule}
        />
        {fonctionnel && (
          <ChoiceChips
            legend={simulateur.activiteLegend}
            name="simulateur-activite"
            choices={metiers.map((m) => ({ value: m.id, label: m.nom }))}
            value={metier}
            onChange={choisirMetier}
          />
        )}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>{simulateur.optionsLegend}</legend>
          {disponibles.length === 0 ? (
            <p className={styles.hint}>{formule ? simulateur.choisirActivite : simulateur.choisirFormule}</p>
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
        caption={formule ? `${simulateur.delai} : ${estimation.delai}` : simulateur.choisirFormule}
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
              <strong>{suggestion.titre}</strong> : {suggestion.texte}
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
