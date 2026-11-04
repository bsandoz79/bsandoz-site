import { modeleApercu } from './apercu';
import { configurationVide, type Configuration } from './calculs';

const config = (partiel: Partial<Configuration>): Configuration => ({ ...configurationVide, ...partiel });

describe('modeleApercu', () => {
  it('est vide sans formule', () => {
    expect(modeleApercu(configurationVide)).toEqual({
      modele: null,
      description: "L'aperçu est vide : aucun type de site choisi.",
    });
  });

  it('montre une vitrine simple avec les boutons de contact, pour « Votre entreprise » par défaut', () => {
    const { modele, description } = modeleApercu(config({ formule: 'vitrine' }));
    expect(modele).toMatchObject({
      name: 'Votre entreprise',
      accent: '#16213E',
      nav: ['Accueil', 'Prestations'],
      cta: 'Me contacter',
      search: undefined,
      logo: undefined,
      install: undefined,
    });
    expect(modele?.sections).toEqual([{ type: 'contactButtons', buttons: ['Appeler', 'Écrire un mail'] }]);
    expect(description).toBe("Aperçu d'exemple du site « Votre entreprise ».");
  });

  it('prend le nom, la couleur et l’accroche du métier', () => {
    const { modele } = modeleApercu(config({ formule: 'vitrinePlus', metier: 'restaurant' }));
    expect(modele).toMatchObject({ name: 'Le Petit Comptoir', accent: '#B5452B', domain: 'www.le-petit-comptoir.fr' });
    // Vitrine+ : référencement local, donc résultat Google et formulaire de contact.
    expect(modele?.search?.query).toBe('Google · « restaurant Amiens »');
    expect(modele?.nav).toContain('Contact');
    expect(modele?.sections.at(-1)).toEqual({ type: 'contactForm', title: 'Contact' });
  });

  it('ajoute chaque fonction choisie, avec ses précisions', () => {
    const { modele, description } = modeleApercu(
      config({
        formule: 'fonctionnel',
        metier: 'artisan',
        options: ['rdv', 'acompte', 'calcul', 'espace'],
        precisions: { rdv: 'client', calcul: 'surface' },
      }),
    );
    expect(modele?.cta).toBe('Réserver');
    expect(modele?.navBadges).toEqual(['Mon compte']);
    expect(modele?.sections[0]).toMatchObject({ type: 'calculator', label: 'Surface', value: '120 m²' });
    expect(modele?.sections[1]).toMatchObject({
      type: 'booking',
      subtitle: "À domicile · frais selon l'adresse",
      deposit: 'Acompte de 30 € payé en ligne · carte, Apple Pay, Google Pay',
    });
    // Pack Réservation sereine : les avis Google offerts apparaissent aussi.
    expect(modele?.sections.some((s) => s.type === 'reviews')).toBe(true);
    expect(description).toContain('rendez-vous en ligne');
    expect(description).toContain('avis google affichés');
  });

  it('montre la boutique, le click & collect, la galerie, l’avant/après, le logo, l’anglais et l’appli', () => {
    const { modele } = modeleApercu(
      config({ formule: 'vitrine', options: ['galerie', 'logo', 'page'] }),
    );
    expect(modele?.logo).toBe('VE');
    expect(modele?.nav).toEqual(['Accueil', 'Prestations', 'Réalisations', 'À propos']);
    expect(modele?.sections.map((s) => s.type)).toEqual(['gallery', 'contactButtons']);

    const commerce = modeleApercu(
      config({ formule: 'fonctionnel', metier: 'commerce', options: ['boutique', 'clickcollect', 'pwa'] }),
    ).modele;
    expect(commerce?.cta).toBe('Voir la boutique');
    expect(commerce?.nav).toContain('Boutique');
    expect(commerce?.sections.map((s) => s.type)).toEqual(['shop', 'note', 'contactForm']);
    expect(commerce?.install?.title).toBe("Installer l'appli");

    const vplus = modeleApercu(config({ formule: 'vitrinePlus', options: ['avantapres', 'anglais'] })).modele;
    expect(vplus?.navBadges).toEqual(['FR | EN']);
    expect(vplus?.sections[0]).toMatchObject({ type: 'beforeAfter' });
  });

  it('met la réservation de table en avant pour un restaurant', () => {
    const { modele } = modeleApercu(config({ formule: 'fonctionnel', metier: 'restaurant', options: ['table'] }));
    expect(modele?.cta).toBe('Réserver une table');
    expect(modele?.sections[0]).toMatchObject({ type: 'table' });
  });
});
