import { disponibilites } from '../../data/rendezvous';
import {
  actualiserDisponibilites,
  bornes,
  corpsReservation,
  creneauxDuJour,
  demandeRdvVide,
  distanceKm,
  etapesRdv,
  jourDisponible,
  validerRdv,
  verifierAdresse,
  type DemandeRdv,
} from './reservation';

const AUJOURDHUI = '2026-11-05'; // jeudi

describe('etapesRdv', () => {
  const abbeville = { statut: 'ok' as const, ville: 'Abbeville', km: 0, base: 'Abbeville', frais: 0, adresse: '12 rue de la Gare, Abbeville' };

  it('en visio ou par téléphone, le créneau s’ouvre tout de suite', () => {
    expect(etapesRdv({ ...demandeRdvVide, lieu: 'visio' }, null)).toEqual({ creneau: true, coordonnees: false });
    expect(etapesRdv({ ...demandeRdvVide, lieu: 'telephone' }, null)).toEqual({ creneau: true, coordonnees: false });
  });

  it('chez vous, il faut une adresse trouvée, dans la zone ou au-delà (ou un géocodage indisponible)', () => {
    const chezVous = { ...demandeRdvVide, lieu: 'chezvous' as const };
    expect(etapesRdv(chezVous, null).creneau).toBe(false);
    expect(etapesRdv(chezVous, { ...abbeville, statut: 'hors-zone', ville: 'Lille', km: 92, frais: 7.88 }).creneau).toBe(true);
    expect(etapesRdv(chezVous, { statut: 'introuvable' }).creneau).toBe(false);
    expect(etapesRdv(chezVous, abbeville).creneau).toBe(true);
    expect(etapesRdv(chezVous, { statut: 'erreur' }).creneau).toBe(true);
  });

  it('les coordonnées s’ouvrent avec un jour et un créneau, et jamais avant le lieu', () => {
    const choisi = { ...demandeRdvVide, lieu: 'visio' as const, jour: '2026-11-17', creneau: '14:00' };
    expect(etapesRdv({ ...choisi, creneau: null }, null).coordonnees).toBe(false);
    expect(etapesRdv(choisi, null).coordonnees).toBe(true);
    expect(etapesRdv({ ...choisi, lieu: 'chezvous' }, null).coordonnees).toBe(false);
  });
});

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

  it('accepte une adresse dans les 50 km d’Amiens ou d’Abbeville, sans frais', async () => {
    const chercher = reponse(lieu(1.8336, 50.1054));
    expect(await verifierAdresse('12 rue de la Gare, Abbeville', chercher)).toEqual({
      statut: 'ok',
      ville: 'Abbeville',
      km: 0,
      base: 'Abbeville',
      frais: 0,
      adresse: '12 rue de la Gare 80100 Abbeville',
    });
    expect(String(chercher.mock.calls[0][0])).toContain('https://data.geopf.fr/geocodage/search?q=12+rue+de+la+Gare');
  });

  it('au-delà de 50 km : frais kilométriques ; signale une adresse introuvable ou un service en panne', async () => {
    const lille = await verifierAdresse('Lille', reponse(lieu(3.0573, 50.6292)));
    expect(lille).toMatchObject({ statut: 'hors-zone' });
    if (lille.statut === 'hors-zone') expect(lille.frais).toBe(Math.round((lille.km - 50) * 0.1875 * 100) / 100);
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
    expect(validerRdv(complete)).toEqual({});
  });

  it('exige l’adresse pour un rendez-vous chez vous, même loin (frais kilométriques)', () => {
    expect(validerRdv({ ...complete, adresse: '' }).adresse).toBeDefined();
    expect(validerRdv(complete)).toEqual({});
    expect(validerRdv({ ...complete, lieu: 'visio', adresse: '' })).toEqual({});
  });

  it('exige le jour, puis le créneau, et des coordonnées valides', () => {
    expect(Object.keys(validerRdv(demandeRdvVide))).toEqual(['adresse', 'jour', 'nom', 'telephone', 'email', 'consentement']);
    expect(Object.keys(validerRdv({ ...complete, creneau: null }))).toEqual(['creneau']);
  });

  it('n’envoie l’adresse que pour un rendez-vous chez vous', () => {
    expect(corpsReservation(complete).adresse).toBe('12 rue de la Gare, Abbeville');
    expect(corpsReservation({ ...complete, lieu: 'telephone' }).adresse).toBeNull();
  });
});

describe('Disponibilités du back-office', () => {
  const depart = structuredClone(disponibilites);
  const lundi = '2030-01-07';
  const aujourdhui = '2030-01-01';

  afterEach(() => {
    Object.assign(disponibilites, structuredClone(depart));
    vi.unstubAllGlobals();
  });

  const api = (corps: unknown, statut = 200) => vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(corps), { status: statut })));

  it('un jour fermé n’est plus réservable et n’a plus de créneau', async () => {
    api({ joursTravailles: [0, 1], creneaux: ['08:00'], joursFermes: [lundi], dureeMinutes: 60, delaiMinJours: 1, horizonJours: 60 });

    expect(await actualiserDisponibilites()).toBe(true);

    expect(jourDisponible(lundi, aujourdhui)).toBe(false);
    expect(creneauxDuJour(lundi, aujourdhui)).toEqual([]);
    expect(creneauxDuJour('2030-01-08', aujourdhui).map((c) => c.debut)).toEqual(['08:00']);
    expect(jourDisponible('2030-01-09', aujourdhui)).toBe(false);
  });

  it.each([
    ['une panne', () => vi.stubGlobal('fetch', vi.fn(async () => Promise.reject(new Error('réseau'))))],
    ['une erreur', () => api({}, 500)],
    ['une réponse illisible', () => api({ joursTravailles: 'tous', creneaux: ['08:00'], joursFermes: [] })],
  ])('garde le réglage de départ après %s', async (_nom, simuler) => {
    simuler();

    expect(await actualiserDisponibilites()).toBe(false);

    expect(disponibilites.creneaux).toEqual(depart.creneaux);
    expect(jourDisponible(lundi, aujourdhui)).toBe(true);
  });
});
