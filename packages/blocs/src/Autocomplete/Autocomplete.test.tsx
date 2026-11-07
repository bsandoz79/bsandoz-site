import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Autocomplete } from './Autocomplete';
import { filtrerSuggestions, normaliser } from './filtre';

const metiers = ['Menuisier', 'Mécanicien', 'Maçon', 'Électricien', 'Plombier', 'Médecin'];

function Champ({ depart = '' }: { depart?: string }) {
  const [valeur, setValeur] = useState(depart);
  return <Autocomplete label="Votre métier" value={valeur} onChange={setValeur} suggestions={metiers} />;
}

describe('filtrerSuggestions', () => {
  it('propose d’abord ce qui commence par la saisie, sans tenir compte des accents ni des majuscules', () => {
    expect(filtrerSuggestions(metiers, 'me')).toEqual(['Menuisier', 'Mécanicien', 'Médecin']);
    expect(filtrerSuggestions(metiers, 'electr')).toEqual(['Électricien']);
    expect(filtrerSuggestions(metiers, 'cien')).toEqual(['Mécanicien', 'Électricien']);
  });

  it('ne propose rien sans saisie, ni la saisie elle-même une fois complète', () => {
    expect(filtrerSuggestions(metiers, '  ')).toEqual([]);
    expect(filtrerSuggestions(metiers, 'plombier')).toEqual([]);
    expect(normaliser(' Électricien ')).toBe('electricien');
  });
});

describe('Autocomplete', () => {
  it('propose de finir le mot pendant la saisie, et se choisit au clic', async () => {
    const user = userEvent.setup();
    render(<Champ />);
    const champ = screen.getByRole('combobox', { name: 'Votre métier' });
    await user.type(champ, 'me');
    expect(champ).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['Menuisier', 'Mécanicien', 'Médecin']);
    await user.click(screen.getByRole('option', { name: 'Menuisier' }));
    expect(champ).toHaveValue('Menuisier');
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
  });

  it('se parcourt au clavier : flèches, Entrée, Échap', async () => {
    const user = userEvent.setup();
    render(<Champ />);
    const champ = screen.getByRole('combobox');
    await user.type(champ, 'm');
    await user.keyboard('{ArrowDown}{ArrowDown}');
    expect(screen.getByRole('option', { name: 'Mécanicien' })).toHaveAttribute('aria-selected', 'true');
    expect(champ.getAttribute('aria-activedescendant')).toBe(screen.getByRole('option', { name: 'Mécanicien' }).id);
    await user.keyboard('{Enter}');
    expect(champ).toHaveValue('Mécanicien');
    await user.clear(champ);
    await user.type(champ, 'p');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
  });

  it('garde une saisie libre quand rien ne convient', async () => {
    const user = userEvent.setup();
    render(<Champ />);
    await user.type(screen.getByRole('combobox'), 'Toiletteur canin');
    expect(screen.getByRole('combobox')).toHaveValue('Toiletteur canin');
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
  });
});
