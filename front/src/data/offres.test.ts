import {
  formatPrix,
  formules,
  options,
  optionsParFormule,
  optionsParMetier,
  precisions,
  prixFormule,
  prixOption,
} from './offres';

describe('offres', () => {
  it('formate les prix à la française, avec espace insécable', () => {
    expect(formatPrix(99)).toBe('99 €');
    expect(formatPrix(1200)).toBe('1 200 €');
    expect(formatPrix(30.5)).toBe('30,5 €');
  });

  it('affiche « à partir de » pour un prix de départ', () => {
    const [vitrine, , fonctionnel] = formules;
    expect(prixFormule(vitrine)).toBe('à partir de 99 €');
    expect(prixFormule({ ...vitrine, prixMinimum: false })).toBe('99 €');
    expect(prixFormule(fonctionnel)).toBe('à partir de 989 €');
  });

  it('reprend les prix du cahier des charges', () => {
    expect(formules.map((f) => [f.id, f.prix, f.prixMinimum])).toEqual([
      ['vitrine', 99, true],
      ['vitrinePlus', 390, true],
      ['fonctionnel', 989, true],
    ]);
  });

  it('affiche le prix des options, avec « dès » et l’unité', () => {
    expect(prixOption(options.galerie)).toBe('+ 80 €');
    expect(prixOption(options.boutique)).toBe('dès + 600 €');
    expect(prixOption(options.textes)).toBe('+ 60 € / page');
  });

  it('ne référence que des options existantes', () => {
    const listes = [...Object.values(optionsParFormule), ...Object.values(optionsParMetier)];
    for (const liste of listes) for (const id of liste) expect(options[id]).toBeDefined();
    for (const id of Object.keys(precisions)) expect(options[id as keyof typeof options]).toBeDefined();
  });
});
