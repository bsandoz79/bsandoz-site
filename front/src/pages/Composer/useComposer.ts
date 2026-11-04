import { useEffect, useState } from 'react';
import { garderOptionsValides, type Suggestion } from '../../data/calculs';
import type { PublicInformatique, ServiceInformatiqueId } from '../../data/informatique';
import type { FormuleId, MetierId, OptionId } from '../../data/offres';
import {
  chargerEtat,
  enregistrerEtat,
  etatVide,
  formuleDepuisAdresse,
  type EtatComposer,
  type Onglet,
} from './stockage';

const basculer = <T>(liste: T[], valeur: T) =>
  liste.includes(valeur) ? liste.filter((x) => x !== valeur) : [...liste, valeur];

/** État du configurateur, enregistré dans le navigateur à chaque changement. */
export function useComposer(recherche: string) {
  const [etat, setEtat] = useState<EtatComposer>(() => {
    const initial = chargerEtat();
    const formule = formuleDepuisAdresse(recherche);
    if (!formule) return initial;
    const { metier, options } = initial.config;
    return {
      ...initial,
      onglet: 'web',
      config: { ...initial.config, formule, options: garderOptionsValides(options, formule, metier) },
    };
  });

  useEffect(() => enregistrerEtat(etat), [etat]);

  const majConfig = (maj: (config: EtatComposer['config']) => EtatComposer['config']) =>
    setEtat((e) => ({ ...e, config: maj(e.config) }));

  return {
    etat,
    choisirOnglet: (onglet: Onglet) => setEtat((e) => ({ ...e, onglet })),
    choisirFormule: (formule: FormuleId) =>
      majConfig((c) => ({ ...c, formule, options: garderOptionsValides(c.options, formule, c.metier) })),
    choisirMetier: (metier: MetierId) =>
      majConfig((c) => ({ ...c, metier, options: garderOptionsValides(c.options, c.formule, metier) })),
    basculerOption: (option: OptionId) => majConfig((c) => ({ ...c, options: basculer(c.options, option) })),
    choisirPrecision: (option: OptionId, reponse: string) =>
      majConfig((c) => ({ ...c, precisions: { ...c.precisions, [option]: reponse } })),
    appliquerSuggestion: ({ action }: Suggestion) =>
      majConfig((c) =>
        action.type === 'option'
          ? { ...c, options: c.options.includes(action.option) ? c.options : [...c.options, action.option] }
          : { ...c, formule: action.formule, options: garderOptionsValides(c.options, action.formule, c.metier) },
      ),
    choisirPublic: (publicCible: PublicInformatique) =>
      setEtat((e) => ({ ...e, informatique: { ...e.informatique, public: publicCible } })),
    basculerService: (service: ServiceInformatiqueId) =>
      setEtat((e) => ({ ...e, informatique: { ...e.informatique, services: basculer(e.informatique.services, service) } })),
    recommencer: () => setEtat((e) => ({ ...etatVide, onglet: e.onglet })),
  };
}
