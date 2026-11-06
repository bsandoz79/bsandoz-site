import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { pages } from '../../data/pages';
import { construireEnvoiContact, messageVide, validerContact } from './contact';
import { ContactRapide } from './ContactRapide';
import { urlEnvoiDevis } from '../../data/devis';

const complet = {
  nom: 'Marie Dupont',
  telephone: '06 12 34 56 78',
  email: 'marie@exemple.fr',
  besoin: 'fonctionnel' as const,
  projet: 'Je suis paysagiste, je voudrais que mes clients réservent en ligne.',
  consentement: true,
};

describe('validerContact', () => {
  it('signale chaque champ manquant ou invalide', () => {
    expect(Object.keys(validerContact(messageVide))).toEqual(['nom', 'telephone', 'email', 'besoin', 'consentement']);
    expect(validerContact({ ...complet, telephone: '12', email: 'x@y' })).toEqual({
      telephone: 'Numéro de téléphone invalide.',
      email: 'Adresse e-mail invalide.',
    });
    expect(validerContact(complet)).toEqual({});
  });

  it('accepte un projet vide (le besoin suffit)', () => {
    expect(validerContact({ ...complet, projet: '' })).toEqual({});
  });
});

describe('construireEnvoiContact', () => {
  it('reprend le contrat de la demande de devis (même destination, même accusé de réception)', () => {
    const donnees = construireEnvoiContact(complet, '');
    expect(donnees.get('nom')).toBe('Marie Dupont');
    expect(donnees.get('email')).toBe('marie@exemple.fr');
    expect(donnees.get('telephone')).toBe('06 12 34 56 78');
    expect(donnees.get('titre')).toBe('Un site avec rendez-vous, devis ou boutique');
    expect(donnees.get('site_web')).toBe('');
    const recapitulatif = String(donnees.get('recapitulatif'));
    expect(recapitulatif).toContain('Origine : Formulaire de contact rapide');
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
    await user.type(screen.getByRole('textbox', { name: /Téléphone/ }), complet.telephone);
    await user.type(screen.getByRole('textbox', { name: /E-mail/ }), complet.email);
    await user.selectOptions(screen.getByRole('combobox', { name: /Votre besoin/ }), 'fonctionnel');
    await user.type(screen.getByRole('textbox', { name: /Votre projet/ }), complet.projet);
    await user.click(screen.getByRole('checkbox', { name: /J'accepte/ }));
  }

  afterEach(() => vi.unstubAllGlobals());

  it('explique les erreurs sans rien envoyer', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    afficher();

    await user.click(screen.getByRole('button', { name: 'Envoyer' }));

    expect(screen.getByText('Indiquez votre nom.')).toBeInTheDocument();
    expect(screen.getByText('Choisissez votre besoin.')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /Votre besoin/ })).toHaveAttribute('aria-invalid', 'true');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('envoie le message et remercie', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    afficher();

    await remplir(user);
    await user.click(screen.getByRole('button', { name: 'Envoyer' }));

    expect(await screen.findByRole('status')).toHaveTextContent('Merci, c’est bien reçu !');
    expect(fetchMock).toHaveBeenCalledWith(urlEnvoiDevis, expect.objectContaining({ method: 'POST' }));
    expect((fetchMock.mock.calls[0][1].body as FormData).get('titre')).toBe('Un site avec rendez-vous, devis ou boutique');
  });

  it('signale un échec et garde les réponses', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 500 })));
    afficher();

    await remplir(user);
    await user.click(screen.getByRole('button', { name: 'Envoyer' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('L’envoi n’a pas abouti.');
    expect(screen.getByRole('textbox', { name: /Prénom et nom/ })).toHaveValue('Marie Dupont');
  });

  it('demande de patienter quand le serveur limite les envois', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 429 })));
    afficher();

    await remplir(user);
    await user.click(screen.getByRole('button', { name: 'Envoyer' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Merci de patienter une minute');
  });

  it('propose aussi l’e-mail, le rendez-vous et le devis détaillé', () => {
    vi.stubGlobal('fetch', vi.fn());
    afficher();
    expect(screen.getByRole('link', { name: /contact@bsandoz.fr/ })).toHaveAttribute('href', 'mailto:contact@bsandoz.fr');
    expect(screen.getByRole('link', { name: /Prendre un rendez-vous gratuit/ })).toHaveAttribute('href', pages.rendezVous.path);
    expect(screen.getByRole('link', { name: 'Ou décrivez votre projet en détail' })).toHaveAttribute('href', pages.devis.path);
  });
});
