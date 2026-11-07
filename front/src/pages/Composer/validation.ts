import { calculerEstimation, type Configuration } from '../../data/calculs';
import { formatPrix, formuleParId, nomActivite, options, precisions } from '../../data/offres';
import { preDevis, texteDuPreDevis } from '../../data/predevis';
import type { EstimationJointe } from '../../components/ContactRapide/contact';

/**
 * Estimation validée, prête à joindre à la demande de devis : titre, métier, lignes du récapitulatif
 * et texte envoyé au client. `null` tant que la formule ou le métier manquent.
 */
export function estimationJointe(config: Configuration): EstimationJointe | null {
  const p = preDevis(config);
  if (!p || !config.metier) return null;
  const estimation = calculerEstimation(config);
  const formule = `Site ${formuleParId(p.formule).nom}`;
  const noms = config.options.map((id) => {
    const choix = precisions[id]?.choix.find((c) => c.id === config.precisions[id]);
    const nom = choix ? `${options[id].nom} (${choix.label})` : options[id].nom;
    return estimation.incluses.includes(id) ? `${nom}, inclus` : nom;
  });
  const { bas, haut } = p.fourchette;
  const lignes: [string, string][] = [['Formule', formule]];
  if (noms.length) lignes.push(['Options', noms.join(' · ')]);
  lignes.push(['Prix estimé', bas === haut ? formatPrix(bas) : `${formatPrix(bas)} à ${formatPrix(haut)}`]);
  if (p.delai) lignes.push(['Délai', p.delai]);
  return {
    titre: config.options.length ? `${formule} · ${config.options.map((id) => options[id].nom).join(', ')}` : formule,
    activite: nomActivite(config.metier, config.metierAutre),
    lignes,
    predevis: texteDuPreDevis(p),
  };
}
