import {
  CLE_BROUILLON,
  chargerBrouillon,
  construireEnvoi,
  demandeVide,
  effacerBrouillon,
  enregistrerBrouillon,
  lignesRecapitulatif,
  lireBrouillon,
  resumeConfiguration,
  titreDemande,
  validerEtape,
  verifierPhotos,
  type Demande,
  besoinsDepuisEstimation,
  demandeRemiseAZero,
  demarrerDevis,
  signatureEstimation,
} from './demande';

const complete: Demande = {
  metier: 'artisan',
  besoins: ['rdv', 'prix'],
  description: 'Je fais du nettoyage de voitures à domicile.',
  lien: 'https://exemple.fr',
  budget: '1000-2000',
  delai: 'mois',
  nom: 'Marie Dupont',
  entreprise: 'Brillance',
  email: 'marie@exemple.fr',
  telephone: '06 12 34 56 78',
  consentement: true,
};

const photo = (nom: string, type = 'image/jpeg', taille = 1000) => new File([new Uint8Array(taille)], nom, { type });

describe('validerEtape', () => {
  it('accepte une demande complète à chaque étape', () => {
    for (let etape = 0; etape < 5; etape++) expect(validerEtape(etape, complete)).toEqual({});
  });

  it('exige les champs de chaque étape', () => {
    expect(Object.keys(validerEtape(0, demandeVide))).toEqual(['metier']);
    expect(Object.keys(validerEtape(1, demandeVide))).toEqual(['besoins']);
    expect(Object.keys(validerEtape(2, demandeVide))).toEqual(['description']);
    expect(Object.keys(validerEtape(3, demandeVide))).toEqual(['budget', 'delai']);
    expect(Object.keys(validerEtape(4, demandeVide))).toEqual(['nom', 'email', 'consentement']);
  });

  it('vérifie le format du lien, de l’e-mail et du téléphone', () => {
    expect(validerEtape(2, { ...complete, lien: 'exemple' }).lien).toBeDefined();
    expect(validerEtape(4, { ...complete, email: 'marie@exemple' }).email).toBeDefined();
    expect(validerEtape(4, { ...complete, telephone: '12' }).telephone).toBeDefined();
    expect(validerEtape(4, { ...complete, telephone: '' })).toEqual({});
  });
});

describe('verifierPhotos', () => {
  it('limite le nombre, le type et la taille', () => {
    expect(verifierPhotos([photo('a.jpg'), photo('b.png', 'image/png')])).toBeUndefined();
    expect(verifierPhotos([photo('a.jpg'), photo('b.jpg'), photo('c.jpg'), photo('d.jpg')])).toBe('3 photos au maximum.');
    expect(verifierPhotos([photo('a.pdf', 'application/pdf')])).toMatch(/JPEG, PNG ou WebP/);
    expect(verifierPhotos([photo('a.jpg', 'image/jpeg', 6 * 1024 * 1024)])).toMatch(/5 Mo/);
  });
});

describe('brouillon', () => {
  beforeEach(() => window.localStorage.clear());

  it('enregistre, recharge et efface le brouillon', () => {
    enregistrerBrouillon(complete, 3, 'signature');
    expect(chargerBrouillon()).toEqual({ demande: complete, etape: 3, depuis: 'signature' });
    effacerBrouillon();
    expect(chargerBrouillon()).toEqual({ demande: demandeVide, etape: 0, depuis: null });
  });

  it('ignore les valeurs inattendues', () => {
    window.localStorage.setItem(
      CLE_BROUILLON,
      JSON.stringify({ etape: 12, demande: { metier: 'pirate', besoins: ['rdv', 'xx'], budget: 'million', consentement: 'oui' } }),
    );
    const { demande, etape } = chargerBrouillon();
    expect(etape).toBe(4);
    expect(demande).toMatchObject({ metier: null, besoins: ['rdv'], budget: null, consentement: false });
    expect(lireBrouillon('texte')).toEqual({ demande: demandeVide, etape: 0, depuis: null });
  });
});

describe('récapitulatif et envoi', () => {
  const config = { formule: 'fonctionnel' as const, metier: 'artisan' as const, options: ['rdv' as const], precisions: {} };

  it('résume la configuration du configurateur', () => {
    expect(resumeConfiguration(config)).toEqual({
      formule: 'Site Fonctionnel',
      options: ['Rendez-vous en ligne'],
      estimation: '1 320 € – 1 530 €',
    });
    expect(resumeConfiguration(null)).toBeNull();
  });

  it('liste les réponses lisiblement', () => {
    const lignes = Object.fromEntries(lignesRecapitulatif(complete, config));
    expect(lignes).toMatchObject({
      Activité: 'Artisan à domicile',
      Besoins: 'Prendre des rendez-vous, Calculer un prix',
      Budget: '1 000 à 2 000 €',
      Délai: 'Dans le mois',
      Configuration: 'Site Fonctionnel, Rendez-vous en ligne',
      'E-mail': 'marie@exemple.fr',
    });
  });

  it('prépare l’envoi avec le piège anti-robots et les photos', () => {
    const donnees = construireEnvoi(complete, null, [photo('a.jpg')], '');
    expect(donnees.get('email')).toBe('marie@exemple.fr');
    expect(donnees.get('site_web')).toBe('');
    expect(donnees.get('recapitulatif')).toContain('Projet : Je fais du nettoyage de voitures à domicile.');
    expect(donnees.getAll('photos[]')).toHaveLength(1);
  });

  it('joint le pré-devis calculé d’après les besoins', () => {
    const predevis = String(construireEnvoi(complete, null, [], '').get('predevis'));
    expect(predevis).toContain('Première estimation (indicative)');
    expect(predevis).toContain('Formule conseillée : Fonctionnel');
    expect(predevis).toContain('Options retenues : Rendez-vous en ligne, Calculateur de prix');
  });

  it('joint le pré-devis de la configuration du configurateur quand elle existe', () => {
    const predevis = String(construireEnvoi(complete, config, [], '').get('predevis'));
    expect(predevis).toContain('configuration faite dans « Composer mon site »');
    expect(predevis).toContain('Options retenues : Rendez-vous en ligne');
  });

  it('envoie aussi le téléphone, l’entreprise et un titre lisible (pour l’API et l’espace client)', () => {
    const donnees = construireEnvoi(complete, config, [], '');
    expect(donnees.get('telephone')).toBe('06 12 34 56 78');
    expect(donnees.get('entreprise')).toBe('Brillance');
    expect(donnees.get('titre')).toBe('Site Fonctionnel · Rendez-vous en ligne');
  });
});

describe('titreDemande', () => {
  const config = { formule: 'fonctionnel' as const, metier: 'artisan' as const, options: ['rdv' as const], precisions: {} };

  it('reprend la configuration, sinon les besoins, sinon un titre par défaut', () => {
    expect(titreDemande(complete, config)).toBe('Site Fonctionnel · Rendez-vous en ligne');
    expect(titreDemande(complete, null)).toBe('Prendre des rendez-vous, Calculer un prix');
    expect(titreDemande({ ...complete, besoins: ['sais-pas'] }, null)).toBe('Projet de site');
  });
});

describe('reprise depuis la dernière estimation', () => {
  const fonctionnel = { formule: 'fonctionnel' as const, metier: 'artisan' as const, options: ['rdv' as const, 'calcul' as const], precisions: {} };
  const vitrine = { formule: 'vitrine' as const, metier: null, options: ['galerie' as const], precisions: {} };
  const vide = { demande: demandeVide, etape: 0, depuis: null };

  it('ne coche que les besoins des options réellement choisies', () => {
    expect(besoinsDepuisEstimation(fonctionnel)).toEqual(['rdv', 'prix']);
    expect(besoinsDepuisEstimation(vitrine)).toEqual(['realisations']);
    // Vitrine + rédaction des textes : aucune option ne correspond à un besoin, rien n'est coché d'office.
    expect(besoinsDepuisEstimation({ ...vitrine, options: ['textes'] })).toEqual([]);
    expect(besoinsDepuisEstimation({ ...vitrine, formule: 'vitrinePlus', options: [] })).toEqual([]);
  });

  it('nouvelle estimation : devis neuf, rien des essais précédents sauf les coordonnées', () => {
    const ancien = {
      demande: { ...demandeVide, metier: 'commerce' as const, besoins: ['vente' as const], description: 'Mon texte déjà écrit, assez long.', nom: 'Marie', email: 'marie@exemple.fr', delai: 'mois' },
      etape: 4,
      depuis: 'une ancienne estimation',
    };
    const depart = demarrerDevis(ancien, fonctionnel);
    expect(depart.prerempli).toBe(true);
    expect(depart.depuis).toBe(signatureEstimation(fonctionnel));
    expect(depart.demande).toEqual({
      ...demandeVide,
      metier: 'artisan',
      besoins: ['rdv', 'prix'],
      nom: 'Marie',
      email: 'marie@exemple.fr',
    });
    // Activité et besoins viennent de l'estimation : on commence par « Avec vos mots ».
    expect(depart.etape).toBe(2);
    // Vitrine + rédaction, après un essai où une activité avait été choisie : rien n'est repris de l'essai.
    const vitrineTextes = demarrerDevis(ancien, { ...vitrine, options: ['textes'] });
    expect(vitrineTextes.demande).toMatchObject({ metier: null, besoins: [], budget: null, description: '' });
    expect(vitrineTextes.etape).toBe(0);
  });

  it('même estimation : le brouillon est repris tel quel, là où il s’était arrêté', () => {
    const encours = { demande: { ...demandeVide, metier: 'sante' as const }, etape: 1, depuis: signatureEstimation(fonctionnel) };
    expect(demarrerDevis(encours, fonctionnel)).toEqual({ ...encours, prerempli: true });
  });

  it('sans estimation : le brouillon est repris tel quel', () => {
    expect(demarrerDevis(vide, null)).toEqual({ ...vide, prerempli: false });
  });

  it('l’empreinte ne dépend pas de l’ordre des options', () => {
    expect(signatureEstimation({ ...fonctionnel, options: ['calcul', 'rdv'] })).toBe(signatureEstimation(fonctionnel));
    expect(signatureEstimation({ ...fonctionnel, options: ['rdv'] })).not.toBe(signatureEstimation(fonctionnel));
  });

  it('repartir de zéro garde seulement les coordonnées', () => {
    expect(demandeRemiseAZero({ ...complete })).toEqual({
      ...demandeVide,
      nom: complete.nom,
      entreprise: complete.entreprise,
      email: complete.email,
      telephone: complete.telephone,
    });
  });
});
