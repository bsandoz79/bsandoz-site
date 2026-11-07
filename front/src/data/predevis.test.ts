import { origineDuSite } from './pages';
import type { Configuration } from './calculs';
import { MAX_SUGGESTIONS, optionsSuggerees, preDevis, texteDuPreDevis } from './predevis';

const config = (changements: Partial<Configuration>): Configuration => ({
  formule: null,
  metier: null,
  options: [],
  precisions: {},
  ...changements,
});

describe('optionsSuggerees', () => {
  it('propose les autres options de la formule et du métier, sans celles déjà choisies', () => {
    const suggestions = optionsSuggerees(config({ formule: 'fonctionnel', metier: 'artisan', options: ['rdv'] }));
    expect(suggestions).toEqual(['acompte', 'calcul', 'pwa']);
    expect(suggestions).toHaveLength(MAX_SUGGESTIONS);
  });

  it('ne propose rien sans formule', () => {
    expect(optionsSuggerees(config({}))).toEqual([]);
  });
});

describe('preDevis', () => {
  it('reprend l’estimation : formule, options incluses, fourchette et délai', () => {
    const p = preDevis(config({ formule: 'fonctionnel', metier: 'sante', options: ['rdv', 'avis'] }));
    expect(p).toMatchObject({
      formule: 'fonctionnel',
      options: ['rdv', 'avis'],
      incluses: ['avis'],
      fourchette: { bas: 1320, haut: 1530 },
      delai: '3 à 6 semaines',
    });
  });

  it('donne un prix fixe pour une vitrine', () => {
    expect(preDevis(config({ formule: 'vitrine', options: ['logo'] }))?.fourchette).toEqual({ bas: 99, haut: 99 });
  });

  it('n’existe pas sans formule', () => {
    expect(preDevis(config({}))).toBeNull();
  });
});

describe('texteDuPreDevis', () => {
  it('met en forme l’estimation pour l’e-mail, avec les options incluses signalées', () => {
    const texte = texteDuPreDevis(preDevis(config({ formule: 'vitrinePlus', options: ['logo', 'seo', 'anglais'] }))!);
    expect(texte).toContain('Votre estimation (indicative)');
    expect(texte).toContain('Formule : Vitrine+');
    expect(texte).toContain('Options : Logo simple (incluse), SEO avancé (incluse), Site en anglais');
    expect(texte).toMatch(/Prix estimé : 540\s€/);
    expect(texte).toContain('Délai : 1 à 2 semaines');
    expect(texte).toContain('TVA non applicable');
    expect(texte).toContain(`${origineDuSite()}/rendez-vous`);
  });
});
