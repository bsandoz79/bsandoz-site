import { ajouterJours, jourDeLaSemaine, type DateIso } from '@bsandoz79/blocs';
import type { LigneDemande, RendezVousAdmin } from './api';

/** Lundi de la semaine d'un jour. */
export const lundiDe = (jour: DateIso) => ajouterJours(jour, -jourDeLaSemaine(jour));

/** Les sept jours d'une semaine, à partir de son lundi. */
export const joursDeLaSemaine = (lundi: DateIso) => Array.from({ length: 7 }, (_, i) => ajouterJours(lundi, i));

const confirme = (r: RendezVousAdmin) => r.statut === 'confirme';

/** Places offertes sur la semaine : créneaux des jours travaillés et ouverts. */
export function placesDeLaSemaine(lundi: DateIso, regles: { joursTravailles: number[]; creneaux: string[]; joursFermes: string[] }) {
  return joursDeLaSemaine(lundi).filter((j) => regles.joursTravailles.includes(jourDeLaSemaine(j)) && !regles.joursFermes.includes(j)).length * regles.creneaux.length;
}

/**
 * Chiffres du tableau de bord : tous calculés à partir des vraies données, jamais estimés.
 * `rdvMois` couvre le mois en cours et les 7 prochains jours ; `aujourdhui` borne le « à venir ».
 */
export function calculerStatistiques({
  rdvPeriode,
  rdvSemaine,
  demandes,
  aujourdhui,
  places,
}: {
  rdvPeriode: RendezVousAdmin[];
  rdvSemaine: RendezVousAdmin[];
  demandes: LigneDemande[];
  aujourdhui: DateIso;
  places: number;
}) {
  const dans7Jours = ajouterJours(aujourdhui, 7);
  const mois = aujourdhui.slice(0, 7);
  const duMois = rdvPeriode.filter((r) => r.jour.startsWith(mois));
  const acceptes = demandes.flatMap((d) => (d.devis?.statut === 'accepte' ? [d.devis] : []));
  const somme = (liste: { total: number }[]) => liste.reduce((total, devis) => total + devis.total, 0);
  return {
    aVenir: rdvPeriode.filter((r) => confirme(r) && r.jour >= aujourdhui && r.jour <= dans7Jours).length,
    mois: duMois.filter(confirme).length,
    annules: duMois.filter((r) => !confirme(r)).length,
    // Occupation : null si aucune place n'est offerte (on n'affiche pas un faux 0 %).
    occupation: places > 0 ? Math.min(100, Math.round((rdvSemaine.filter(confirme).length / places) * 100)) : null,
    aTraiter: demandes.filter((d) => d.statut === 'recue').length,
    acceptes: demandes.filter((d) => ['acceptee', 'en_cours', 'livree'].includes(d.statut)).length,
    // Chiffre d'affaires : la somme des devis, jamais une estimation.
    caSigne: somme(acceptes),
    caMois: somme(acceptes.filter((devis) => devis.accepteLe?.startsWith(mois))),
    caEnAttente: somme(demandes.flatMap((d) => (d.devis?.statut === 'envoye' ? [d.devis] : []))),
  };
}
