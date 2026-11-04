import {
  calculerEstimation,
  comparaisonMarche,
  configurationVide,
  garderOptionsValides,
  optionsDisponibles,
  packsActifs,
  suggestions,
  type Configuration,
} from './calculs';

const config = (partiel: Partial<Configuration>): Configuration => ({ ...configurationVide, ...partiel });

describe('optionsDisponibles', () => {
  it("ne propose rien tant qu'aucune formule n'est choisie", () => {
    expect(optionsDisponibles(null, 'artisan')).toEqual([]);
  });

  it('propose la même liste pour Vitrine et Vitrine+, quel que soit le métier', () => {
    expect(optionsDisponibles('vitrine', null)).toEqual(['page', 'galerie', 'textes', 'logo']);
    expect(optionsDisponibles('vitrinePlus', 'restaurant')).toEqual(['avantapres', 'avis', 'textes', 'logo', 'seo', 'anglais']);
  });

  it('attend le métier pour le Fonctionnel, puis propose sa liste', () => {
    expect(optionsDisponibles('fonctionnel', null)).toEqual([]);
    expect(optionsDisponibles('fonctionnel', 'restaurant')).toEqual(['table', 'clickcollect', 'avis', 'pwa', 'anglais']);
  });
});

describe('garderOptionsValides', () => {
  it('retire les options qui ne sont plus proposées', () => {
    expect(garderOptionsValides(['logo', 'galerie', 'textes'], 'vitrinePlus', null)).toEqual(['logo', 'textes']);
    expect(garderOptionsValides(['rdv', 'boutique'], 'fonctionnel', 'artisan')).toEqual(['rdv']);
  });
});

describe('packsActifs', () => {
  it('active un pack quand toutes ses options sont choisies', () => {
    const [actif] = packsActifs(['rdv', 'acompte']);
    expect(actif.pack.nom).toBe('Pack Réservation sereine');
    expect(actif).toMatchObject({ offerte: 'avis', valeur: 60, dejaChoisie: false });
  });

  it("n'active rien si une option manque", () => {
    expect(packsActifs(['rdv'])).toEqual([]);
  });

  it("n'offre une même option qu'une fois", () => {
    const actifs = packsActifs(['rdv', 'acompte', 'table', 'clickcollect']);
    expect(actifs.map((a) => a.offerte)).toEqual(['avis']);
  });

  it('cumule des packs différents', () => {
    const actifs = packsActifs(['rdv', 'acompte', 'espace']);
    expect(actifs.map((a) => a.pack.id)).toEqual(['reservation', 'toutEnUn']);
  });

  it("signale quand l'option offerte était déjà choisie", () => {
    expect(packsActifs(['logo', 'textes', 'page'])[0].dejaChoisie).toBe(true);
  });
});

describe('calculerEstimation', () => {
  it('est vide sans formule', () => {
    expect(calculerEstimation(configurationVide)).toMatchObject({ lignes: [], total: 0, delai: null, fourchette: null });
  });

  it('additionne la formule et les options, sans fourchette pour une vitrine', () => {
    const estimation = calculerEstimation(config({ formule: 'vitrine', options: ['page', 'galerie'] }));
    expect(estimation.lignes).toEqual([
      { libelle: 'Site Vitrine', prix: 99 },
      { libelle: 'Page supplémentaire', prix: 50 },
      { libelle: 'Galerie photos', prix: 80 },
    ]);
    expect(estimation).toMatchObject({ valeur: 229, offert: 0, total: 229, delai: '3 jours', fourchette: null });
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

  it("offre l'option d'un pack : valeur barrée, montant offert et prix payé", () => {
    const estimation = calculerEstimation(config({ formule: 'fonctionnel', metier: 'artisan', options: ['rdv', 'acompte'] }));
    expect(estimation.lignes.at(-1)).toEqual({ libelle: 'Avis Google affichés', prix: 60, offerte: true });
    expect(estimation).toMatchObject({ valeur: 989 + 400 + 150 + 60, offert: 60, total: 989 + 400 + 150 });
  });

  it("rend gratuite l'option offerte si elle était déjà choisie", () => {
    const estimation = calculerEstimation(config({ formule: 'vitrine', options: ['logo', 'textes', 'page'] }));
    expect(estimation).toMatchObject({ valeur: 99 + 150 + 60 + 50, offert: 50, total: 99 + 150 + 60 });
    expect(estimation.lignes.some((ligne) => ligne.offerte)).toBe(false);
  });

  it('donne une fourchette −5 % / +10 % arrondie à 10 € pour le Fonctionnel', () => {
    const estimation = calculerEstimation(config({ formule: 'fonctionnel', metier: 'sante', options: ['rdv'] }));
    expect(estimation.total).toBe(1389);
    expect(estimation.fourchette).toEqual({ bas: 1320, haut: 1530 });
    expect(estimation.delai).toBe('3 à 6 semaines');
  });
});

describe('suggestions', () => {
  it('propose de compléter un pack presque complet', () => {
    const [suggestion] = suggestions(config({ formule: 'fonctionnel', metier: 'artisan', options: ['rdv'] }));
    expect(suggestion).toEqual({
      titre: 'Pack Réservation sereine',
      texte: 'Ajoutez « Acompte en ligne » et je vous offre « Avis Google affichés » (valeur 60 €).',
      libelle: "Ajouter et profiter de l'offre",
      action: { type: 'option', option: 'acompte' },
    });
  });

  it("ne propose pas un pack dont une option n'est pas proposée pour ce métier", () => {
    // Restaurant : pas de rendez-vous, donc pas de Pack Réservation sereine.
    const liste = suggestions(config({ formule: 'fonctionnel', metier: 'restaurant', options: ['table'] }));
    expect(liste[0].action).toEqual({ type: 'option', option: 'clickcollect' });
    expect(liste.map((s) => s.titre)).not.toContain('Pack Réservation sereine');
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
