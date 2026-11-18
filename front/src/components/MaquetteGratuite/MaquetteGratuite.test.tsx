import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { urlEnvoiDevis } from '../../data/devis';
import { construireEnvoiMaquette, demandeVide, validerMaquette, type DemandeMaquette } from '../../data/maquette';
import { MaquetteGratuite } from './MaquetteGratuite';

const complete: DemandeMaquette = {
  nom: 'Léa Martin',
  entreprise: 'Salon Léa',
  activite: 'Coiffeuse',
  ville: 'Amiens',
  description: 'Coiffure femme et homme, seule dans mon salon.',
  objectif: 'reservation',
  style: 'chaleureux',
  siteActuel: '',
  email: 'lea@exemple.fr',
  telephone: '',
  consentement: true,
};

describe('validerMaquette', () => {
  it('signale les champs obligatoires ; téléphone et site actuel facultatifs', () => {
    expect(Object.keys(validerMaquette(demandeVide))).toEqual(['nom', 'activite', 'ville', 'description', 'email', 'consentement']);
    expect(validerMaquette(complete)).toEqual({});
    expect(validerMaquette({ ...complete, telephone: '12' })).toEqual({ telephone: 'Numéro de téléphone invalide.' });
  });
});

describe('construireEnvoiMaquette', () => {
  it('envoie une demande « Maquette gratuite » avec toutes les réponses', () => {
    const donnees = construireEnvoiMaquette({ ...complete, siteActuel: 'https://ancien.fr' }, '');
    expect(donnees.get('titre')).toBe('Maquette gratuite · Coiffeuse');
    const recap = String(donnees.get('recapitulatif'));
    expect(recap).toContain('Ville : Amiens');
    expect(recap).toContain('Les visiteurs doivent surtout : Réserver en ligne');
    expect(recap).toContain('Style : Chaleureux');
    expect(recap).toContain('Site actuel : https://ancien.fr');
    expect(donnees.get('telephone')).toBe('');
    expect(donnees.get('site_web')).toBe('');
  });
});

describe('MaquetteGratuite', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('envoie la demande et annonce le délai de 72 h ouvrées', async () => {
    const appel = vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal('fetch', appel);
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <MaquetteGratuite />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Voyez d’abord votre page d’accueil');
    await user.type(screen.getByRole('textbox', { name: /Votre nom/ }), 'Léa Martin');
    await user.type(screen.getByRole('combobox', { name: /Votre métier/ }), 'Coiffeuse');
    await user.type(screen.getByRole('textbox', { name: /Votre ville/ }), 'Amiens');
    await user.type(screen.getByRole('textbox', { name: /deux phrases/ }), 'Coiffure femme et homme, seule dans mon salon.');
    await user.click(screen.getByRole('radio', { name: 'Réserver en ligne' }));
    await user.type(screen.getByRole('textbox', { name: /E-mail/ }), 'lea@exemple.fr');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Recevoir ma maquette' }));

    expect(appel).toHaveBeenCalledWith(urlEnvoiDevis, expect.objectContaining({ method: 'POST' }));
    expect(await screen.findByRole('status')).toHaveTextContent('72 h ouvrées');
  });

  it('n’envoie rien tant qu’un champ obligatoire manque', async () => {
    const appel = vi.fn();
    vi.stubGlobal('fetch', appel);
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <MaquetteGratuite />
      </MemoryRouter>,
    );
    await user.click(screen.getByRole('button', { name: 'Recevoir ma maquette' }));
    expect(appel).not.toHaveBeenCalled();
    expect(screen.getByText('Indiquez votre ville.')).toBeInTheDocument();
  });
});
