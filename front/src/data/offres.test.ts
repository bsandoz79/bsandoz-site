import { formatPrix, formules, prixFormule } from './offres';

describe('offres', () => {
  it('formate les prix à la française, avec espace insécable', () => {
    expect(formatPrix(99)).toBe('99 €');
    expect(formatPrix(1200)).toBe('1 200 €');
    expect(formatPrix(30.5)).toBe('30,5 €');
  });

  it('affiche « dès » pour un prix minimum', () => {
    const [vitrine, , fonctionnel] = formules;
    expect(prixFormule(vitrine)).toBe('99 €');
    expect(prixFormule(fonctionnel)).toBe('dès 989 €');
  });

  it('reprend les prix du cahier des charges', () => {
    expect(formules.map((f) => [f.id, f.prix, f.prixMinimum])).toEqual([
      ['vitrine', 99, false],
      ['vitrinePlus', 390, false],
      ['fonctionnel', 989, true],
    ]);
  });
});
