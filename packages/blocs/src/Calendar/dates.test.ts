import {
  ajouterJours,
  ajouterMois,
  aujourdhui,
  comparer,
  debutDuMois,
  jourDeLaSemaine,
  joursDansLeMois,
  libelleLong,
  libelleMois,
  semainesDuMois,
  versIso,
} from './dates';

describe('dates du calendrier', () => {
  it('construit et normalise les dates ISO', () => {
    expect(versIso(2026, 11, 17)).toBe('2026-11-17');
    expect(versIso(2026, 1, 32)).toBe('2026-02-01');
    expect(versIso(2026, 13, 1)).toBe('2027-01-01');
  });

  it('donne la date du jour selon l’horloge locale', () => {
    expect(aujourdhui(new Date(2026, 10, 5, 23, 30))).toBe('2026-11-05');
  });

  it('ajoute des jours et des mois, en gardant un jour valide', () => {
    expect(ajouterJours('2026-11-30', 1)).toBe('2026-12-01');
    expect(ajouterJours('2026-03-01', -1)).toBe('2026-02-28');
    expect(ajouterMois('2026-01-31', 1)).toBe('2026-02-28');
    expect(ajouterMois('2028-01-31', 1)).toBe('2028-02-29');
    expect(ajouterMois('2026-12-15', 1)).toBe('2027-01-15');
  });

  it('connaît la longueur des mois et le jour de la semaine (lundi = 0)', () => {
    expect(joursDansLeMois(2026, 2)).toBe(28);
    expect(joursDansLeMois(2028, 2)).toBe(29);
    expect(jourDeLaSemaine('2026-11-17')).toBe(1); // mardi
    expect(jourDeLaSemaine('2026-11-01')).toBe(6); // dimanche
    expect(debutDuMois('2026-11-17')).toBe('2026-11-01');
  });

  it('découpe le mois en semaines du lundi au dimanche', () => {
    const semaines = semainesDuMois('2026-11-17');
    expect(semaines).toHaveLength(6);
    expect(semaines[0]).toEqual([null, null, null, null, null, null, '2026-11-01']);
    expect(semaines[5][0]).toBe('2026-11-30');
    expect(semaines.every((s) => s.length === 7)).toBe(true);
  });

  it('compare et met en forme les dates en français', () => {
    expect(comparer('2026-11-05', '2026-11-17')).toBe(-1);
    expect(libelleLong('2026-11-17')).toBe('mardi 17 novembre 2026');
    expect(libelleMois('2026-11-17')).toBe('novembre 2026');
  });
});
