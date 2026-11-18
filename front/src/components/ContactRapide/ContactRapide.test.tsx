import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { pages } from '../../data/pages';
import { construireEnvoiContact, messageVide, validerContact, type MessageContact } from './contact';
import { ContactRapide } from './ContactRapide';
import { urlEnvoiDevis } from '../../data/devis';

const complet: MessageContact = {
  demande: 'devis',
  nom: 'Marie Dupont',
  entreprise: 'Dupont Jardins',
  telephone: '06 12 34 56 78',
  email: 'marie@exemple.fr',
  activite: 'Paysagiste',
  projet: 'Je suis paysagiste, je voudrais que mes clients réservent en ligne.',
  ville: '',
  style: 'sobre',
  consentement: true,
};

const maquette: MessageContact = { ...complet, demande: 'maquette', telephone: '', ville: 'Amiens', style: 'chaleureux' };

describe('validerContact', () => {
  it('signale chaque champ obligatoire manquant ou invalide', () => {
    expect(Object.keys(validerContact(messageVide))).toEqual(['nom', 'telephone', 'email', 'activite', 'projet', 'consentement']);
    expect(validerContact({ ...complet, telephone: '12', email: 'x@y' })).toEqual({
      telephone: 'Numéro de téléphone invalide.',
      email: 'Adresse e-mail invalide.',
    });
    expect(validerContact(complet)).toEqual({});
  });

  it('l’entreprise est facultative ; le métier doit être écrit', () => {
    expect(validerContact({ ...complet, entreprise: '' })).toEqual({});
    expect(validerContact({ ...complet, activite: 'A' })).toEqual({ activite: 'Indiquez votre métier ou votre activité.' });
  });
});

describe('validerContact pour une maquette gratuite', () => {
  it('demande la ville ; le téléphone devient facultatif mais reste vérifié', () => {
    expect(validerContact(maquette)).toEqual({});
    expect(validerContact({ ...maquette, ville: '' })).toEqual({ ville: 'Indiquez votre ville.' });
    expect(validerContact({ ...maquette, telephone: '12' })).toEqual({ telephone: 'Numéro de téléphone invalide.' });
    expect(validerContact({ ...complet, telephone: '' })).toEqual({ telephone: 'Numéro de téléphone invalide.' });
  });

  it('envoie une demande « Maquette gratuite » avec la ville et le style', () => {
    const donnees = construireEnvoiContact(maquette, '');
    expect(donnees.get('titre')).toBe('Maquette gratuite · Paysagiste');
    const recap = String(donnees.get('recapitulatif'));
    expect(recap).toContain('Ville : Amiens');
    expect(recap).toContain('Style : Chaleureux');
    expect(recap).toContain('72 h ouvrées');
  });
});

describe('construireEnvoiContact', () => {
  it('envoie à l’API le même contrat qu’avant, sans pré-devis', () => {
    const donnees = construireEnvoiContact(complet, '');
    expect(donnees.get('nom')).toBe('Marie Dupont');
    expect(donnees.get('entreprise')).toBe('Dupont Jardins');
    expect(donnees.get('titre')).toBe('Projet · Paysagiste');
    expect(donnees.get('predevis')).toBe('');
    const recapitulatif = String(donnees.get('recapitulatif'));
    expect(recapitulatif).toContain('Activité : Paysagiste');
    expect(recapitulatif).toContain('Projet : Je suis paysagiste');
    expect(recapitulatif.length).toBeGreaterThanOrEqual(20);
  });

  it('transmet le champ piège tel quel (le serveur ignore alors la demande)', () => {
    expect(construireEnvoiContact(complet, 'https://spam.example').get('site_web')).toBe('https://spam.example');
  });
});

describe('ContactRapide', () => {
  const afficher = () =>
    render(
      <MemoryRouter>
        <ContactRapide />
      </MemoryRouter>,
    );

  async function remplir(user: ReturnType<typeof userEvent.setup>) {
    await user.type(screen.getByRole('textbox', { name: /Prénom et nom/ }), complet.nom);
    await user.type(screen.getByRole('textbox', { name: /Entreprise/ }), complet.entreprise);
    await user.type(screen.getByRole('textbox', { name: /E-mail/ }), complet.email);
    await user.type(screen.getByRole('textbox', { name: /Téléphone/ }), complet.telephone);
    await user.type(screen.getByRole('combobox', { name: /Votre métier ou activité/ }), complet.activite);
    await user.type(screen.getByRole('textbox', { name: /Votre projet/ }), complet.projet);
    await user.click(screen.getByRole('checkbox', { name: /J'accepte/ }));
  }

  afterEach(() => vi.unstubAllGlobals());

  it('explique les erreurs sans rien envoyer', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    afficher();

    await user.click(screen.getByRole('button', { name: 'Envoyer ma demande' }));

    expect(screen.getByText('Indiquez votre nom.')).toBeInTheDocument();
    expect(screen.getByText('Indiquez votre métier ou votre activité.')).toBeInTheDocument();
    expect(screen.getByText('Décrivez votre projet en quelques mots.')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('le métier se tape : il propose de finir le mot, ou garde ce qui est écrit', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('fetch', vi.fn());
    afficher();
    const champ = screen.getByRole('combobox', { name: /Votre métier ou activité/ });
    await user.type(champ, 'avo');
    await user.click(screen.getByRole('option', { name: 'Avocat' }));
    expect(champ).toHaveValue('Avocat');
    await user.clear(champ);
    await user.type(champ, 'Sculpteur');
    expect(champ).toHaveValue('Sculpteur');
  });

  it('envoie la demande et remercie', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    afficher();

    await remplir(user);
    await user.click(screen.getByRole('button', { name: 'Envoyer ma demande' }));

    expect(await screen.findByRole('status')).toHaveTextContent('Merci, c’est bien reçu !');
    expect(fetchMock).toHaveBeenCalledWith(urlEnvoiDevis, expect.objectContaining({ method: 'POST' }));
    const envoi = fetchMock.mock.calls[0][1].body as FormData;
    expect(envoi.get('titre')).toBe('Projet · Paysagiste');
    expect(envoi.get('entreprise')).toBe('Dupont Jardins');
  }, 15_000);

  it('signale un échec et garde les réponses', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 500 })));
    afficher();

    await remplir(user);
    await user.click(screen.getByRole('button', { name: 'Envoyer ma demande' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('L’envoi n’a pas abouti.');
    expect(screen.getByRole('textbox', { name: /Prénom et nom/ })).toHaveValue('Marie Dupont');
  }, 15_000);

  it('demande de patienter quand le serveur limite les envois', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 429 })));
    afficher();

    await remplir(user);
    await user.click(screen.getByRole('button', { name: 'Envoyer ma demande' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Merci de patienter une minute');
  }, 15_000);

  it('maquette gratuite : ville et style en plus, téléphone facultatif, message adapté', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    afficher();

    await user.click(screen.getByRole('radio', { name: 'Une maquette gratuite d’abord' }));
    expect(screen.getByText(/sous 72 h ouvrées/)).toBeInTheDocument();
    await user.type(screen.getByRole('textbox', { name: /Prénom et nom/ }), complet.nom);
    await user.type(screen.getByRole('textbox', { name: /E-mail/ }), complet.email);
    await user.type(screen.getByRole('combobox', { name: /Votre métier ou activité/ }), complet.activite);
    await user.type(screen.getByRole('textbox', { name: /Votre ville/ }), 'Amiens');
    await user.type(screen.getByRole('textbox', { name: /deux phrases/ }), complet.projet);
    await user.click(screen.getByRole('radio', { name: 'Moderne' }));
    await user.click(screen.getByRole('checkbox', { name: /J'accepte/ }));
    await user.click(screen.getByRole('button', { name: 'Recevoir ma maquette' }));

    expect(await screen.findByRole('status')).toHaveTextContent('72 h ouvrées');
    const envoi = fetchMock.mock.calls[0][1].body as FormData;
    expect(envoi.get('titre')).toBe('Maquette gratuite · Paysagiste');
    expect(String(envoi.get('recapitulatif'))).toContain('Style : Moderne');
  }, 15_000);

  it('propose aussi l’e-mail et le rendez-vous', () => {
    vi.stubGlobal('fetch', vi.fn());
    afficher();
    expect(screen.getByRole('link', { name: /contact@bsandoz.fr/ })).toHaveAttribute('href', 'mailto:contact@bsandoz.fr');
    expect(screen.getByRole('link', { name: /Prendre un rendez-vous gratuit/ })).toHaveAttribute('href', pages.rendezVous.path);
  });
});
