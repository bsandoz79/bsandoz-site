import {
  CLE_STOCKAGE,
  chargerEtat,
  enregistrerEtat,
  etatDepuisAdresse,
  etatVide,
  formuleDepuisAdresse,
  lireEtat,
  ongletDepuisAdresse,
} from './stockage';

describe('stockage du configurateur', () => {
  beforeEach(() => window.localStorage.clear());

  it('relit un état valide', () => {
    const etat = {
      onglet: 'informatique',
      config: { formule: 'fonctionnel', metier: 'artisan', options: ['rdv', 'acompte'], precisions: { rdv: 'client' } },
      informatique: { public: 'professionnel', services: ['linux'] },
    };
    expect(lireEtat(etat)).toEqual(etat);
  });

  it('ignore les valeurs inconnues ou incohérentes', () => {
    const etat = lireEtat({
      onglet: 'autre',
      config: {
        formule: 'premium',
        metier: 'pirate',
        options: ['rdv', 'inconnue'],
        precisions: { rdv: 'nulle-part', boutique: 'p20' },
      },
      informatique: { public: 'robot', services: ['linux', 'linux', 'reseau', 'xx'] },
    });
    expect(etat).toEqual({
      onglet: 'web',
      config: { formule: null, metier: null, options: [], precisions: { boutique: 'p20' } },
      informatique: { public: null, services: ['linux'] },
    });
  });

  it('retire les options qui ne correspondent pas à la formule enregistrée', () => {
    const etat = lireEtat({ config: { formule: 'vitrine', options: ['page', 'rdv'] } });
    expect(etat.config.options).toEqual(['page']);
  });

  it('retombe sur un état vide si rien n’est lisible', () => {
    expect(lireEtat(null)).toEqual(etatVide);
    window.localStorage.setItem(CLE_STOCKAGE, '{pas du json');
    expect(chargerEtat()).toEqual(etatVide);
  });

  it('enregistre puis recharge l’état', () => {
    const etat = { ...etatVide, config: { ...etatVide.config, formule: 'vitrine' as const } };
    enregistrerEtat(etat);
    expect(chargerEtat()).toEqual(etat);
  });

  it('ne plante pas si le stockage est bloqué', () => {
    const espion = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloqué');
    });
    const espion2 = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('bloqué');
    });
    expect(chargerEtat()).toEqual(etatVide);
    expect(() => enregistrerEtat(etatVide)).not.toThrow();
    espion.mockRestore();
    espion2.mockRestore();
  });

  it('lit l’onglet demandé dans l’adresse', () => {
    expect(ongletDepuisAdresse('?onglet=informatique')).toBe('informatique');
    expect(ongletDepuisAdresse('?onglet=web')).toBe('web');
    expect(ongletDepuisAdresse('?onglet=autre')).toBeNull();
  });

  it('applique formule et métier de l’adresse en gardant les options compatibles', () => {
    const enregistre = {
      ...etatVide,
      onglet: 'informatique' as const,
      config: { formule: 'fonctionnel' as const, metier: 'artisan' as const, options: ['rdv' as const, 'calcul' as const], precisions: {} },
    };
    const etat = etatDepuisAdresse(enregistre, '?formule=fonctionnel&metier=sante');
    expect(etat.onglet).toBe('web');
    expect(etat.config).toMatchObject({ formule: 'fonctionnel', metier: 'sante', options: ['rdv'] });
    expect(etatDepuisAdresse(enregistre, '?metier=pirate')).toBe(enregistre);
    expect(etatDepuisAdresse(etatVide, '?onglet=informatique').onglet).toBe('informatique');
  });

  it('lit la formule demandée dans l’adresse', () => {
    expect(formuleDepuisAdresse('?formule=vitrinePlus')).toBe('vitrinePlus');
    expect(formuleDepuisAdresse('?formule=premium')).toBeNull();
    expect(formuleDepuisAdresse('')).toBeNull();
  });
});
