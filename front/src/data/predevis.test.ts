import { origineDuSite } from './pages';
import { calculerEstimation, type Configuration } from './calculs';
import { formatPrix as prix, optionsParMetier, optionsParFormule } from './offres';
import {
  MAX_SUGGESTIONS,
  configurationDepuisBesoins,
  optionsSuggerees,
  preDevis,
  texteDuPreDevis,
} from './predevis';

const config = (changements: Partial<Configuration>): Configuration => ({
  formule: null,
  metier: null,
  options: [],
  precisions: {},
  ...changements,
});

describe('configurationDepuisBesoins', () => {
  it('conseille le Fonctionnel dès qu’un besoin le demande', () => {
    expect(configurationDepuisBesoins('artisan', ['rdv', 'realisations'])).toEqual({
      formule: 'fonctionnel',
      metier: 'artisan',
      options: ['rdv', 'avantapres'],
      precisions: {},
    });
  });

  it('conseille Vitrine+ pour se montrer et être trouvé', () => {
    const resultat = configurationDepuisBesoins('commerce', ['google', 'contact', 'realisations']);
    expect(resultat.formule).toBe('vitrinePlus');
    expect(resultat.options).toEqual(['seo', 'avantapres']);
  });

  it('adapte les options au métier : un restaurant réserve des tables', () => {
    const resultat = configurationDepuisBesoins('restaurant', ['rdv', 'vente']);
    expect(resultat.options).toEqual(['table', 'clickcollect']);
  });

  it('prend le métier « autre » si aucun métier n’est choisi', () => {
    const resultat = configurationDepuisBesoins(null, ['vente']);
    expect(resultat).toMatchObject({ formule: 'fonctionnel', metier: 'autre', options: ['boutique'] });
  });

  it('ne garde que les options proposées pour le métier', () => {
    // « Calculer un prix » n'existe pas pour la santé.
    expect(configurationDepuisBesoins('sante', ['rdv', 'prix']).options).toEqual(['rdv']);
  });

  it('ne tranche pas sans besoin précis', () => {
    expect(configurationDepuisBesoins('artisan', ['sais-pas']).formule).toBeNull();
    expect(configurationDepuisBesoins('artisan', []).formule).toBeNull();
  });
});

describe('optionsSuggerees', () => {
  it('propose d’abord l’option qui complète un pack', () => {
    // rdv choisi : l'acompte complète « Réservation sereine ».
    const suggestions = optionsSuggerees(config({ formule: 'fonctionnel', metier: 'artisan', options: ['rdv'] }));
    expect(suggestions[0]).toBe('acompte');
  });

  it('ne propose jamais une option déjà choisie ni hors catalogue', () => {
    const choisies = config({ formule: 'fonctionnel', metier: 'commerce', options: ['boutique', 'avis'] });
    const suggestions = optionsSuggerees(choisies);
    expect(suggestions).not.toContain('boutique');
    expect(suggestions).not.toContain('avis');
    suggestions.forEach((id) => expect(optionsParMetier.commerce).toContain(id));
  });

  it('propose entre 2 et 4 options quand le catalogue le permet', () => {
    for (const metier of ['artisan', 'commerce', 'restaurant', 'sante', 'autre'] as const) {
      const suggestions = optionsSuggerees(config({ formule: 'fonctionnel', metier }));
      expect(suggestions.length).toBe(MAX_SUGGESTIONS);
      expect(new Set(suggestions).size).toBe(suggestions.length);
    }
    expect(optionsSuggerees(config({ formule: 'vitrine' }))).toEqual(optionsParFormule.vitrine.slice(0, 3));
  });

  it('ne propose rien sans formule', () => {
    expect(optionsSuggerees(config({}))).toEqual([]);
  });
});

describe('preDevis', () => {
  it('reprend la configuration du configurateur, avec la même estimation', () => {
    const configuration = config({ formule: 'fonctionnel', metier: 'artisan', options: ['rdv', 'acompte'] });
    const resultat = preDevis({ metier: 'commerce', besoins: ['vente'] }, configuration);
    expect(resultat.source).toBe('configurateur');
    expect(resultat.formule).toBe('fonctionnel');
    expect(resultat.options).toEqual(['rdv', 'acompte']);
    expect(resultat.fourchette).toEqual(calculerEstimation(configuration).fourchette);
    expect(resultat.delai).toBe('3 à 6 semaines');
  });

  it('se calcule sur les besoins sans configuration', () => {
    const resultat = preDevis({ metier: 'artisan', besoins: ['rdv'] }, null);
    // 989 € + rendez-vous 400 € = 1 389 € → fourchette −5 % / +10 %, arrondie à 10 €.
    expect(resultat).toMatchObject({ source: 'besoins', formule: 'fonctionnel', options: ['rdv'] });
    expect(resultat.fourchette).toEqual({ bas: 1320, haut: 1530 });
    expect(resultat.suggestions[0]).toBe('acompte');
  });

  it('donne un prix fixe pour une vitrine', () => {
    const resultat = preDevis({ metier: 'commerce', besoins: ['contact'] }, null);
    expect(resultat.fourchette).toEqual({ bas: 390, haut: 390 });
    expect(resultat.delai).toBe('1 à 2 semaines');
  });

  it('ignore une configuration vide du configurateur', () => {
    const resultat = preDevis({ metier: 'artisan', besoins: ['rdv'] }, config({}));
    expect(resultat.source).toBe('besoins');
    expect(resultat.formule).toBe('fonctionnel');
  });

  it('reste sans formule ni prix si rien ne permet de trancher', () => {
    expect(preDevis({ metier: null, besoins: ['sais-pas'] }, null)).toEqual({
      source: 'besoins',
      formule: null,
      options: [],
      fourchette: null,
      delai: null,
      suggestions: [],
    });
  });
});

describe('texteDuPreDevis', () => {
  it('présente la formule, le prix, le délai et les suggestions', () => {
    const texte = texteDuPreDevis(preDevis({ metier: 'artisan', besoins: ['rdv'] }, null));
    expect(texte).toContain('Première estimation (indicative)');
    expect(texte).toContain("D'après les besoins que vous avez cochés.");
    expect(texte).toContain('Formule conseillée : Fonctionnel');
    expect(texte).toContain('Options retenues : Rendez-vous en ligne');
    expect(texte).toContain(`Prix estimé : ${prix(1320)} à ${prix(1530)}`);
    expect(texte).toContain('Délai : 3 à 6 semaines');
    expect(texte).toContain(`- Acompte en ligne (+ ${prix(150)})`);
    expect(texte).toContain('TVA non applicable');
    // Le lien mène au site d'où part la demande (preview ou bsandoz.fr), jamais à une page absente.
    expect(texte).toContain(`${window.location.origin}/rendez-vous`);
  });

  it('les liens des mails suivent l’adresse du site ; hors navigateur, l’adresse publique', () => {
    expect(origineDuSite()).toBe(window.location.origin);
    vi.stubGlobal('location', { origin: 'null' });
    try {
      expect(origineDuSite()).toBe('https://bsandoz.fr');
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('affiche un prix unique pour une vitrine', () => {
    expect(texteDuPreDevis(preDevis({ metier: 'commerce', besoins: ['contact'] }, null))).toContain(`Prix estimé : ${prix(390)}`);
  });

  it('liste les trois formules quand rien ne permet de trancher', () => {
    const texte = texteDuPreDevis(preDevis({ metier: null, besoins: ['sais-pas'] }, null));
    expect(texte).toContain('Vos besoins ne permettent pas encore de choisir une formule.');
    expect(texte).toContain(`- Vitrine : à partir de ${prix(99)}`);
    expect(texte).toContain(`- Vitrine+ : à partir de ${prix(390)}`);
    expect(texte).toContain(`- Fonctionnel : à partir de ${prix(989)}`);
    expect(texte).not.toContain('Prix estimé');
  });

  it('reste en texte brut, sans retour chariot isolé', () => {
    const texte = texteDuPreDevis(preDevis({ metier: 'restaurant', besoins: ['rdv'] }, null));
    expect(texte).not.toMatch(/\r/);
    expect(texte).not.toMatch(/<[a-z]/i);
  });
});
