import {
  bornes,
  corpsReservation,
  creneauxDuJour,
  demandeRdvVide,
  distanceKm,
  jourDisponible,
  validerRdv,
  verifierAdresse,
  type DemandeRdv,
} from './reservation';

const AUJOURDHUI = '2026-11-05'; // jeudi

describe('disponibilités', () => {
  it('va de demain à 60 jours', () => {
    expect(bornes(AUJOURDHUI)).toEqual({ min: '2026-11-06', max: '2027-01-04' });
  });

  it('ne propose que les jours travaillés dans les bornes', () => {
    expect(jourDisponible('2026-11-05', AUJOURDHUI)).toBe(false); // aujourd'hui
    expect(jourDisponible('2026-11-06', AUJOURDHUI)).toBe(true); // vendredi
    expect(jourDisponible('2026-11-07', AUJOURDHUI)).toBe(false); // samedi
    expect(jourDisponible('2027-01-05', AUJOURDHUI)).toBe(false); // trop loin
  });

  it('découpe les créneaux d’une heure', () => {
    expect(creneauxDuJour('2026-11-17', AUJOURDHUI).map((c) => c.libelle)).toEqual([
      '09:00 – 10:00',
      '10:30 – 11:30',
      '14:00 – 15:00',
      '15:30 – 16:30',
      '17:00 – 18:00',
    ]);
    expect(creneauxDuJour('2026-11-07', AUJOURDHUI)).toEqual([]);
    expect(creneauxDuJour(null, AUJOURDHUI)).toEqual([]);
  });
});

describe('adresse', () => {
  it('calcule la distance à vol d’oiseau', () => {
    // Amiens → Abbeville : environ 41 km à vol d'oiseau.
    expect(Math.round(distanceKm(49.8942, 2.2958, 50.1054, 1.8336))).toBe(41);
  });

  const reponse = (corps: unknown, ok = true) => vi.fn().mockResolvedValue({ ok, json: async () => corps } as Response);
  const lieu = (lon: number, lat: number, score = 0.9) => ({
    features: [{ geometry: { coordinates: [lon, lat] }, properties: { city: 'Abbeville', label: '12 rue de la Gare 80100 Abbeville', score } }],
  });

  it('accepte une adresse dans les 50 km', async () => {
    const chercher = reponse(lieu(1.8336, 50.1054));
    expect(await verifierAdresse('12 rue de la Gare, Abbeville', chercher)).toEqual({
      statut: 'ok',
      ville: 'Abbeville',
      km: 41,
      adresse: '12 rue de la Gare 80100 Abbeville',
    });
    expect(String(chercher.mock.calls[0][0])).toContain('https://data.geopf.fr/geocodage/search?q=12+rue+de+la+Gare');
  });

  it('signale une adresse trop loin, introuvable ou un service en panne', async () => {
    expect((await verifierAdresse('Lille', reponse(lieu(3.0573, 50.6292)))).statut).toBe('trop-loin');
    expect((await verifierAdresse('???', reponse({ features: [] }))).statut).toBe('introuvable');
    expect((await verifierAdresse('flou', reponse(lieu(2.3, 49.9, 0.2)))).statut).toBe('introuvable');
    expect((await verifierAdresse('x', reponse({}, false))).statut).toBe('erreur');
    expect((await verifierAdresse('x', vi.fn().mockRejectedValue(new Error('réseau')))).statut).toBe('erreur');
  });
});

describe('validation et envoi', () => {
  const complete: DemandeRdv = {
    ...demandeRdvVide,
    adresse: '12 rue de la Gare, Abbeville',
    jour: '2026-11-17',
    creneau: '14:00',
    nom: 'Marie Dupont',
    telephone: '06 12 34 56 78',
    email: 'marie@exemple.fr',
    consentement: true,
  };

  it('accepte une demande complète', () => {
    expect(validerRdv(complete, null)).toEqual({});
  });

  it('exige l’adresse dans la zone pour un rendez-vous chez vous', () => {
    expect(validerRdv({ ...complete, adresse: '' }, null).adresse).toBeDefined();
    expect(validerRdv(complete, { statut: 'trop-loin', ville: 'Lille', km: 99, adresse: '' }).adresse).toMatch(/visio/);
    expect(validerRdv({ ...complete, lieu: 'visio', adresse: '' }, null)).toEqual({});
  });

  it('exige le jour, puis le créneau, et des coordonnées valides', () => {
    expect(Object.keys(validerRdv(demandeRdvVide, null))).toEqual(['adresse', 'jour', 'nom', 'telephone', 'email', 'consentement']);
    expect(Object.keys(validerRdv({ ...complete, creneau: null }, null))).toEqual(['creneau']);
  });

  it('n’envoie l’adresse que pour un rendez-vous chez vous', () => {
    expect(corpsReservation(complete).adresse).toBe('12 rue de la Gare, Abbeville');
    expect(corpsReservation({ ...complete, lieu: 'telephone' }).adresse).toBeNull();
  });
});
