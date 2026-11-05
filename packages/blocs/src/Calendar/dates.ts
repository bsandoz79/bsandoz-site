/**
 * Dates du calendrier au format ISO « AAAA-MM-JJ », sans heure ni fuseau :
 * aucune surprise de décalage d'un jour selon le fuseau horaire.
 */
export type DateIso = string;

const pad = (n: number) => String(n).padStart(2, '0');

/** Date ISO depuis année, mois (1 à 12) et jour ; normalise les débordements (32 janvier → 1er février). */
export function versIso(annee: number, mois: number, jour: number): DateIso {
  const d = new Date(Date.UTC(annee, mois - 1, jour));
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

export function decouper(iso: DateIso) {
  const [annee, mois, jour] = iso.split('-').map(Number);
  return { annee, mois, jour };
}

/** Date ISO du jour, selon l'horloge locale. */
export function aujourdhui(maintenant = new Date()): DateIso {
  return versIso(maintenant.getFullYear(), maintenant.getMonth() + 1, maintenant.getDate());
}

export function ajouterJours(iso: DateIso, n: number): DateIso {
  const { annee, mois, jour } = decouper(iso);
  return versIso(annee, mois, jour + n);
}

/** Même jour du mois décalé de `n` mois, ramené au dernier jour si besoin (31 janvier + 1 → 28 ou 29 février). */
export function ajouterMois(iso: DateIso, n: number): DateIso {
  const { annee, mois, jour } = decouper(iso);
  const premier = decouper(versIso(annee, mois + n, 1));
  return versIso(premier.annee, premier.mois, Math.min(jour, joursDansLeMois(premier.annee, premier.mois)));
}

export function joursDansLeMois(annee: number, mois: number) {
  return new Date(Date.UTC(annee, mois, 0)).getUTCDate();
}

/** Premier jour du mois de la date. */
export function debutDuMois(iso: DateIso): DateIso {
  const { annee, mois } = decouper(iso);
  return versIso(annee, mois, 1);
}

/** Jour de la semaine, lundi = 0 … dimanche = 6. */
export function jourDeLaSemaine(iso: DateIso) {
  const { annee, mois, jour } = decouper(iso);
  return (new Date(Date.UTC(annee, mois - 1, jour)).getUTCDay() + 6) % 7;
}

/** Semaines du mois (lundi → dimanche) ; `null` pour les cases hors du mois. */
export function semainesDuMois(iso: DateIso): (DateIso | null)[][] {
  const { annee, mois } = decouper(iso);
  const decalage = jourDeLaSemaine(versIso(annee, mois, 1));
  const cases: (DateIso | null)[] = Array.from({ length: decalage }, () => null);
  for (let jour = 1; jour <= joursDansLeMois(annee, mois); jour++) cases.push(versIso(annee, mois, jour));
  while (cases.length % 7) cases.push(null);
  const semaines: (DateIso | null)[][] = [];
  for (let i = 0; i < cases.length; i += 7) semaines.push(cases.slice(i, i + 7));
  return semaines;
}

/** Compare deux dates ISO (l'ordre alphabétique suit l'ordre chronologique). */
export const comparer = (a: DateIso, b: DateIso) => (a < b ? -1 : a > b ? 1 : 0);

/** Libellé lisible, ex. « mardi 17 novembre 2026 ». */
export function libelleLong(iso: DateIso, locale = 'fr-FR') {
  const { annee, mois, jour } = decouper(iso);
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(annee, mois - 1, jour)));
}

/** Libellé du mois, ex. « novembre 2026 ». */
export function libelleMois(iso: DateIso, locale = 'fr-FR') {
  const { annee, mois } = decouper(iso);
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(annee, mois - 1, 1)),
  );
}
