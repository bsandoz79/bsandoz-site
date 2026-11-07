import {
  calculerEstimation,
  comparaisonMarche,
  configurationVide,
  garderOptionsValides,
  inclusRestantes,
  optionsDisponibles,
  optionsIncluses,
  suggestions,
  type Configuration,
} from './calculs';

const config = (partiel: Partial<Configuration>): Configuration => ({ ...configurationVide, ...partiel });

describe('optionsDisponibles', () => {
  it("ne propose rien tant qu'aucune formule n'est choisie", () => {
    expect(optionsDisponibles(null, 'artisan')).toEqual([]);
  });

  it('propose toutes les petites options en Vitrine, sans la galerie en Vitrine+ (elle y est déjà)', () => {
    expect(optionsDisponibles('vitrine', null)).toEqual(['page', 'galerie', 'textes', 'logo', 'avantapres', 'avis', 'seo', 'anglais']);
    expect(optionsDisponibles('vitrinePlus', 'restaurant')).toEqual(['page', 'textes', 'logo', 'avantapres', 'avis', 'seo', 'anglais']);
  });

  it('attend le métier pour le Fonctionnel : ses gros modules d’abord, puis les petites options', () => {
    expect(optionsDisponibles('fonctionnel', null)).toEqual([]);
    expect(optionsDisponibles('fonctionnel', 'restaurant')).toEqual([
      'table', 'clickcollect', 'avis', 'pwa', 'anglais', 'page', 'galerie', 'textes', 'logo', 'avantapres', 'seo',
    ]);
  });
});

describe('garderOptionsValides', () => {
  it('retire les options qui ne sont plus proposées', () => {
    expect(garderOptionsValides(['logo', 'galerie', 'textes'], 'vitrinePlus', null)).toEqual(['logo', 'textes']);
    expect(garderOptionsValides(['rdv', 'boutique'], 'fonctionnel', 'artisan')).toEqual(['rdv']);
  });
});

describe('options incluses', () => {
  it('inclut les premières petites options cochées : 1 en Vitrine, 2 en Vitrine+, 3 en Fonctionnel', () => {
    expect(optionsIncluses(config({ formule: 'vitrine', options: ['galerie', 'page'] }))).toEqual(['galerie']);
    expect(optionsIncluses(config({ formule: 'vitrinePlus', options: ['logo', 'textes', 'seo'] }))).toEqual(['logo', 'textes']);
    expect(optionsIncluses(config({ formule: 'fonctionnel', metier: 'artisan', options: ['seo', 'avis', 'anglais', 'logo'] }))).toEqual([
      'seo',
      'avis',
      'anglais',
    ]);
  });

  it('ne compte jamais un gros module : il reste payant', () => {
    expect(optionsIncluses(config({ formule: 'fonctionnel', metier: 'artisan', options: ['rdv', 'espace', 'avis'] }))).toEqual(['avis']);
  });

  it('dit combien il en reste à choisir', () => {
    expect(inclusRestantes(config({ formule: 'vitrinePlus', options: [] }))).toBe(2);
    expect(inclusRestantes(config({ formule: 'vitrinePlus', options: ['logo'] }))).toBe(1);
    expect(inclusRestantes(config({ formule: 'vitrinePlus', options: ['logo', 'seo', 'avis'] }))).toBe(0);
    expect(inclusRestantes(configurationVide)).toBe(0);
  });
});

describe('calculerEstimation', () => {
  it('est vide sans formule', () => {
    expect(calculerEstimation(configurationVide)).toMatchObject({ lignes: [], total: 0, delai: null, fourchette: null });
  });

  it('additionne la formule et les options payantes, sans fourchette pour une vitrine', () => {
    const estimation = calculerEstimation(config({ formule: 'vitrine', options: ['page', 'galerie'] }));
    expect(estimation.lignes).toEqual([
      { libelle: 'Site Vitrine', prix: 99 },
      { libelle: 'Page supplémentaire', prix: 50, offerte: true },
      { libelle: 'Galerie photos', prix: 80 },
    ]);
    expect(estimation).toMatchObject({ valeur: 229, offert: 50, total: 179, delai: '3 jours', fourchette: null, incluses: ['page'] });
  });

  it('les options incluses comptent dans la valeur, pas dans le prix', () => {
    const estimation = calculerEstimation(
      config({ formule: 'fonctionnel', metier: 'artisan', options: ['rdv', 'seo', 'avis', 'anglais', 'logo'] }),
    );
    expect(estimation).toMatchObject({ offert: 150 + 60 + 150, total: 989 + 400 + 150, valeur: 989 + 400 + 150 + 360 });
  });

  it('ajoute le prix des précisions', () => {
    const estimation = calculerEstimation(
      config({ formule: 'fonctionnel', metier: 'commerce', options: ['boutique'], precisions: { boutique: 'p100' } }),
    );
    expect(estimation.lignes).toContainEqual({ libelle: 'Boutique en ligne · 20 à 100', prix: 200 });
    expect(estimation.total).toBe(989 + 600 + 200);
  });

  it('ignore une précision sans supplément ou une réponse inconnue', () => {
    const estimation = calculerEstimation(
      config({ formule: 'fonctionnel', metier: 'artisan', options: ['rdv', 'calcul'], precisions: { rdv: 'client', calcul: 'xx' } }),
    );
    expect(estimation.lignes).toHaveLength(3);
    expect(estimation.total).toBe(989 + 400 + 300);
  });

  it('donne une fourchette −5 % / +10 % arrondie à 10 € pour le Fonctionnel', () => {
    const estimation = calculerEstimation(config({ formule: 'fonctionnel', metier: 'sante', options: ['rdv'] }));
    expect(estimation.total).toBe(1389);
    expect(estimation.fourchette).toEqual({ bas: 1320, haut: 1530 });
    expect(estimation.delai).toBe('3 à 6 semaines');
  });

  it('ne descend jamais sous le prix plancher du Fonctionnel', () => {
    const estimation = calculerEstimation(config({ formule: 'fonctionnel', metier: 'sante' }));
    expect(estimation.fourchette).toEqual({ bas: 989, haut: 1090 });
  });
});

describe('suggestions', () => {
  it('propose ce qui complète les choix : l’acompte après le rendez-vous, l’appli après une réservation', () => {
    expect(suggestions(config({ formule: 'fonctionnel', metier: 'artisan', options: ['rdv'] }))[0].action).toEqual({ type: 'option', option: 'acompte' });
    expect(suggestions(config({ formule: 'fonctionnel', metier: 'restaurant', options: ['table'] }))[0].action).toEqual({ type: 'option', option: 'pwa' });
  });

  it('ne propose pas deux fois la même option', () => {
    const liste = suggestions(config({ formule: 'fonctionnel', metier: 'artisan', options: ['rdv'] }));
    const optionsProposees = liste.flatMap((s) => (s.action.type === 'option' ? [s.action.option] : []));
    expect(new Set(optionsProposees).size).toBe(optionsProposees.length);
    expect(liste).toHaveLength(2);
    expect(liste[1].action).toEqual({ type: 'option', option: 'pwa' });
  });

  it('propose de monter en gamme selon la formule et le métier', () => {
    expect(suggestions(config({ formule: 'vitrine', metier: 'artisan' }))[0].action).toEqual({
      type: 'formule',
      formule: 'vitrinePlus',
    });
    expect(suggestions(config({ formule: 'vitrinePlus', metier: 'restaurant' }))[0].titre).toBe(
      'Des réservations sans téléphone ?',
    );
    expect(suggestions(config({ formule: 'vitrinePlus', metier: 'autre' }))).toEqual([]);
  });

  it('en propose deux au plus', () => {
    const liste = suggestions(
      config({ formule: 'fonctionnel', metier: 'autre', options: ['rdv', 'calcul', 'boutique'] }),
    );
    expect(liste.length).toBeLessThanOrEqual(2);
  });

  it("ne propose rien sans formule", () => {
    expect(suggestions(configurationVide)).toEqual([]);
  });
});

describe('comparaisonMarche', () => {
  it("n'a rien à comparer sans formule", () => {
    expect(comparaisonMarche(null, [], 0)).toBeNull();
  });

  it('compare une vitrine aux freelances, avec la source', () => {
    const comparaison = comparaisonMarche('vitrine', [], 99);
    expect(comparaison?.marche).toMatchObject({ fourchette: '300 – 1 200 €', source: 'Plateya, 2026' });
    expect(comparaison?.phrase).toBe('Soit 201 € de moins que le bas de la fourchette du marché.');
    expect(comparaison?.pourcentBas).toBe(25);
    expect(comparaison?.pourcentMonPrix).toBe(8);
  });

  it('choisit le marché e-commerce si la boutique est choisie, sinon le sur mesure', () => {
    expect(comparaisonMarche('fonctionnel', ['boutique'], 1589)?.marche.bas).toBe(3000);
    expect(comparaisonMarche('fonctionnel', ['rdv'], 1389)?.marche.bas).toBe(6000);
  });

  it('reste dans la fourchette si le prix dépasse le bas du marché', () => {
    expect(comparaisonMarche('vitrinePlus', [], 900)?.phrase).toBe(
      'Dans la fourchette du marché, avec un seul interlocuteur local.',
    );
  });

  it('garde des barres visibles et bornées', () => {
    expect(comparaisonMarche('vitrine', [], 10)?.pourcentMonPrix).toBe(4);
    expect(comparaisonMarche('vitrine', [], 5000)?.pourcentMonPrix).toBe(100);
  });
});
