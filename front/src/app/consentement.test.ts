import { act, renderHook } from '@testing-library/react';
import {
  CLE_CONSENTEMENT,
  DUREE_CHOIX_MS,
  choisir,
  fermerPourLInstant,
  reinitialiserConsentement,
  rouvrirBandeau,
  useConsentement,
} from './consentement';

const etat = () => renderHook(() => useConsentement()).result;

describe('Consentement aux services tiers', () => {
  beforeEach(() => {
    window.localStorage.clear();
    reinitialiserConsentement();
  });

  it('première visite : aucun choix, bandeau affiché', () => {
    expect(etat().current).toEqual({ choix: null, bandeauVisible: true });
  });

  it('« Accepter » ou « Refuser » : choix gardé, bandeau fermé, toujours là au rechargement', () => {
    const resultat = etat();
    act(() => choisir('refuse'));
    expect(resultat.current).toEqual({ choix: 'refuse', bandeauVisible: false });
    expect(JSON.parse(window.localStorage.getItem(CLE_CONSENTEMENT)!)).toMatchObject({ choix: 'refuse' });

    act(() => reinitialiserConsentement()); // rechargement de la page
    expect(resultat.current).toEqual({ choix: 'refuse', bandeauVisible: false });
  });

  it('fermer sans choisir : bandeau caché pour cette visite, de retour au rechargement', () => {
    const resultat = etat();
    act(() => fermerPourLInstant());
    expect(resultat.current).toEqual({ choix: null, bandeauVisible: false });
    expect(window.localStorage.getItem(CLE_CONSENTEMENT)).toBeNull();

    act(() => reinitialiserConsentement());
    expect(resultat.current.bandeauVisible).toBe(true);
  });

  it('un choix de plus de 6 mois est redemandé', () => {
    const ancien = Date.now() - DUREE_CHOIX_MS - 1000;
    window.localStorage.setItem(CLE_CONSENTEMENT, JSON.stringify({ choix: 'accepte', date: ancien }));
    expect(etat().current).toEqual({ choix: null, bandeauVisible: true });
  });

  it('ignore une valeur abîmée et efface l’ancienne clé de la carte', () => {
    window.localStorage.setItem(CLE_CONSENTEMENT, '{pas du json');
    window.localStorage.setItem('bsandoz.carte', 'oui');
    expect(etat().current.choix).toBeNull();
    expect(window.localStorage.getItem('bsandoz.carte')).toBeNull();
  });

  it('le pied de page rouvre le bandeau pour changer d’avis', () => {
    const resultat = etat();
    act(() => choisir('accepte'));
    act(() => rouvrirBandeau());
    expect(resultat.current).toEqual({ choix: 'accepte', bandeauVisible: true });
  });
});
